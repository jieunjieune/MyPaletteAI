package geniuseun.mypaletteai.function.make.dto;

import lombok.Data;

@Data
public class PaletteRequestDTO {
    private String title;
    private String mood;
    private String mainColor; // HEX
    private int count; // 추천 색조합 개수
}
