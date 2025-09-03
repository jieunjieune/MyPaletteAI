package geniuseun.mypaletteai.function.make.service;

import geniuseun.mypaletteai.function.make.dao.ColorRepository;
import geniuseun.mypaletteai.function.make.dto.PaletteRequestDTO;
import geniuseun.mypaletteai.function.make.dto.PaletteResponseDTO;
import geniuseun.mypaletteai.function.make.entity.Color;
import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.palette.dao.PaletteRepository;
import geniuseun.mypaletteai.global.ai.OpenAiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MakeService {

    private final PaletteRepository paletteRepository;
    private final OpenAiClient openAiClient;
    private final ColorRepository colorRepository;

    public PaletteResponseDTO generatePalette(PaletteRequestDTO request, Long userId) {

        // OpenAI로 색 조합 생성
        List<String> recommendedColors = openAiClient.generateColors(request.getMainColor(), request.getMood(), request.getCount());
        String title = openAiClient.generateTitle(request.getMainColor(), request.getMood());

        // 큰따옴표, 작은따옴표 제거
        title = title.replace("\"", "").replace("'", "");

        // Palette 엔티티 저장
        Palette palette = Palette.builder()
                .title(title)
                .mood(request.getMood())
                .mainColor(request.getMainColor())
                .createdBy(request.getUserId())
                .createdAt(LocalDateTime.now())
                .build();
        paletteRepository.save(palette);

        for (String hex : recommendedColors) {
            Color color = Color.builder()
                    .palette(palette)   // ManyToOne 연결
                    .hexCode(hex)
                    .index(recommendedColors.indexOf(hex) + 1)
                    .build();
            colorRepository.save(color);
        }

        // 결과 반환
        return PaletteResponseDTO.builder()
                .paletteId(palette.getId())
                .title(title)
                .mood(palette.getMood())
                .mainColor(palette.getMainColor())
                .recommendedColors(recommendedColors)
                .message("추천 색조합 생성 완료")
                .build();
    }
}
