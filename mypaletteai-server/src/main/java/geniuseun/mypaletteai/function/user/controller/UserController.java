package geniuseun.mypaletteai.function.user.controller;

import geniuseun.mypaletteai.function.user.dto.UserDTO;
import geniuseun.mypaletteai.function.user.dto.UserUpdateRequest;
import geniuseun.mypaletteai.function.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 전체 회원 조회 (관리자)
    @GetMapping("/all")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // 회원 상세 조회
    @GetMapping("/{userId}")
    public UserDTO getUser(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    // 회원 정보 수정
    @PutMapping("/{userId}")
    public UserDTO updateUser(@PathVariable Long userId, @RequestBody UserUpdateRequest request) {
        return userService.updateUser(userId, request);
    }

    // 회원 삭제
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("회원 삭제 완료");
    }
}
