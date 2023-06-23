-- PostgreSQL

---------- DROP SEQUENCE -------------
DROP SEQUENCE IF EXISTS role_id_seq;
DROP SEQUENCE IF EXISTS gender_id_seq;
DROP SEQUENCE IF EXISTS user_id_seq;
DROP SEQUENCE IF EXISTS diabetes_type_id_seq;
DROP SEQUENCE IF EXISTS blood_type_id_seq;
DROP SEQUENCE IF EXISTS measurement_unity_id_seq;
DROP SEQUENCE IF EXISTS marker_meal_id_seq;
DROP SEQUENCE IF EXISTS blood_glucose_diary_id_seq;
DROP SEQUENCE IF EXISTS health_info_id_seq;
DROP SEQUENCE IF EXISTS user_system_config_id_seq;
DROP SEQUENCE IF EXISTS password_reset_tokens_id_seq;


---------- ROLES 
CREATE SEQUENCE role_id_seq; 
CREATE TABLE role ( 
    id          int NOT NULL DEFAULT nextval('role_id_seq'), 
    description varchar(100) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),

    CONSTRAINT role_pk PRIMARY KEY (id)
);

INSERT INTO role (description) VALUES('ADMIN');
INSERT INTO role (description) VALUES('USER');



---------- GENDER
CREATE SEQUENCE gender_id_seq;
CREATE TABLE gender (
    id          int NOT NULL DEFAULT nextval('gender_id_seq'),
    description VARCHAR(20),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),

    CONSTRAINT gender_pk PRIMARY KEY (id)
);

INSERT INTO gender (description) VALUES('Male');
INSERT INTO gender (description) VALUES('Female');
INSERT INTO gender (description) VALUES('Unspecified');



---------- USERS 
CREATE SEQUENCE user_id_seq; 
CREATE TABLE users (
    id          varchar(50) NOT NULL DEFAULT nextval('user_id_seq'),
    name        varchar(200) NOT NULL,
    email       varchar(100) NOT NULL UNIQUE,
    password    varchar(200) NOT NULL,
    birthdate   varchar(8),
    phone       varchar(20),
    gender_id   INTEGER REFERENCES gender,
    weight      FLOAT,
    height      FLOAT,
    role_id     INTEGER NOT NULL REFERENCES role,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    picture     TEXT,

    CONSTRAINT users_pk PRIMARY KEY (id),

	CONSTRAINT fk_gender
      FOREIGN KEY(gender_id) 
	  REFERENCES gender(id),

    CONSTRAINT fk_role
      FOREIGN KEY(role_id) 
	  REFERENCES role(id)
);



---------- DEFAULT USER
INSERT INTO users (id, name, email, password, role_id) 
  VALUES ('1111111-1111-1111-1111-111111111111', 
          'Glicocheck Admin Test', 
          'admin-test@glicocheck.com',
          '$2a$12$xap4IdbMIp/WwdlvHXFAo.j8KLCerskmRo7incA71GGL3ThHp7Sjy',
          1);

INSERT INTO users (id, name, email, password, role_id) 
  VALUES ('1111111-0000-0000-0000-111111111111', 
          'Glicocheck Admin', 
          'admin@glicocheck.com',
          '$2a$12$xap4IdbMIp/WwdlvHXFAo.j8KLCerskmRo7incA71GGL3ThHp7Sjy',
          1);



---------- DIABETES TYPE
CREATE SEQUENCE diabetes_type_id_seq;
CREATE TABLE diabetes_type (
    id          int NOT NULL DEFAULT nextval('diabetes_type_id_seq'),
    description VARCHAR(100),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),

    CONSTRAINT diabetes_type_pk PRIMARY KEY (id)
);

INSERT INTO diabetes_type (description) VALUES('Diabetes Mellitus Type 1');
INSERT INTO diabetes_type (description) VALUES('Diabetes Mellitus Type 2');
INSERT INTO diabetes_type (description) VALUES('Diabetes Gestational');



