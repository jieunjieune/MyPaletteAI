package geniuseun.mypaletteai.function.auth.controller;

import geniuseun.mypaletteai.function.auth.dto.LoginRequest;
import geniuseun.mypaletteai.function.auth.dto.ResetPasswordConfirm;
import geniuseun.mypaletteai.function.auth.dto.ResetPasswordRequest;
import geniuseun.mypaletteai.function.auth.dto.SignupRequest;
import geniuseun.mypaletteai.function.auth.service.AuthService;
import geniuseun.mypaletteai.jwt.TokenDTO;
import geniuseun.mypaletteai.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final TokenProvider tokenProvider;
    private final AuthService authService;

    @PostMapping("/login")
    public TokenDTO login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return ResponseEntity.ok("로그아웃 성공!");
    }

    // 1. 비밀번호 초기화 요청
    @PostMapping("/reset-password-request")
    public ResponseEntity<String> requestRasswordReset(@RequestBody ResetPasswordRequest request) {
        String resetToken = authService.requestPasswordReset(request);
        return ResponseEntity.ok("비밀번호 재설정 요청 성공! 토큰은 서버 로그 확인");
    }

    // 2. 비밀번호 재설정 완료
    @PostMapping("/reset-password-confirm")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordConfirm request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
    }
}
