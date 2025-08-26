package geniuseun.mypaletteai.function.palette.dao;

import geniuseun.mypaletteai.function.make.entity.Palette;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PaletteRepository extends JpaRepository<Palette, Long> {

    // createdAt 으로 팔레트 조회
    Optional<Palette> findByCreatedAt(LocalDateTime createdAt);

    // 날짜 범위로도 조회할 수 있게
    Optional<Palette> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

}