---------- BLOOD TYPE
CREATE SEQUENCE blood_type_id_seq;
CREATE TABLE blood_type (
    id          int NOT NULL DEFAULT nextval('blood_type_id_seq'),
    description VARCHAR(3),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),

    CONSTRAINT blood_type_pk PRIMARY KEY (id)
);

INSERT INTO blood_type (description) VALUES('A+');
INSERT INTO blood_type (description) VALUES('A-');
INSERT INTO blood_type (description) VALUES('B+');
INSERT INTO blood_type (description) VALUES('B-');
INSERT INTO blood_type (description) VALUES('AB+');
INSERT INTO blood_type (description) VALUES('AB-');
INSERT INTO blood_type (description) VALUES('O+');
INSERT INTO blood_type (description) VALUES('O-');



---------- MEASUREMENTS UNITY
CREATE SEQUENCE measurement_unity_id_seq;
CREATE TABLE measurement_unity ( 
    id          int NOT NULL DEFAULT nextval('measurement_unity_id_seq'),
    description varchar(15) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),

    CONSTRAINT measurement_unity_pk PRIMARY KEY (id)
);

INSERT INTO measurement_unity (description) VALUES('mg/dL');
INSERT INTO measurement_unity (description) VALUES('mmol/L');



---------- MARKER MEAL
CREATE SEQUENCE marker_meal_id_seq;
CREATE TABLE marker_meal ( 
    id          int NOT NULL DEFAULT nextval('marker_meal_id_seq'),
    description varchar(30) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),

    CONSTRAINT marker_meal_pk PRIMARY KEY (id)
);

INSERT INTO marker_meal (description) VALUES('Fasting');
INSERT INTO marker_meal (description) VALUES('Before breakfast');
INSERT INTO marker_meal (description) VALUES('After breakfast');
INSERT INTO marker_meal (description) VALUES('Before lunch');
INSERT INTO marker_meal (description) VALUES('After lunch');
INSERT INTO marker_meal (description) VALUES('Before dinner');
INSERT INTO marker_meal (description) VALUES('After dinner');
INSERT INTO marker_meal (description) VALUES('Before sleeping');



---------- BLOOD GLUCOSE DIARY
CREATE SEQUENCE blood_glucose_diary_id_seq;
CREATE TABLE blood_glucose_diary ( 
    id             int NOT NULL DEFAULT nextval('blood_glucose_diary_id_seq'),
    user_id        varchar(50) NOT NULL,
    glucose        INTEGER NOT NULL,
    total_carbs    INTEGER, -- optional
    dateTime       varchar(20) NOT NULL,
    markermeal_id  INTEGER NOT NULL,
    created_at     TIMESTAMP DEFAULT NOW(),
    updated_at     TIMESTAMP DEFAULT NOW(),

    CONSTRAINT blood_glucose_diary_pk PRIMARY KEY (id),

    CONSTRAINT fk_user
      FOREIGN KEY(user_id)
      REFERENCES users(id),

    CONSTRAINT fk_markermeal
      FOREIGN KEY(markermeal_id)
      REFERENCES marker_meal(id)
);



---------- HEALTH INFO ----
CREATE SEQUENCE health_info_id_seq;
CREATE TABLE health_info (
    id              int NOT NULL DEFAULT nextval('health_info_id_seq'),
    user_id         varchar(50) NOT NULL UNIQUE,
    diabetes_type   INTEGER REFERENCES diabetes_type,
    blood_type      INTEGER REFERENCES blood_type,  
    month_diagnosis varchar(15),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),

    CONSTRAINT health_info_pk PRIMARY KEY (id),

    CONSTRAINT fk_user
      FOREIGN KEY(user_id)
      REFERENCES users(id),

    CONSTRAINT fk_diabetes_type
      FOREIGN KEY(diabetes_type)
      REFERENCES diabetes_type(id),

    CONSTRAINT fk_blood_type
      FOREIGN KEY(blood_type)
      REFERENCES blood_type(id)
);

INSERT INTO health_info (user_id, diabetes_type, blood_type, month_diagnosis) 
VALUES ('1111111-0000-0000-0000-111111111111', 1, 1, '2021-05');



