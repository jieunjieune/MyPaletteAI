package geniuseun.mypaletteai.function.save.dao;

import geniuseun.mypaletteai.function.save.entity.SavedPalette;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaveRepository extends JpaRepository<SavedPalette, Long> {
    List<SavedPalette> findByUserId(Long userId);
}
