package geniuseun.mypaletteai.jwt;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenDTO {

    private String tokenType;            // ex: "Bearer"
    private Long userId;                 // 사용자 고유 ID
    private String accessToken;          // 접근 토큰
    private String refreshToken;         // 리프레시 토큰
    private Long accessTokenExpiresIn;   // access token 만료 시간 (ms)
    private Long refreshTokenExpiresIn;  // refresh token 만료 시간 (ms)
    private String nickname;

}
