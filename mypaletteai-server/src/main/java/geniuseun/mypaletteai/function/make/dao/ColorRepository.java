package geniuseun.mypaletteai.function.make.dao;

import geniuseun.mypaletteai.function.make.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColorRepository extends JpaRepository<Color, Long> {
}
