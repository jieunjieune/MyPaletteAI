package geniuseun.mypaletteai.function.make.service;

import geniuseun.mypaletteai.function.make.dto.PaletteRequestDTO;
import geniuseun.mypaletteai.function.make.dto.PaletteResponseDTO;
import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.make.dao.PaletteRepository;
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

    public PaletteResponseDTO generatePalette(PaletteRequestDTO request, Long userId) {

        // OpenAI로 색 조합 생성
        List<String> recommendedColors = openAiClient.generateColors(request.getMainColor(), request.getMood(), request.getCount());
        String title = openAiClient.generateTitle(request.getMainColor(), request.getMood());

        // Palette 엔티티 저장
        Palette palette = Palette.builder()
                .title(title)
                .mood(request.getMood())
                .mainColor(request.getMainColor())
                .createdBy(userId)
                .createdAt(LocalDateTime.now())
                .build();
        paletteRepository.save(palette);

        // 결과 반환
        return PaletteResponseDTO.builder()
                .title(title)
                .mood(palette.getMood())
                .mainColor(palette.getMainColor())
                .recommendedColors(recommendedColors)
                .message("추천 색조합 생성 완료")
                .build();
    }
}
