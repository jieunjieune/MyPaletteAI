package geniuseun.mypaletteai.function.make.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "color_palette")
@Data
@Builder
@AllArgsConstructor
public class Palette {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "palette_id")
    private Long id;

    @Column(name = "palette_title", nullable = false)
    private String title;

    @Column(name = "palette_mood")
    private String mood;

    @Column(name = "palette_main_color", length = 7)
    private String mainColor;

    @Column(name = "palette_created_by")
    private Long createdBy; // 나중에 User 엔티티와 @ManyToOne 연결 가능

    @Column(name = "palette_created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "palette", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Color> colors;

    public Palette() {
        this.colors = new ArrayList<>();
    }

    public void addColor(Color color) {
        if (colors == null) {
            colors = new ArrayList<>();
        }
        colors.add(color);
        color.setPalette(this);
    }
}