---------- USER'S SYSTEM CONFIGURATION
CREATE SEQUENCE user_system_config_id_seq;
CREATE TABLE user_system_config (
    id               int NOT NULL DEFAULT nextval('user_system_config_id_seq'),
    user_id          varchar(50) NOT NULL,
    glucose_unity_id INTEGER NOT NULL,
    limit_hypo       INTEGER,
    limit_hyper      INTEGER,
    time_bf_pre      varchar(5),
    time_bf_pos      varchar(5),
    time_lunch_pre   varchar(5),
    time_lunch_pos   varchar(5),
    time_dinner_pre  varchar(5),
    time_dinner_pos  varchar(5),
    time_sleep       varchar(5),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),

    CONSTRAINT user_system_config_pk PRIMARY KEY (id),

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id),

    CONSTRAINT fk_measurement_unity
        FOREIGN KEY (glucose_unity_id)
        REFERENCES measurement_unity(id)
);

---------- SYSTEM CONFIGURATION FOR THE DEFAULT USER.
INSERT INTO user_system_config (
  user_id, glucose_unity_id, 
  limit_hypo, limit_hyper, 
  time_bf_pre, time_bf_pos, 
  time_lunch_pre, time_lunch_pos, 
  time_dinner_pre, time_dinner_pos, time_sleep) 
VALUES ('1111111-1111-1111-1111-111111111111', 1, 70, 160, 
  '06:00', '08:00', '12:00', '14:00', '19:00', '21:00', '23:00');

INSERT INTO user_system_config (
  user_id, glucose_unity_id, 
  limit_hypo, limit_hyper, 
  time_bf_pre, time_bf_pos, 
  time_lunch_pre, time_lunch_pos, 
  time_dinner_pre, time_dinner_pos, time_sleep) 
VALUES ('1111111-0000-0000-0000-111111111111', 1, 70, 160, 
  '06:00', '08:00', '12:00', '14:00', '19:00', '21:00', '23:00');



---------- PASSWORD RESET TOKENS
CREATE SEQUENCE password_reset_tokens_id_seq;
CREATE TABLE password_reset_tokens (
    id          int NOT NULL DEFAULT nextval('password_reset_tokens_id_seq'),
    token       varchar(50) NOT NULL UNIQUE,
    email_owner varchar(50) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),

    CONSTRAINT password_reset_tokens_pk PRIMARY KEY (id)
);


---------- CLEAN DATABASE
DELETE FROM role;
DELETE FROM gender;
DELETE FROM users;
DELETE FROM diabetes_type;
DELETE FROM blood_type;
DELETE FROM measurement_unity;
DELETE FROM marker_meal;
DELETE FROM blood_glucose_diary;
DELETE FROM health_info;
DELETE FROM user_system_config;
DELETE FROM password_reset_tokens;

---------- DROP TABLE
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS gender;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS diabetes_type;
DROP TABLE IF EXISTS blood_type;
DROP TABLE IF EXISTS measurement_unity;
DROP TABLE IF EXISTS marker_meal;
DROP TABLE IF EXISTS blood_glucose_diary;
DROP TABLE IF EXISTS health_info;
DROP TABLE IF EXISTS user_system_config;
DROP TABLE IF EXISTS password_reset_tokens;

---------- RESTART SEQUENCE
ALTER SEQUENCE IF EXISTS role_id_seq RESTART;
ALTER SEQUENCE IF EXISTS gender_id_seq RESTART;
ALTER SEQUENCE IF EXISTS user_id_seq RESTART;
ALTER SEQUENCE IF EXISTS diabetes_type_id_seq RESTART;
ALTER SEQUENCE IF EXISTS blood_type_id_seq RESTART;
ALTER SEQUENCE IF EXISTS measurement_unity_id_seq RESTART;
ALTER SEQUENCE IF EXISTS marker_meal_id_seq RESTART;
ALTER SEQUENCE IF EXISTS blood_glucose_diary_id_seq RESTART;
ALTER SEQUENCE IF EXISTS health_info_id_seq RESTART;
ALTER SEQUENCE IF EXISTS user_system_config_id_seq RESTART;
ALTER SEQUENCE IF EXISTS password_reset_tokens_id_seq RESTART;