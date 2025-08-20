package geniuseun.mypaletteai.function.make.dao;

import geniuseun.mypaletteai.function.make.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ColorRepository extends JpaRepository<Color, Long> {
    List<Color> findByPaletteId(Long paletteId);
}
