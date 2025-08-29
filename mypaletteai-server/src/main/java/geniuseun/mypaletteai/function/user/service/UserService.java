package geniuseun.mypaletteai.function.user.service;

import geniuseun.mypaletteai.function.auth.dao.UserRepository;
import geniuseun.mypaletteai.function.user.dto.UserDTO;
import geniuseun.mypaletteai.function.user.dto.UserUpdateRequest;
import geniuseun.mypaletteai.function.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("회원 없음"));
        return UserDTO.fromEntity(user);
    }

    public UserDTO updateUser(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("회원 없음"));

        if(request.getNickname() != null) user.setNickname(request.getNickname());
        if(request.getPassword() != null) user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        return UserDTO.fromEntity(user);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
