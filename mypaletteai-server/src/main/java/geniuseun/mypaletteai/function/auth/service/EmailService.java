package geniuseun.mypaletteai.function.auth.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {

        try {

            URL url = new URL("https://api.resend.com/emails");

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + resendApiKey);
            conn.setRequestProperty("Content-Type", "application/json");

            conn.setDoOutput(true);

            String jsonInput = """
            {
              "from": "MyPaletteAI <onboarding@resend.dev>",
              "to": ["%s"],
              "subject": "[My Palette AI] 비밀번호 재설정 안내",
              "html": "<h3>안녕하세요 😊</h3><p>아래 링크 클릭:</p><a href=\\"%s\\">비밀번호 재설정</a>"
            }
            """.formatted(toEmail, resetLink);

            try(OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInput.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int code = conn.getResponseCode();

            if(code != 200 && code != 201) {
                throw new RuntimeException("메일 전송 실패: HTTP " + code);
            }

        } catch (Exception e) {
            throw new RuntimeException("메일 전송 실패", e);
        }
    }
}

