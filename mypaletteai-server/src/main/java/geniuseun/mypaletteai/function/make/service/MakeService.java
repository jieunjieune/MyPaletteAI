package geniuseun.mypaletteai.function.make.service;

import geniuseun.mypaletteai.function.make.dto.PaletteRequestDTO;
import geniuseun.mypaletteai.function.make.dto.PaletteResponseDTO;
import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.make.dao.PaletteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MakeService {

    private final PaletteRepository paletteRepository;

    public PaletteResponseDTO generatePalette(PaletteRequestDTO request, Long userId) {

        // TODO: 실제 AI 추천 로직 연결
        List<String> recommended = new ArrayList<>();
        recommended.add(request.getMainColor());
        while(recommended.size() < request.getCount()) {
            recommended.add("#" + Integer.toHexString((int)(Math.random() * 0xFFFFFF)));
        }

        Palette palette = Palette.builder()
                .title(request.getTitle())
                .mood(request.getMood())
                .mainColor(request.getMainColor())
                .createdBy(userId)
                .createdAt(LocalDateTime.now())
                .build();

        paletteRepository.save(palette);

        return PaletteResponseDTO.builder()
                .title(palette.getTitle())
                .mood(palette.getMood())
                .mainColor(palette.getMainColor())
                .recommendedColors(recommended)
                .message("추천 색조합 생성 완료")
                .build();
    }
}
