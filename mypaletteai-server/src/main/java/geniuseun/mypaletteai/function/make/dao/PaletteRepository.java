package geniuseun.mypaletteai.function.make.dao;

import geniuseun.mypaletteai.function.make.entity.Palette;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaletteRepository extends JpaRepository<Palette, Long> {

}
