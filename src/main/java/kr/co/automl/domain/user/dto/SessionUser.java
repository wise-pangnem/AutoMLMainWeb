package kr.co.automl.domain.user.dto;

import kr.co.automl.domain.user.Role;

public record SessionUser(
        String name,
        String imageUrl,
        String email,
        Role role
) {

    public UserInfo toUserInfo() {
        return new UserInfo(name, imageUrl, role);
    }
}