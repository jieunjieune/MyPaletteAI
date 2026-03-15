package geniuseun.mypaletteai.global.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OpenAiClient {

    @Value("${openai.api-key}")
    private String apiKey;
    @Value("${openai.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateTitle(List<String> colors, String mood) {

        String systemPrompt = """
            너는 감성적인 색상 팔레트 이름을 만드는 전문 AI다.
            반드시 조건을 지켜라:
            - 한글만 사용
            - 15자 이내
            - 서정적 표현
            - 설명 없이 제목 하나만 출력
            - 번호, 따옴표, 줄바꿈 절대 금지
            - 흔한 팔레트 이름(빛, 속삭임, 노을, 푸른, 꿈, 햇살) 반복 금지
            - 매번 새로운 단어 조합을 만들어라
        """;

        String userPrompt =
                "팔레트 색상: " + String.join(" ", colors) +
                        ", 분위기: " + mood +
                        ". 이 색 조합에 어울리는 팔레트 이름 하나 생성.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4.1-mini");
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
        ));
        requestBody.put("max_tokens", 20);
        requestBody.put("temperature", 1.0);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> requestEntity =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                requestEntity,
                Map.class
        );

        String result = ((Map<String, Object>) ((Map<String, Object>)
                ((List<Object>) response.getBody().get("choices")).get(0))
                .get("message")).get("content").toString().trim();

        return result;
    }

    public List<String> generateColors(String mainColor, String mood, int count) {

        String systemPrompt = """
        너는 색상 팔레트를 생성하는 전문 컬러 AI다.

        출력 규칙:
        - HEX 코드만 출력 (#RRGGBB, 6자리)
        - 쉼표로만 구분, 공백과 설명 금지
        - 정확히 요청된 개수만 출력
        - 색상 중복 금지
        - 메인 색상 반드시 포함
        
        팔레트 구조:
        - 메인 색상 반드시 포함
        - 충분히 밝은 배경색 1개 반드시 포함 (필요에 따라 2개)
        - 충분히 어두운 텍스트색 1개 반드시 포함
        - 조화를 이루는 보조색 1~2개 포함
        - 필요 시 포인트 색상 1개 추가
        - 색상은 명도 순서로 자연스럽게 배열
        - 밝은 색 → 중간 색 → 어두운 색 흐름 유지
        
        컬러 설계:
        - 명도와 채도의 균형 유지
        - 유사색과 대비색을 적절히 혼합 (보색 과다 사용 금지)
        - 색상 hue 분포를 넓게 사용하되 조화 유지
        - 색상 간 충분한 대비 확보
        - 웹 UI 디자인에 자연스럽고 실용적인 팔레트
        - 단순히 같은 색의 명도/채도만 변경한 팔레트 금지
        
        제한:
        - 네온색 및 과도한 채도 금지
        - #FFFFFF와 #000000 최소 사용
        """;

        String userPrompt =
                "메인 색상: " + mainColor +
                        ", 분위기: '" + mood +
                        "'. 팔레트 색상 " + count + "개 생성.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4.1-mini");
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
        ));
        requestBody.put("max_tokens", 100);
        requestBody.put("temperature", 0.7); // 안정성 ↑

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> requestEntity =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                requestEntity,
                Map.class
        );

        String content = ((Map<String, Object>) ((Map<String, Object>)
                ((List<Object>) response.getBody().get("choices")).get(0))
                .get("message")).get("content").toString();

        return Arrays.stream(content.replaceAll("[^#0-9A-Fa-f,]", "").split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
