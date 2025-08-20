package geniuseun.mypaletteai.function.todayPalette.controller;

import geniuseun.mypaletteai.function.make.dto.PaletteResponseDTO;
import geniuseun.mypaletteai.function.todayPalette.service.TodayPaletteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/today")
@RequiredArgsConstructor
public class TodayPaletteController {

    private final TodayPaletteService todayPaletteService;

    @GetMapping
    public PaletteResponseDTO getTodayPalette() {
        return todayPaletteService.getTodayPalette();
    }
}
