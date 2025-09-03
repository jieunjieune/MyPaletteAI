package geniuseun.mypaletteai.function.save.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class SaveResponseDTO {
    private boolean success;
    private String message;
    private SavedPaletteDTO savedPalette;
}
