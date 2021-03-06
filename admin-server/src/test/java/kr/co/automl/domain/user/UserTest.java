package kr.co.automl.domain.user;

import kr.co.automl.domain.user.dto.SessionUser;
import kr.co.automl.domain.user.dto.UserResponse;
import kr.co.automl.domain.user.exceptions.AlreadyAdminRoleException;
import kr.co.automl.domain.user.exceptions.CannotChangeAdminRoleException;
import kr.co.automl.global.config.security.dto.OAuthAttributes;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import static kr.co.automl.domain.user.User.ofDefaultRole;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

public class UserTest {
    public static User create(String name, String imageUrl, String email) {
        return ofDefaultRole(name, imageUrl, email);
    }

    public static User createWithEmail(String email) {
        return User.builder()
                .email(email)
                .build();
    }

    public static User create() {
        return create("name", "imageUrl", "email");
    }

    public static User createWithId(long id) {
        return User.builder()
                .id(id)
                .role(Role.USER)
                .build();
    }

    @Nested
    class of_메서드는 {

        @Nested
        class OAuthAttributes가_주어지면 {

            @Test
            void 기본권한이_설정되어_변환된_유저를_리턴한다() {
                OAuthAttributes oAuthAttributes = new OAuthAttributes("name", "imageUrl", "email");

                User user = User.of(oAuthAttributes);

                assertThat(user.getName()).isEqualTo("name");
                assertThat(user.getImageUrl()).isEqualTo("imageUrl");
                assertThat(user.getEmail()).isEqualTo("email");
                assertThat(user.getRole()).isEqualTo(Role.USER);
            }
        }
    }

    @Nested
    class ofDefaultRole_메서드는 {

        @Test
        void 기본권한이_설정되어_변환된_유저를_리턴한다() {
            User user = create("name", "imageUrl", "email");

            assertThat(user.getName()).isEqualTo("name");
            assertThat(user.getImageUrl()).isEqualTo("imageUrl");
            assertThat(user.getEmail()).isEqualTo("email");
            assertThat(user.getRole()).isEqualTo(Role.USER);
        }
    }

    @Nested
    class toSessionUser_메서드는 {

        @Test
        void 변환된_세션유저를_리턴한다() {
            User user = User.ofDefaultRole("name", "imageUrl", "email");

            SessionUser sessionUser = user.toSessionUser();

            assertThat(sessionUser).isEqualTo(
                    new SessionUser("name", "imageUrl", "email", Role.USER)
            );
        }

    }

    @Nested
    class matchEmail_메서드는 {

        @Nested
        class 일치하는_이메일의_유저가_주어진경우 {

            @Test
            void true를_리턴한다() {
                User user = createWithEmail("jypark1@wise.co.kr");
                User matchEmailUser = createWithEmail("jypark1@wise.co.kr");

                boolean actual = user.matchEmail(matchEmailUser);

                assertThat(actual).isTrue();
            }

        }

        @Nested
        class 일치하지않는_이메일의_유저가_주어진경우 {

            @Test
            void false를_리턴한다() {
                User user = createWithEmail("jypark1@wise.co.kr");
                User notMatchEmailUser = createWithEmail("xxx");

                boolean actual = user.matchEmail(notMatchEmailUser);

                assertThat(actual).isFalse();
            }

        }

        @Nested
        class 일치하는_이메일이_주어진경우 {

            @Test
            void true를_리턴한다() {
                User user = createWithEmail("jypark1@wise.co.kr");

                boolean actual = user.matchEmail("jypark1@wise.co.kr");

                assertThat(actual).isTrue();
            }
        }

        @Nested
        class 일치하지않는_이메일이_주어진경우 {

            @Test
            void false를_리턴한다() {
                User user = createWithEmail("jypark1@wise.co.kr");

                boolean actual = user.matchEmail("xxx");

                assertThat(actual).isFalse();
            }
        }
    }

    @Nested
    class update_메서드는 {

        @Nested
        class OAuthAttributes가_주어지면 {

            @Test
            void 변경된_정보를_리턴한다() {
                User user = create("name", "imageUrl", "email");
                OAuthAttributes oAuthAttributes = new OAuthAttributes("OAuthName", "OAuthImageUrl", "OAuthEmail");

                user.update(oAuthAttributes);

                assertThat(user.getName()).isEqualTo("OAuthName");
                assertThat(user.getImageUrl()).isEqualTo("OAuthImageUrl");
                assertThat(user.getEmail()).isEqualTo("OAuthEmail");
                assertThat(user.getRole()).isEqualTo(Role.USER);
            }
        }
    }

    @Nested
    class changeRoleTo_메서드는 {

        @Nested
        class 어드민이_아닌_권한이_주어질경우 {

            @ParameterizedTest
            @EnumSource(
                    value = Role.class,
                    mode = EnumSource.Mode.EXCLUDE,
                    names = {"ADMIN"}
            )
            void 주어진_권한으로_변경한다(Role role) {
                User user = create();
                assertThat(user.getRole()).isEqualTo(Role.USER);

                user.changeRoleTo(role);

                assertThat(user.getRole()).isEqualTo(role);
            }
        }

        @Nested
        class 어드민_권한이_주어질경우 {

            @Test
            void CannotChangeAdminRoleException을_던진다() {
                User user = create();

                assertThatThrownBy(() -> user.changeRoleTo(Role.ADMIN))
                        .isInstanceOf(CannotChangeAdminRoleException.class)
                        .hasMessage("어드민 권한으로는 변경할 수 없습니다.");
            }
        }

        @Nested
        class 이미_어드민_유저일경우 {

            @ParameterizedTest
            @EnumSource(
                    value = Role.class,
                    mode = EnumSource.Mode.EXCLUDE,
                    names = {"ADMIN"}
            )
            void AlreadyAdminRoleException을_던진다(Role role) {
                User adminUser = User.builder()
                        .role(Role.ADMIN)
                        .build();

                assertThatThrownBy(() -> adminUser.changeRoleTo(role))
                        .isInstanceOf(AlreadyAdminRoleException.class)
                        .hasMessage("이미 어드민 권한을 가진 유저입니다.");
            }
        }
    }

    @Nested
    class toResponse {

        @Test
        void 변환된_응답_리턴() {
            User user = create();

            UserResponse userResponse = user.toResponse();

            assertThat(userResponse).isEqualTo(new UserResponse(0L, "name", "email", Role.USER));
        }
    }
}
