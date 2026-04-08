package geniuseun.mypaletteai.global.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

import org.springframework.jdbc.core.JdbcTemplate;

@RestController
@RequiredArgsConstructor
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        try {
            jdbcTemplate.queryForObject(
                "SELECT 1 FROM color_palette LIMIT 1",
                Integer.class
            );

            return ResponseEntity.ok("ok");

        } catch (Exception e) {
            return ResponseEntity.status(503).body("db error");
        }
    }
}