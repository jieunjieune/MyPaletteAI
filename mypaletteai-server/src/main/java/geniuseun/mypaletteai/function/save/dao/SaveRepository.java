package geniuseun.mypaletteai.function.save.dao;

import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.save.entity.SavedPalette;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaveRepository extends JpaRepository<SavedPalette, Long> {
    List<SavedPalette> findByUserId(Long userId);
    Optional<SavedPalette> findByIdAndUserId(Long saveId, Long userId);

    // userId와 palette로 이미 저장된 레코드 존재 여부 체크
    boolean existsByUserIdAndPalette(Long userId, Palette palette);

    // 중복 엔티티 조회 (저장된 경우 saveId 확인용)
    Optional<SavedPalette> findByUserIdAndPalette(Long userId, Palette palette);
}
