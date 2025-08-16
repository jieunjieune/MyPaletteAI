package geniuseun.mypaletteai.function.auth.service;

import geniuseun.mypaletteai.function.auth.dao.UserRepository;
import geniuseun.mypaletteai.function.auth.dto.LoginRequest;
import geniuseun.mypaletteai.function.user.entity.User;
import geniuseun.mypaletteai.function.auth.dto.SignupRequest;
import geniuseun.mypaletteai.jwt.TokenDTO;
import geniuseun.mypaletteai.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;

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
                .orElseThrow(()-> new RuntimeException("가입이력이 없는 이메일입니다."));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        String accessToken = tokenProvider.createAccessToken(user.getUserId());
        String refreshToken = tokenProvider.createRefreshToken(user.getUserId());

        return TokenDTO.builder()
                .tokenType("Bearer")
                .userId(user.getUserId())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accessTokenExpiresIn(3600000L) //1시간
                .refreshTokenExpiresIn(1209600000L) //2주
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
}