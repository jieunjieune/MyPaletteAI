package geniuseun.mypaletteai.function.make.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaletteRequestDTO {
    private String mood;
    private String mainColor; // HEX
    private int count; // 추천 색조합 개수
    private Long userId;
}
