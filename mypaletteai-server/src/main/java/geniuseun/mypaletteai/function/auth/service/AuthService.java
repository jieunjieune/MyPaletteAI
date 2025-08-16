package geniuseun.mypaletteai.function.auth.service;

import geniuseun.mypaletteai.function.auth.dao.UserRepository;
import geniuseun.mypaletteai.function.user.entity.User;
import geniuseun.mypaletteai.function.auth.dto.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

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
}