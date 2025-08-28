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
        String prompt = "메인 색상 " + mainColor + "과 분위기 '" + mood + "'에 어울리는 팔레트 제목을 공백포함 20자 이내의 한글로 추천해줘.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", List.of(
                Map.of("role", "user", "content", prompt)));
        requestBody.put("max_tokens", 20);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                requestEntity,
                Map.class
        );

        return ((Map<String, Object>) ((Map<String, Object>)
                ((List<Object>) response.getBody().get("choices")).get(0))
                .get("message")).get("content").toString().trim();
    }

    public List<String> generateColors(String mainColor,String mood, int count) {
        String prompt = "메인 색상 " + mainColor +
                " 와 잘 어울리는 다음과 같은" + mood + "분위기의" + count + " 개의 색상(메인컬러 포함) HEX 코드를 추천해줘. " +
                "HEX 코드만 콤마로 구분해서 답해.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", List.of(
                Map.of("role", "user", "content", prompt)));
        requestBody.put("max_tokens", 150);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                requestEntity,
                Map.class
        );

        String content = ((Map<String, Object>) ((Map<String, Object>)
                ((List<Object>) response.getBody().get("choices")).get(0))
                .get("message")).get("content").toString();

        // HEX 코드만 추출
        return Arrays.stream(content.replaceAll("[^#0-9A-Fa-f,]", "").split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
