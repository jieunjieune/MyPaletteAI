package geniuseun.mypaletteai.function.share.controller;

import geniuseun.mypaletteai.function.palette.dao.PaletteRepository;
import geniuseun.mypaletteai.function.make.dto.PaletteResponseDTO;
import geniuseun.mypaletteai.function.make.entity.Color;
import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.share.service.ShareService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/palette/share")
@RequiredArgsConstructor
public class ShareController {

    private final PaletteRepository paletteRepository;
    private final ShareService shareService;

    // 1. URL 공유
    @GetMapping("/{paletteId}")
    public PaletteResponseDTO sharePalette(@PathVariable Long paletteId) {
        Palette palette = paletteRepository.findById(paletteId)
                .orElseThrow(() -> new RuntimeException("팔레트 없음"));

        List<String> colors = palette.getColors().stream()
                .map(Color::getHexCode)
                .collect(Collectors.toList());

        return PaletteResponseDTO.builder()
                .title(palette.getTitle())
                .mainColor(palette.getMainColor())
                .mood(palette.getMood())
                .recommendedColors(colors)
                .message("공유된 팔레트 🌈")
                .build();
    }

    // 2. 이미지 공유 (이미지 URL 반환)
    @GetMapping("/{paletteId}/image")
    public Map<String, String> sharePaletteImage(@PathVariable Long paletteId) {
        Palette palette = shareService.getPalette(paletteId);
        String imageUrl = shareService.generatePaletteImage(palette);

        return Map.of("imageUrl", imageUrl);
    }
}
