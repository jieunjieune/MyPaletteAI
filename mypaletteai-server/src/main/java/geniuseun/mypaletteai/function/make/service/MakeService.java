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
        // Mock 색상 생성
        var recommended = openAiClient.generatePalette(request.getMainColor(), request.getCount(), request.getMood());

        return PaletteResponseDTO.builder()
                .title(request.getTitle())
                .mood(request.getMood())
                .mainColor(request.getMainColor())
                .recommendedColors(recommended)
                .message("추천 색조합 생성 완료 (Mock)")
                .build();
    }

//    public PaletteResponseDTO generatePalette(PaletteRequestDTO request, Long userId) {
//        List<String> recommended = openAiClient.generateColors(request.getMainColor(), request.getCount());
//
//        Palette palette = Palette.builder()
//                .title(request.getTitle())
//                .mood(request.getMood())
//                .mainColor(request.getMainColor())
//                .createdBy(userId)
//                .createdAt(LocalDateTime.now())
//                .build();
//
//        paletteRepository.save(palette);
//
//        return PaletteResponseDTO.builder()
//                .title(palette.getTitle())
//                .mood(palette.getMood())
//                .mainColor(palette.getMainColor())
//                .recommendedColors(recommended)
//                .message("추천 색조합 생성 완료")
//                .build();
//    }
}
