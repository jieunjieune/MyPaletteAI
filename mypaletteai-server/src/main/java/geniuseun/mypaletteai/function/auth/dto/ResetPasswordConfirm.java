package geniuseun.mypaletteai.function.auth.dto;


import lombok.Data;

@Data
public class ResetPasswordConfirm {
    private String email;
    private String resetToken;
    private String newPassword;
}