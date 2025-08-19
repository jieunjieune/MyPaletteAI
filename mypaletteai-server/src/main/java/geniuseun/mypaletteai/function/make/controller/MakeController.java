package geniuseun.mypaletteai.function.make.controller;

import geniuseun.mypaletteai.function.make.dto.PaletteRequestDTO;
import geniuseun.mypaletteai.function.make.dto.PaletteResponseDTO;
import geniuseun.mypaletteai.function.make.service.MakeService;
import geniuseun.mypaletteai.global.ai.OpenAiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/make")
@RequiredArgsConstructor
public class MakeController {

    private final MakeService makeService;
    private final OpenAiClient openAiClient;

    // 색조합 생성
    @PostMapping("/palette")
    public PaletteResponseDTO createPalette(@RequestBody PaletteRequestDTO request) {
        Long userId = 1L; // 테스트용 하드코딩
        return makeService.generatePalette(request, userId);
    }

    // 테스트용: 단일 색상 추천 확인
    @GetMapping("/test")
    public List<String> generateColors(String mainColor, String mood, int count) {
        return openAiClient.generateColors(mainColor, mood, count);
    }
}
