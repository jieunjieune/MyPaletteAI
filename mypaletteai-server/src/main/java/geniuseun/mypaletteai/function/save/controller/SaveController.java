package geniuseun.mypaletteai.function.save.controller;

import geniuseun.mypaletteai.function.auth.dao.UserRepository;
import geniuseun.mypaletteai.function.save.dto.SaveResponseDTO;
import geniuseun.mypaletteai.function.save.dto.SavedPaletteDTO;
import geniuseun.mypaletteai.function.save.service.SaveService;
import geniuseun.mypaletteai.function.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/save")
@RequiredArgsConstructor
public class SaveController {

    private final SaveService saveService;

    // 팔레트 저장
    @PostMapping("/{paletteId}")
    public SaveResponseDTO savePalette(@PathVariable Long paletteId,
                                       Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }

        // JWT에서 sub(userId) 바로 가져오기
        Long userId = Long.valueOf(authentication.getName());

        return saveService.savePalette(paletteId, userId);
    }

    // 사용자 저장 팔레트 조회
    @GetMapping
    public List<SavedPaletteDTO> getSavedPalettesByUser(Authentication authentication) {
        if (authentication == null) throw new RuntimeException("로그인이 필요합니다.");
        Long userId = Long.valueOf(authentication.getName());
        return saveService.getSavedPalettesByUser(userId);
    }

    // 저장 팔레트 삭제
    @DeleteMapping("/{saveId}")
    public String deleteSavedPalette(@PathVariable Long saveId, Authentication authentication) {
        if (authentication == null) throw new RuntimeException("로그인이 필요합니다.");
        Long userId = Long.valueOf(authentication.getName());
        saveService.deleteSavedPalette(saveId, userId);
        return "삭제 완료";
    }
}