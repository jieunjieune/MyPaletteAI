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

        // 중복 저장 체크
        boolean exists = saveRepository.existsByUserIdAndPalette(userId, palette);
        if (exists) {
            SavedPalette existing = saveRepository.findByUserIdAndPalette(userId, palette)
                    .orElseThrow(() -> new RuntimeException("저장된 팔레트를 찾을 수 없습니다."));

            SavedPaletteDTO dto = convertToDTO(existing);
            return SaveResponseDTO.builder()
                    .success(false)
                    .message("이미 저장된 팔레트입니다.")
                    .savedPalette(dto)
                    .build();
        }

        // 새 엔티티 저장
        SavedPalette savedEntity = saveRepository.save(
                SavedPalette.builder()
                        .userId(userId)
                        .palette(palette)
                        .savedAt(LocalDateTime.now())
                        .build()
        );

        SavedPaletteDTO dto = convertToDTO(savedEntity);

        return SaveResponseDTO.builder()
                .success(true)
                .message("팔레트 저장 완료!")
                .savedPalette(dto)
                .build();
    }

    // 저장된 팔레트 조회 (사용자별)
    @Transactional(readOnly = true)
    public List<SavedPaletteDTO> getSavedPalettesByUser(Long userId) {
        List<SavedPalette> savedList = saveRepository.findByUserId(userId);
        return savedList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 저장된 팔레트 삭제
    @Transactional
    public void deleteSavedPalette(Long saveId, Long userId) {
        SavedPalette save = saveRepository.findByIdAndUserId(saveId, userId)
                .orElseThrow(() -> new RuntimeException("저장된 팔레트가 없습니다."));
        saveRepository.delete(save);
    }

    // DTO 변환 공통 메서드
    private SavedPaletteDTO convertToDTO(SavedPalette saved) {
        Palette palette = saved.getPalette();
        List<String> colors = palette.getColors().stream()
                .map(Color::getHexCode)
                .collect(Collectors.toList());

        return SavedPaletteDTO.builder()
                .saveId(saved.getId())
                .paletteId(palette.getId())
                .title(palette.getTitle())
                .mainColor(palette.getMainColor())
                .mood(palette.getMood())
                .colors(colors)
                .savedAt(saved.getSavedAt())
                .build();
    }
}