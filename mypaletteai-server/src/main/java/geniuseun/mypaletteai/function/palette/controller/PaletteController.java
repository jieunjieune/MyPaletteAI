package geniuseun.mypaletteai.function.palette.controller;

import geniuseun.mypaletteai.function.make.dto.PaletteResponseDTO;
import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.palette.service.PaletteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/palettes")
@RequiredArgsConstructor
public class PaletteController {

    private final PaletteService paletteService;

    // 전체 조회
    @GetMapping
    public List<PaletteResponseDTO> getAllPalettes() {
        return paletteService.getAllPalettes();
    }

    // 상세 조회
    @GetMapping("/{id}")
    public PaletteResponseDTO getPalette(@PathVariable Long id) {
        Palette palette = paletteService.getPalette(id);
        return PaletteResponseDTO.builder()
                .paletteId(palette.getId())
                .title(palette.getTitle())
                .mood(palette.getMood())
                .mainColor(palette.getMainColor())
                .recommendedColors(palette.getColors().stream()
                        .map(c -> c.getHexCode())
                        .collect(Collectors.toList()))
                .message("팔레트 상세 조회 성공")
                .build();
    }

    // 특정 userId의 팔레트 조회
    @GetMapping("/user/{userId}")
    public List<PaletteResponseDTO> getPalettesByUser(@PathVariable Long userId) {
        return paletteService.getPalettesByUser(userId);
    }

    // 생성
    @PostMapping
    public Palette createPalette(@RequestBody Palette palette) {
        return paletteService.createPalette(palette);
    }

    // 수정
    @PutMapping("/{id}")
    public Palette updatePalette(@PathVariable Long id, @RequestBody Palette palette) {
        return paletteService.updatePalette(id, palette);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public String deletePalette(@PathVariable Long id) {
        paletteService.deletePalette(id);
        return "삭제 완료";
    }
}