package kr.co.automl.domain.metadata.domain.dataset;

import org.junit.jupiter.api.Test;

import static kr.co.automl.domain.metadata.domain.dataset.ContactPointTest.CONTACT_POINT1;
import static org.assertj.core.api.Assertions.assertThat;

public class OrganizationTest {
    public static final Organization ORGANIZATION1 = new Organization(
            "위세아이텍",
            Creator.WISE_I_TECH,
            CONTACT_POINT1
    );

    @Test
    void of() {
        Organization org = Organization.of("위세아이텍", "위세아이텍", "박주영");

        assertThat(org).isEqualTo(ORGANIZATION1);
    }
}
