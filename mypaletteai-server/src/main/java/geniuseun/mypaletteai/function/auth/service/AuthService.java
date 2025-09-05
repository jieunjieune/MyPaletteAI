package geniuseun.mypaletteai.function.auth.service;

import geniuseun.mypaletteai.function.auth.dao.PasswordResetTokenRepository;
import geniuseun.mypaletteai.function.auth.dao.UserRepository;
import geniuseun.mypaletteai.function.auth.dto.*;
import geniuseun.mypaletteai.function.auth.entity.PasswordResetToken;
import geniuseun.mypaletteai.function.user.entity.User;
import geniuseun.mypaletteai.jwt.TokenDTO;
import geniuseun.mypaletteai.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    // 회원가입
    public String signup(SignupRequest request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            return "가입 이력이 있는 이메일입니다.";
        }

        User user = User.builder()
                .email(request.getEmail())
                .nickname(request.getNickname())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
        return "회원가입 성공!";
    }

    // 로그인
    public TokenDTO login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("가입이력이 없는 이메일입니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        String accessToken = tokenProvider.createAccessToken(user.getUserId());
        String refreshToken = tokenProvider.createRefreshToken(user.getUserId());

        return TokenDTO.builder()
                .tokenType("Bearer")
                .userId(user.getUserId())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accessTokenExpiresIn(1000L * 60 * 60)      // 1시간
                .refreshTokenExpiresIn(1000L * 60 * 60 * 24 * 14) // 2주
                .nickname(user.getNickname())
                .build();
    }

    // 리프레시
    public TokenDTO refreshAccessToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("리프레시 토큰이 유효하지 않습니다.");
        }

        Long userId = Long.valueOf(tokenProvider.getUserIdFromToken(refreshToken));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        String newAccessToken = tokenProvider.createAccessToken(userId);

        return TokenDTO.builder()
                .tokenType("Bearer")
                .userId(user.getUserId())
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // 그대로 유지
                .accessTokenExpiresIn(1000L * 60 * 60)
                .refreshTokenExpiresIn(1000L * 60 * 60 * 24 * 14)
                .nickname(user.getNickname())
                .build();
    }

    // 로그아웃
    public void logout(String token) {

        // "Bearer" 제거
        String jwt = token.replace("Bearer", "");

        if (!tokenProvider.validateToken(jwt)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        System.out.println("로그아웃 처리된 토큰: " + jwt);
    }

    // 1️⃣ 비밀번호 초기화 요청
    @Transactional
    public void requestPasswordReset(ResetPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("해당 이메일로 가입된 계정이 없습니다."));

        // 기존 토큰 삭제 (중복 방지)
        tokenRepository.deleteByUserId(user.getUserId());

        // 새 토큰 생성
        String resetToken = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusHours(1);

        PasswordResetToken token = PasswordResetToken.builder()
                .userId(user.getUserId())
                .token(resetToken)
                .expiry(expiry)
                .used(false)
                .build();

        tokenRepository.save(token);

        // 이메일 발송 (링크)
        String resetLink = "http://localhost:3000/auth/reset-password?token=" + resetToken;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        log.info("비밀번호 재설정 토큰 발급 (userId={}): {}", user.getUserId(), resetToken);
    }

    // 2️⃣ 비밀번호 재설정 완료
    @Transactional
    public void resetPassword(ResetPasswordConfirm request) {
        PasswordResetToken token = tokenRepository.findByToken(request.getResetToken())
                .orElseThrow(() -> new RuntimeException("유효하지 않은 토큰"));

        if (token.getUsed()) throw new RuntimeException("이미 사용된 토큰입니다.");
        if (LocalDateTime.now().isAfter(token.getExpiry())) throw new RuntimeException("토큰 만료");

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        token.setUsed(true); // 사용 표시
        tokenRepository.save(token);

        log.info("비밀번호 변경 완료 (userId={})", user.getUserId());
    }
}