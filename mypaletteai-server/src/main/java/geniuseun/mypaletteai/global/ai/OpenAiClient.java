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

    public String generateTitle(String mainColor, String mood) {

        String systemPrompt = """
        너는 감성적인 색상 팔레트 이름을 만드는 전문 AI다.
        반드시 조건을 지켜라:
        - 한글만 사용
        - 15자 이내
        - 서정적이고 자연스러운 표현
        - 설명 없이 제목 하나만 출력
        - 번호, 따옴표, 줄바꿈 절대 금지
        """;

        String userPrompt = "메인 색상: " + mainColor +
                ", 분위기: '" + mood + "' 에 어울리는 팔레트 제목 하나 추천.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4.1-mini");
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
        ));
        requestBody.put("max_tokens", 20);
        requestBody.put("temperature", 0.9);

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

        반드시 아래 규칙을 지켜라:
        - HEX 코드만 출력 (#RRGGBB), 6자리만
        - 쉼표로만 구분, 공백 금지, 설명 금지
        - 정확히 요청 개수만 출력, 색상 중복 금지
        - 메인 색상 반드시 포함
        - 명도와 채도를 고려, 필요 시 유사색/보색 적절히 활용 (보색 과도 사용 금지)
        - 같은 채도 내에서는 명도 기준으로 어두운 색 → 밝은 색 순
        - 네온색, 과도한 채도 제외
        - 웹 UI 디자인에 적합한 컬러 팔레트
        - 색상 간 충분한 대비 유지
        - 완전한 흰색(#FFFFFF)과 검은색(#000000) 최소 사용
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
