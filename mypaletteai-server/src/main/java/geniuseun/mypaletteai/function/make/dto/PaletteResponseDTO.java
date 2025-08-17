package geniuseun.mypaletteai.function.make.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PaletteResponseDTO {
    private String title;
    private String mood;
    private String mainColor;
    private List<String> recommendedColors;
    private String message;
}