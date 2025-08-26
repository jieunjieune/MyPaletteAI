package geniuseun.mypaletteai.function.palette.service;

import geniuseun.mypaletteai.function.make.entity.Palette;
import geniuseun.mypaletteai.function.palette.dao.PaletteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaletteService {

    private final PaletteRepository paletteRepository;

    // 전체 조회
    @Transactional(readOnly = true)
    public List<Palette> getAllPalettes() {
        return paletteRepository.findAll();
    }

    // 상세 조회
    @Transactional(readOnly = true)
    public Palette getPalette(Long id) {
        return paletteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("팔레트를 찾을 수 없습니다."));
    }

    // 생성
    @Transactional
    public Palette createPalette(Palette palette) {
        return paletteRepository.save(palette);
    }

    // 수정
    @Transactional
    public Palette updatePalette(Long id, Palette updated) {
        Palette palette = paletteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("팔레트를 찾을 수 없습니다."));

        palette.setTitle(updated.getTitle());
        palette.setMood(updated.getMood());
        palette.setMainColor(updated.getMainColor());

        return paletteRepository.save(palette);
    }

    // 삭제
    @Transactional
    public void deletePalette(Long id) {
        paletteRepository.deleteById(id);
    }
}
