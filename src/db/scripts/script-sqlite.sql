-- SQLite

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


---------- ROLES
CREATE TABLE role ( 
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    cod_role    varchar(50) NOT NULL,   
    description varchar(50) NOT NULL,
    created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
    updated_at  TIMESTAMP DEFAULT (datetime('now','localtime'))
);

INSERT INTO role (cod_role, description) VALUES('98805e1e-4dbe-483d-8a78-5f1e7e4f72b3', 'USER_ADMIN');
INSERT INTO role (cod_role, description) VALUES('42701b81-1120-4f7f-a0ae-1326e813cfcb', 'USER_REGULAR');

SELECT * FROM role;


---------- GENDER
CREATE TABLE gender (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  description VARCHAR(30),
  created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
  updated_at  TIMESTAMP DEFAULT (datetime('now','localtime'))
);

INSERT INTO gender (description) VALUES('Male');
INSERT INTO gender (description) VALUES('Female');
INSERT INTO gender (description) VALUES('Unspecified');


---------- USERS
CREATE TABLE users ( 
    id         varchar(50)  NOT NULL PRIMARY KEY,
    name       varchar(200) NOT NULL, 
    email      varchar(100) NOT NULL UNIQUE,
    password   varchar(200) NOT NULL,     
    birthdate  varchar(10),
    phone      varchar(30),
    gender_id  INTEGER,
    weight     FLOAT,
    height     FLOAT,
    cod_role    varchar(50) NOT NULL,
    created_at TIMESTAMP DEFAULT (datetime('now','localtime')),
    updated_at TIMESTAMP DEFAULT (datetime('now','localtime')),
    picture    TEXT,

    FOREIGN KEY(cod_role) REFERENCES role(cod_role),
    FOREIGN KEY(gender_id) REFERENCES gender(id)
);

-- DEFAULT USER.
INSERT INTO users (id, name, email, password, cod_role) 
  VALUES ('1111111-1111-1111-1111-111111111111',
          'Glicocheck Admin Test', 
          'admin-test@glicocheck.com',
          '$2a$12$xap4IdbMIp/WwdlvHXFAo.j8KLCerskmRo7incA71GGL3ThHp7Sjy',
          '98805e1e-4dbe-483d-8a78-5f1e7e4f72b3');

INSERT INTO users (id, name, email, password, cod_role) 
  VALUES ('2222222-2222-2222-2222-222222222222',
          'Glicocheck Regular User Test', 
          'regular-test@glicocheck.com',
          '$2a$12$xap4IdbMIp/WwdlvHXFAo.j8KLCerskmRo7incA71GGL3ThHp7Sjy',
          '42701b81-1120-4f7f-a0ae-1326e813cfcb');

INSERT INTO users (id, name, email, password, cod_role) 
  VALUES ('1111111-0000-0000-0000-111111111111', 
          'Glicocheck Admin', 
          'admin@glicocheck.com',
          '$2a$12$xap4IdbMIp/WwdlvHXFAo.j8KLCerskmRo7incA71GGL3ThHp7Sjy',
          '98805e1e-4dbe-483d-8a78-5f1e7e4f72b3');

SELECT * FROM users;


---------- DIABETES TYPE
CREATE TABLE diabetes_type (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  description VARCHAR(100),
  created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
  updated_at  TIMESTAMP DEFAULT (datetime('now','localtime'))
);

INSERT INTO diabetes_type (description) VALUES('Diabetes Mellitus Type 1');
INSERT INTO diabetes_type (description) VALUES('Diabetes Mellitus Type 2');
INSERT INTO diabetes_type (description) VALUES('Diabetes Gestational');


---------- BLOOD TYPE
CREATE TABLE blood_type (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  description VARCHAR(5),
  created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
  updated_at  TIMESTAMP DEFAULT (datetime('now','localtime'))
);

INSERT INTO blood_type (description) VALUES('A+');
INSERT INTO blood_type (description) VALUES('A-');
INSERT INTO blood_type (description) VALUES('B+');
INSERT INTO blood_type (description) VALUES('B-');
INSERT INTO blood_type (description) VALUES('AB+');
INSERT INTO blood_type (description) VALUES('AB-');
INSERT INTO blood_type (description) VALUES('O+');
INSERT INTO blood_type (description) VALUES('O-');


---- MEASUREMENTS UNITY ----
CREATE TABLE measurement_unity ( 
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    description varchar(15) NOT NULL,
    created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
    updated_at  TIMESTAMP DEFAULT (datetime('now','localtime'))
);

INSERT INTO measurement_unity (description) VALUES('mg/dL');
INSERT INTO measurement_unity (description) VALUES('mmol/L');

SELECT * FROM measurement_unity;



------------- MARKER MEAL -------------
CREATE TABLE marker_meal ( 
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    description varchar(30) NOT NULL,
    created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
    updated_at  TIMESTAMP DEFAULT (datetime('now','localtime'))
);

INSERT INTO marker_meal (description) VALUES('Fasting');
INSERT INTO marker_meal (description) VALUES('Before breakfast');
INSERT INTO marker_meal (description) VALUES('After breakfast');
INSERT INTO marker_meal (description) VALUES('Before lunch');
INSERT INTO marker_meal (description) VALUES('After lunch');
INSERT INTO marker_meal (description) VALUES('Before dinner');
INSERT INTO marker_meal (description) VALUES('After dinner');
INSERT INTO marker_meal (description) VALUES('Before sleeping');

SELECT * FROM marker_meal;



----------- BLOOD GLUCOSE DIARY -----------
CREATE TABLE blood_glucose_diary ( 
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id          varchar(50) NOT NULL,
	glucose          INTEGER NOT NULL,
  total_carbs      INTEGER,
	dateTime         varchar(20) NOT NULL,
	markermeal_id    INTEGER NOT NULL,
  created_at       TIMESTAMP DEFAULT (datetime('now','localtime')),
  updated_at       TIMESTAMP DEFAULT (datetime('now','localtime')),

  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(markermeal_id) REFERENCES marker_meal(id)
);

SELECT * FROM blood_glucose_diary;


---- HEALTH INFO ----
CREATE TABLE health_info (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         varchar(50) NOT NULL UNIQUE,
  diabetes_type   INTEGER,
  blood_type      INTEGER,  
  month_diagnosis varchar(10),
  created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
  updated_at  TIMESTAMP DEFAULT (datetime('now','localtime')),

  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (diabetes_type) REFERENCES diabetes_type(id),
  FOREIGN KEY (blood_type) REFERENCES blood_type(id)
);

INSERT INTO health_info (user_id, diabetes_type, blood_type, month_diagnosis) 
VALUES ('1111111-0000-0000-0000-111111111111', 1, 1, '2021-05');


---------- USER'S SYSTEM CONFIGURATION
CREATE TABLE user_system_config (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
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
  created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
  updated_at  TIMESTAMP DEFAULT (datetime('now','localtime')),

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (glucose_unity_id) REFERENCES measurement_unity(id)
);

-- SYSTEM CONFIGURATION FOR THE DEFAULT USER.
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
VALUES ('2222222-2222-2222-2222-222222222222', 1, 70, 160, 
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
CREATE TABLE password_reset_tokens (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  token       varchar(50) NOT NULL UNIQUE,
	email_owner varchar(50) NOT NULL,
  created_at  TIMESTAMP DEFAULT (datetime('now','localtime'))
);