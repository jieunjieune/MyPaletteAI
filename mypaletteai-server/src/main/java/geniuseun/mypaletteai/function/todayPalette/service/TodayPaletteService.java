package geniuseun.mypaletteai.function.todayPalette.service;

import geniuseun.mypaletteai.function.palette.dao.PaletteRepository;
import geniuseun.mypaletteai.function.make.dao.ColorRepository;
import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.make.entity.Color;
import geniuseun.mypaletteai.function.make.dto.PaletteResponseDTO;
import geniuseun.mypaletteai.global.ai.OpenAiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodayPaletteService {

    private final PaletteRepository paletteRepository;
    private final ColorRepository colorRepository;
    private final OpenAiClient openAiClient;

    @Transactional
    public PaletteResponseDTO getTodayPalette() {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));

        // 1. 오늘 날짜 팔레트 조회
        Optional<Palette> optionalPalette = paletteRepository.findByCreatedAt(today.atStartOfDay());
        if (optionalPalette.isPresent()) {
            Palette palette = optionalPalette.get();

            List<String> colors = palette.getColors().stream()
                    .map(Color::getHexCode)
                    .collect(Collectors.toList());

            return PaletteResponseDTO.builder()
                    .paletteId(palette.getId())
                    .title(palette.getTitle())
                    .mainColor(palette.getMainColor())
                    .mood(palette.getMood())
                    .recommendedColors(colors)
                    .message("오늘의 팔레트 🌅")
                    .build();
        }

        // 2. 팔레트 없으면 AI 호출해서 생성
        List<String> colors = openAiClient.generateColors("무드와맞게", "현재 계절, 날씨, 분위기에 맞게", 5);
        String title = "오늘의 팔레트 (" + today.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + ")";

        Palette palette = Palette.builder()
                .title(title)
                .mainColor(colors.get(0))
                .mood("오늘의 무드")
                .createdAt(today.atStartOfDay())
                .build();

        // 3. 컬러 객체 연결
        colors.forEach(hex -> palette.addColor(new Color(hex)));

        // 4. 저장 (Cascade.ALL 덕분에 컬러도 같이 저장됨)
        paletteRepository.save(palette);

        // 5. DTO 반환
        return PaletteResponseDTO.builder()
                .title(title)
                .mainColor(colors.get(0))
                .mood("오늘의 무드")
                .recommendedColors(colors)
                .message("오늘의 팔레트 🌅")
                .build();
    }
}