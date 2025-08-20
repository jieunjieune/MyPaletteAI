package geniuseun.mypaletteai.function.save.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class SavedPaletteDTO {
    private Long saveId;
    private Long paletteId;        // 원본 팔레트 id
    private String title;
    private String mainColor;
    private String mood;
    private List<String> colors;   // 색상 목록
    private LocalDateTime savedAt;
}