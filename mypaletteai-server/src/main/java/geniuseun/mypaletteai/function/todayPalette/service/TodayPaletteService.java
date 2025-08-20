package geniuseun.mypaletteai.function.todayPalette.service;

import geniuseun.mypaletteai.function.make.dao.ColorRepository;
import geniuseun.mypaletteai.function.make.dao.PaletteRepository;
import geniuseun.mypaletteai.function.make.dto.PaletteResponseDTO;
import geniuseun.mypaletteai.function.make.entity.Color;
import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.global.ai.OpenAiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TodayPaletteService {

    private final OpenAiClient openAiClient;
    private final PaletteRepository paletteRepository;
    private final ColorRepository colorRepository;

    public PaletteResponseDTO getTodayPalette() {
        LocalDate today = LocalDate.now();

        // 이미 저장된 오늘 팔레트 있는지 확인
        Optional<Palette> existing = paletteRepository.findByCreatedAt(today.atStartOfDay());
        if (existing.isPresent()) {
            Palette palette = existing.get();
            return PaletteResponseDTO.builder()
                    .title(palette.getTitle())
                    .mainColor(palette.getMainColor())
                    .mood(palette.getMood())
                    .recommendedColors( // 컬러 테이블에서 가져오기
                            colorRepository.findByPaletteId(palette.getId())
                                    .stream().map(Color::getHexCode).toList()
                    )
                    .message("오늘의 팔레트 🌈")
                    .build();
        }

        // 없으면 AI 호출해서 새 팔레트 생성
        List<String> colors = openAiClient.generateColors("seasonal", "today mood", 5);
        String title = "오늘의 팔레트 - " + today;

        Palette palette = Palette.builder()
                .title(title)
                .mainColor("무드에맞게")
                .mood("오늘의 무드")
                .createdAt(today.atStartOfDay())
                .build();
        paletteRepository.save(palette);

        // 컬러 저장
        colors.forEach(c -> palette.addColor(new Color(c)));

        return PaletteResponseDTO.builder()
                .title(title)
                .mainColor(colors.get(0))
                .mood("오늘의 무드")
                .recommendedColors(colors)
                .message("오늘의 팔레트 🌅")
                .build();
    }
}
