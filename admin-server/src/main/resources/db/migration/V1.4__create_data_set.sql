CREATE TABLE data_set
(
    DATASET_ID      BIGINT NOT NULL AUTO_INCREMENT,
    ISSUED          DATE,
    MODIFIED        DATE,
    DESCRIPTION     LONGTEXT,
    KEYWORD         VARCHAR(255),
    LICENSE         VARCHAR(255),
    RIGHTS          VARCHAR(255),
    EMAIL           VARCHAR(255),
    NAME            VARCHAR(255),
    CREATOR         VARCHAR(255),
    PUBLISHER       VARCHAR(255),
    TITLE           VARCHAR(255),
    TYPE            VARCHAR(255),
    CATALOG_ID      BIGINT,
    DISTRIBUTION_ID BIGINT,
    PRIMARY KEY (DATASET_ID)
);
