package geniuseun.mypaletteai.function.save.service;

import geniuseun.mypaletteai.function.make.dao.ColorRepository;
import geniuseun.mypaletteai.function.palette.dao.PaletteRepository;
import geniuseun.mypaletteai.function.make.entity.Color;
import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.save.dao.SaveRepository;
import geniuseun.mypaletteai.function.save.dto.SaveResponseDTO;
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
    @Transactional
    public SaveResponseDTO savePalette(Long paletteId, Long userId) {
        if (userId == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }

        Palette palette = paletteRepository.findById(paletteId)
                .orElseThrow(() -> new IllegalArgumentException("팔레트를 찾을 수 없습니다."));

        // 중복 저장 방지
        boolean exists = saveRepository.existsByUserIdAndPalette(userId, palette);
        if (exists) {
            return SaveResponseDTO.builder()
                    .success(false)
                    .message("이미 저장된 팔레트입니다.")
                    .savedPalette(null)
                    .build();
        }

        // SavedPalette 엔티티 저장
        SavedPalette savedEntity = saveRepository.save(
                SavedPalette.builder()
                        .userId(userId)
                        .palette(palette)
                        .savedAt(LocalDateTime.now())
                        .build()
        );

        // 저장된 엔티티를 DTO로 변환
        SavedPaletteDTO dto = SavedPaletteDTO.builder()
                .saveId(savedEntity.getId())
                .paletteId(palette.getId())
                .title(palette.getTitle())
                .mainColor(palette.getMainColor())
                .mood(palette.getMood())
                .colors(
                        palette.getColors().stream()
                                .map(Color::getHexCode)
                                .collect(Collectors.toList())
                )
                .savedAt(savedEntity.getSavedAt())
                .build();

        // 최종 응답
        return SaveResponseDTO.builder()
                .success(true)
                .message("팔레트 저장 완료!")
                .savedPalette(dto) // ✅ 객체 통째로 전달
                .build();
    }

    // 저장된 팔레트 조회 (사용자별)
    @Transactional(readOnly = true)
    public List<SavedPaletteDTO> getSavedPalettesByUser(Long userId) {
        // userId로 저장된 팔레트 전체 조회
        List<SavedPalette> savedList = saveRepository.findByUserId(userId);

        return savedList.stream().map(saved -> {
            Palette palette = saved.getPalette();

            List<String> colors = palette.getColors().stream()
                    .map(Color::getHexCode)
                    .collect(Collectors.toList());

            return SavedPaletteDTO.builder()
                    .saveId(saved.getId())                 // ✅ saveId 매핑
                    .paletteId(palette.getId())            // 원본 팔레트 id
                    .title(palette.getTitle())
                    .mainColor(palette.getMainColor())
                    .mood(palette.getMood())
                    .colors(colors)
                    .savedAt(saved.getSavedAt())           // ✅ 저장 시간 매핑
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
