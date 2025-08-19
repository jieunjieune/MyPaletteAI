package geniuseun.mypaletteai.global.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
@RequiredArgsConstructor
public class OpenAiClient {

    // Mock
    private boolean mockMode = true;

    public List<String> generatePalette(String mainColor, int count, String mood) {
        if (mockMode) {
            // Mock 데이터: mainColor 포함, 랜덤 색상 추가
            List<String> colors = Arrays.asList(mainColor, "#FF5733", "#33FF57", "#3357FF", "#F1C40F");
            return colors.subList(0, Math.min(count, colors.size()));
        }

        // 실제 OpenAI 호출 로직은 추후 구현
        return List.of();
    }

    @Value("${openai.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<String> generateColors(String mainColor, int count) {
        String prompt = "메인 색상 " + mainColor +
                " 와 잘 어울리는 " + count + " 개의 색상 HEX 코드를 추천해줘. " +
                "HEX 코드만 콤마로 구분해서 답해.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o-mini"); // 또는 gpt-3.5-turbo
        requestBody.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                "https://api.openai.com/v1/chat/completions",
                HttpMethod.POST,
                requestEntity,
                Map.class
        );

        String content = ((Map<String, Object>) ((Map<String, Object>)
                ((List<Object>) response.getBody().get("choices")).get(0))
                .get("message")).get("content").toString();

        // HEX 코드만 추출
        return Arrays.asList(content.replaceAll("[^#0-9A-Fa-f,]", "").split(","));
    }

    @Value("${openai.url}")
    private String apiUrl;

    public String ask(String prompt) {
        System.out.println("✅ apiKey: " + apiKey); // 테스트 로그
        System.out.println("✅ apiUrl: " + apiUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4o-mini");
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);
        return response.getBody();
    }
}
