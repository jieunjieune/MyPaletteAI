package geniuseun.mypaletteai.function.auth.dao;

import geniuseun.mypaletteai.function.auth.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByTokenAndUsedFalse(String token);
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUserId(Long userId);
}