package kr.co.automl.domain.user;

import kr.co.automl.domain.user.dto.SessionUser;
import kr.co.automl.domain.user.dto.UserResponse;
import kr.co.automl.domain.user.exceptions.AlreadyAdminRoleException;
import kr.co.automl.domain.user.exceptions.CannotChangeAdminRoleException;
import kr.co.automl.global.config.security.dto.OAuthAttributes;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Objects;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private long id;
    private String name;
    private String imageUrl;
    private String email;

    @Enumerated(value = EnumType.STRING)
    private Role role;

    @Builder
    User(long id, String name, String imageUrl, String email, Role role) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.email = email;
        this.role = role;
    }

    public static User of(OAuthAttributes oAuthAttributes) {
        return ofDefaultRole(
                oAuthAttributes.name(),
                oAuthAttributes.imageUrl(),
                oAuthAttributes.email()
        );
    }

    static User ofDefaultRole(String name, String imageUrl, String email) {
        return User.builder()
                .name(name)
                .imageUrl(imageUrl)
                .email(email)
                .role(Role.DEFAULT)
                .build();
    }

    public SessionUser toSessionUser() {
        return new SessionUser(name, imageUrl, email, role);
    }

    public boolean matchEmail(User user) {
        return user.matchEmail(this.email);
    }

    public boolean matchEmail(String email) {
        return Objects.equals(this.email, email);
    }

    /**
     * ?????? ????????? ???????????????.
     *
     * @return ?????? ??????
     */
    public String getRoleName() {
        return this.role.getName();
    }

    public User update(OAuthAttributes oAuthAttributes) {
        this.name = oAuthAttributes.name();
        this.imageUrl = oAuthAttributes.imageUrl();
        this.email = oAuthAttributes.email();

        return this;
    }

    /**
     * ????????? ???????????????.
     *
     * ????????? ????????? ????????? ??????????????? ?????? ???????????? ????????? ????????? ??? ????????????.
     * @param role ????????? ??????
     *
     * @throws CannotChangeAdminRoleException ????????? ????????? ???????????????
     * @throws AlreadyAdminRoleException ?????? ????????? ????????? ?????? ???????????????
     */
    public void changeRoleTo(Role role) {
        if (role.isAdmin()) {
            throw new CannotChangeAdminRoleException();
        }

        if (this.role.isAdmin()) {
            throw new AlreadyAdminRoleException();
        }

        this.role = role;
    }

    public UserResponse toResponse() {
        return new UserResponse(id, name, email, role);
    }
}
