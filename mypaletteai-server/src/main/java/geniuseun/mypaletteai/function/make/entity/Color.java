package geniuseun.mypaletteai.function.make.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "color")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Color {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "color_id")
    private Long id;

    @Column(name = "color_hex_code", nullable = false)
    private String hexCode;

    @Column(name = "color_index", nullable = false)
    private int index; // Palette 내 순서

    // Palette와 ManyToOne 관계 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "palette_id", nullable = false)
    private Palette palette;
}
