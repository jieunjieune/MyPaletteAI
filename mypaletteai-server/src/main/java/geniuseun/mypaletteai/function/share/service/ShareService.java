package geniuseun.mypaletteai.function.share.service;

import geniuseun.mypaletteai.function.palette.dao.PaletteRepository;
import geniuseun.mypaletteai.function.make.entity.Color;
import geniuseun.mypaletteai.function.make.entity.Palette;
import io.jsonwebtoken.RequiredTypeException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShareService {

    private final PaletteRepository paletteRepository;

    // 1. 팔레트 조회
    public Palette getPalette(Long paletteId) {
        return paletteRepository.findById(paletteId)
                .orElseThrow(() -> new RequiredTypeException("Palette not found"));
    }

    // 2. 공유용 이미지 생성
    public String generatePaletteImage(Palette palette) {
        int width = 500;
        int height = 100;
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();

        List<Color> colors = palette.getColors();
        int rectWidth = width / colors.size();

        for (int i = 0; i < colors.size(); i++) {
            g.setColor(java.awt.Color.decode(colors.get(i).getHexCode()));
            g.fillRect(i * rectWidth, 0, rectWidth, height);
        }
        g.dispose();

        String fileName = "palette_" + palette.getId() + ".png";
        try {
            File dir = new File("/tmp/palette_images");
            if (!dir.exists()) dir.mkdirs();

            ImageIO.write(image, "png", new File(dir, fileName));
        } catch (IOException e) {
            throw new RuntimeException("이미지 생성 실패");
        }

        // 프론트에서 접근 가능한 URL 반환
        return "/images/" + fileName;
    }

}
