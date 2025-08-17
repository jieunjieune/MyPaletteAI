package geniuseun.mypaletteai.function.make.controller;

import geniuseun.mypaletteai.function.make.dto.PaletteRequestDTO;
import geniuseun.mypaletteai.function.make.dto.PaletteResponseDTO;
import geniuseun.mypaletteai.function.make.service.MakeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/make")
@RequiredArgsConstructor
public class MakeController {

    private final MakeService makeService;

    @PostMapping("/palette")
    public PaletteResponseDTO createPalette(@RequestBody PaletteRequestDTO request) {
        Long userId = 1L; // 테스트용
        return makeService.generatePalette(request, userId);
    }
}
