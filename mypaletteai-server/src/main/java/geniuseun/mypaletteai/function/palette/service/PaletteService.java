package geniuseun.mypaletteai.function.palette.service;

import geniuseun.mypaletteai.function.make.dto.PaletteResponseDTO;
import geniuseun.mypaletteai.function.make.entity.Color;
import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.palette.dao.PaletteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaletteService {

    private final PaletteRepository paletteRepository;

    // 전체 조회
    public List<PaletteResponseDTO> getAllPalettes() {
        List<Palette> palettes = paletteRepository.findAll();

        return palettes.stream()
                .map(palette -> PaletteResponseDTO.builder()
                        .paletteId(palette.getId())
                        .title(palette.getTitle())
                        .mood(palette.getMood())
                        .mainColor(palette.getMainColor())
                        .recommendedColors(
                                palette.getColors().stream()
                                        .map(Color::getHexCode)
                                        .collect(Collectors.toList())
                        )
                        .message("팔레트 조회 성공")
                        .build()
                ).collect(Collectors.toList());
    }

    // 상세 조회
    @Transactional(readOnly = true)
    public Palette getPalette(Long id) {
        return paletteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("팔레트를 찾을 수 없습니다."));
    }

    // 특정 userId 기준 팔레트 조회
    public List<PaletteResponseDTO> getPalettesByUser(Long userId) {
        List<Palette> palettes = paletteRepository.findByCreatedBy(userId);

        return palettes.stream()
                .map(palette -> PaletteResponseDTO.builder()
                        .paletteId(palette.getId())
                        .title(palette.getTitle())
                        .mood(palette.getMood())
                        .mainColor(palette.getMainColor())
                        .recommendedColors(
                                palette.getColors().stream()
                                        .map(Color::getHexCode)
                                        .collect(Collectors.toList())
                        )
                        .message("사용자 팔레트 조회 성공")
                        .build()
                )
                .collect(Collectors.toList());
    }

    // 생성
    @Transactional
    public Palette createPalette(Palette palette) {
        return paletteRepository.save(palette);
    }

    // 수정
    @Transactional
    public Palette updatePalette(Long id, Palette updated) {
        Palette palette = paletteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("팔레트를 찾을 수 없습니다."));

        palette.setTitle(updated.getTitle());
        palette.setMood(updated.getMood());
        palette.setMainColor(updated.getMainColor());

        return paletteRepository.save(palette);
    }

    // 삭제
    @Transactional
    public void deletePalette(Long id) {
        paletteRepository.deleteById(id);
    }
}
