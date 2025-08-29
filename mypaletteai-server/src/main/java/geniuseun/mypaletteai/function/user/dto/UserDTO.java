package geniuseun.mypaletteai.function.user.dto;

import geniuseun.mypaletteai.function.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long userId;
    private String email;
    private String nickname;

    public static UserDTO fromEntity(User user) {
        return new UserDTO(user.getUserId(), user.getEmail(), user.getNickname());
    }
}
