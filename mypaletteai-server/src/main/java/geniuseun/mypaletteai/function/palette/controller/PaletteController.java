package geniuseun.mypaletteai.function.palette.controller;

import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.palette.service.PaletteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/palettes")
@RequiredArgsConstructor
public class PaletteController {

    private final PaletteService paletteService;

    // 전체 조회
    @GetMapping
    public List<Palette> getAllPalettes() {
        return paletteService.getAllPalettes();
    }

    // 상세 조회
    @GetMapping("/{id}")
    public Palette getPalette(@PathVariable Long id) {
        return paletteService.getPalette(id);
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