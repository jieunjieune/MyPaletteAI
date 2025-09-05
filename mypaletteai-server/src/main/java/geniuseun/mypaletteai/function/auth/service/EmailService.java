package geniuseun.mypaletteai.function.auth.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("[My Palette AI] 비밀번호 재설정 안내");
            helper.setText(
                    "<h3>안녕하세요 😊</h3>" +
                            "<p>아래 버튼을 눌러 비밀번호를 재설정하세요:</p>" +
                            "<a href=\"" + resetLink + "\">비밀번호 재설정</a>" +
                            "<br><br>" +
                            "<p>감사합니다.<br>MyPaletteAI 팀 드림</p>",
                    true
            );

            helper.setFrom("your-email@gmail.com", "MyPaletteAI");

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("메일 전송 실패", e);
        }
    }
}
