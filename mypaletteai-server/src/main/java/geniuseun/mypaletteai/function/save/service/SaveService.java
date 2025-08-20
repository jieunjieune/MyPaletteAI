package geniuseun.mypaletteai.function.save.service;

import geniuseun.mypaletteai.function.make.dao.PaletteRepository;
import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.save.dao.SaveRepository;
import geniuseun.mypaletteai.function.save.entity.SavedPalette;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaveService {

    private final SaveRepository saveRepository;
    private final PaletteRepository paletteRepository;

    public String savePalette(Long paletteId, Long userId) {
        Palette palette = paletteRepository.findById(paletteId)
                .orElseThrow(() -> new IllegalArgumentException("팔레트를 찾을 수 없습니다."));

        SavedPalette saved = SavedPalette.builder()
                .userId(userId)
                .palette(palette)
                .savedAt(LocalDateTime.now())
                .build();

        saveRepository.save(saved);

        return "팔레트 저장 완료!";
    }

    public List<SavedPalette> getSavedPalettes(Long userId) {
        return saveRepository.findByUserId(userId);
    }
}
