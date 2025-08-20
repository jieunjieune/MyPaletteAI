package geniuseun.mypaletteai.function.save.controller;

import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.save.dto.SavedPaletteDTO;
import geniuseun.mypaletteai.function.save.entity.SavedPalette;
import geniuseun.mypaletteai.function.save.service.SaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/save")
@RequiredArgsConstructor
public class SaveController {

    private final SaveService saveService;

    // 팔레트 저장
    @PostMapping("/{paletteId}")
    public String savePalette(@PathVariable Long paletteId) {
        Long userId = 1L; // 테스트용 하드코딩
        return saveService.savePalette(paletteId, userId);
    }

    // 사용자 저장 팔레트 조회
    @GetMapping
    public List<SavedPaletteDTO> getSavedPalettesByUser(@RequestParam Long userId) {
        return saveService.getSavedPalettesByUser(userId);
    }

    // 저장 팔레트 삭제
    @DeleteMapping("/{saveId}")
    public String deleteSavedPalette(@PathVariable Long saveId, @RequestParam Long userId) {
        saveService.deleteSavedPalette(saveId, userId);
        return "삭제 완료";
    }
}
