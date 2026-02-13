package geniuseun.mypaletteai.function.auth.controller;

import geniuseun.mypaletteai.function.auth.dao.UserRepository;
import geniuseun.mypaletteai.function.auth.dto.LoginRequest;
import geniuseun.mypaletteai.function.auth.dto.ResetPasswordConfirm;
import geniuseun.mypaletteai.function.auth.dto.ResetPasswordRequest;
import geniuseun.mypaletteai.function.auth.dto.SignupRequest;
import geniuseun.mypaletteai.function.auth.service.AuthService;
import geniuseun.mypaletteai.jwt.TokenDTO;
import geniuseun.mypaletteai.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final TokenProvider tokenProvider;
    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(@RequestBody LoginRequest request) {
        TokenDTO tokenDTO = authService.login(request);

        // 🔹 Refresh Token을 HttpOnly 쿠키로 설정
        ResponseCookie cookie = ResponseCookie.from("refreshToken", tokenDTO.getRefreshToken())
                .httpOnly(true)   // JS 접근 불가
                .secure(false)    // HTTPS 환경이면 true
                .path("/")        // 전체 경로에서 사용 가능
                .maxAge(60 * 60 * 24 * 14) // 2주
                .sameSite("None")
                .secure(true)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(tokenDTO);  // 프론트에는 accessToken + user info 반환
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenDTO> refreshAccessToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken
    ) {
        if (refreshToken == null || !tokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("리프레시 토큰이 유효하지 않습니다.");
        }

        TokenDTO tokenDTO = authService.refreshAccessToken(refreshToken);

        return ResponseEntity.ok(tokenDTO);
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
    public ResponseEntity<?> requestPasswordReset(@RequestBody ResetPasswordRequest request) {
        try {
            authService.requestPasswordReset(request);
            return ResponseEntity.ok("비밀번호 재설정 요청 성공! 이메일을 확인하세요.");
        } catch (RuntimeException e) {
            log.error("메일 전송 실패", e);
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // 2. 비밀번호 재설정 완료
    @PostMapping("/reset-password-confirm")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordConfirm request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (RuntimeException e) {
            log.error("비밀번호 변경 실패", e);
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // 닉네임 중복 체크
    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        boolean exists = userRepository.existsByNickname(nickname);
        Map<String, Object> result = new HashMap<>();
        result.put("available", !exists);
        result.put("message", exists ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다.");
        return ResponseEntity.ok(result);
    }
}
