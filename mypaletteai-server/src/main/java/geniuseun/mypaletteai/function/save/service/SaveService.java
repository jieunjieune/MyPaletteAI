package geniuseun.mypaletteai.function.save.service;

import geniuseun.mypaletteai.function.make.dao.ColorRepository;
import geniuseun.mypaletteai.function.palette.dao.PaletteRepository;
import geniuseun.mypaletteai.function.make.entity.Color;
import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.save.dao.SaveRepository;
import geniuseun.mypaletteai.function.save.dto.SavedPaletteDTO;
import geniuseun.mypaletteai.function.save.entity.SavedPalette;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaveService {

    private final SaveRepository saveRepository;
    private final PaletteRepository paletteRepository;
    private final ColorRepository colorRepository;

    // 팔레트 저장
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

    // 저장된 팔레트 조회 (사용자별)
    @Transactional(readOnly = true)
    public List<SavedPaletteDTO> getSavedPalettesByUser(Long userId) {
        // userId로 저장된 팔레트 전체 조회
        List<SavedPalette> savedList = saveRepository.findByUserId(userId);

        return savedList.stream().map(SavedPalette -> {
            Palette palette = SavedPalette.getPalette(); // Save 엔티티에서 연결된 Palette 가져오기
            List<String> colors = colorRepository.findByPaletteId(palette.getId())
                    .stream()
                    .map(Color::getHexCode)
                    .collect(Collectors.toList());

            return SavedPaletteDTO.builder()
                    .paletteId(palette.getId())
                    .title(palette.getTitle())
                    .mainColor(palette.getMainColor())
                    .mood(palette.getMood())
                    .colors(colors)
                    .build();
        }).collect(Collectors.toList());
    }


    // 저장된 팔레트 삭제
    public void deleteSavedPalette(Long saveId, Long userId) {
        SavedPalette save = saveRepository.findByIdAndUserId(saveId, userId)
                .orElseThrow(() -> new RuntimeException("저장된 팔레트가 없습니다."));
        saveRepository.delete(save);
    }
}
