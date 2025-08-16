package geniuseun.mypaletteai.function.auth.controller;

import geniuseun.mypaletteai.function.auth.dto.LoginRequest;
import geniuseun.mypaletteai.function.auth.dto.SignupRequest;
import geniuseun.mypaletteai.function.auth.service.AuthService;
import geniuseun.mypaletteai.jwt.TokenDTO;
import geniuseun.mypaletteai.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final TokenProvider tokenProvider;
    private final AuthService authService;

//    @PostMapping("/login")
//    public TokenDTO login(@RequestParam Long userId) {
//        String accessToken = tokenProvider.createAccessToken(userId);
//        String refreshToken = tokenProvider.createRefreshToken(userId);
//
//        return TokenDTO.builder()
//                .tokenType("Bearer")
//                .userId(userId)
//                .accessToken(accessToken)
//                .refreshToken(refreshToken)
//                .accessTokenExpiresIn(3600000L)
//                .refreshTokenExpiresIn(1209600000L)
//                .build();
//    }

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
}
