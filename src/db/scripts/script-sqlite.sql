-- SQLite

------------- CLEAN DATABASE -------------
DELETE FROM glucose;
DELETE FROM measurement_unity;
DELETE FROM marker_meal;
DELETE FROM users;
DELETE FROM role;
DELETE FROM gender;
DELETE FROM health_info;
DELETE FROM diabetes_type;
DELETE FROM blood_type;
DELETE FROM reset_token;


------------- DROPS -------------
DROP TABLE IF EXISTS glucose;
DROP TABLE IF EXISTS measurement_unity;
DROP TABLE IF EXISTS marker_meal;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS gender;
DROP TABLE IF EXISTS health_info;
DROP TABLE IF EXISTS diabetes_type;
DROP TABLE IF EXISTS blood_type;
DROP TABLE IF EXISTS reset_token;


------------- ROLES -------------
CREATE TABLE role ( 
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    description varchar(50) NOT NULL,
    created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
    updated_at  TIMESTAMP DEFAULT (datetime('now','localtime'))
);

INSERT INTO role (description) VALUES('ADMIN');
INSERT INTO role (description) VALUES('USER');

SELECT * FROM role;



------------- USERS -------------
CREATE TABLE users ( 
    id         varchar(50)  NOT NULL PRIMARY KEY,
    name       varchar(200) NOT NULL, 
    email      varchar(100) NOT NULL,
    password   varchar(200) NOT NULL,     
    birthdate  varchar(8),
    phone      varchar(20),
    gender_id  INTEGER,
    health_id  INTEGER,
    weight     FLOAT,
    height     FLOAT,
    role_id    INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT (datetime('now','localtime')),
    updated_at TIMESTAMP DEFAULT (datetime('now','localtime')),
    picture    TEXT,

    FOREIGN KEY(role_id) REFERENCES role(id),
    FOREIGN KEY(health_id) REFERENCES health_info(id),
    FOREIGN KEY(gender_id) REFERENCES gender(id)
);

SELECT * FROM users;


---- HEALTH INFO ----
CREATE TABLE health_info (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         varchar(50) NOT NULL,
  diabetes_type   INTEGER,
  blood_type      INTEGER,  
  month_diagnosis varchar(15),
  created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
  updated_at  TIMESTAMP DEFAULT (datetime('now','localtime')),

  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (diabetes_type) REFERENCES diabetes_type(id)
);


---- DIABETES TYPE ----
CREATE TABLE diabetes_type (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  description VARCHAR(20),
  created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
  updated_at  TIMESTAMP DEFAULT (datetime('now','localtime'))
);

INSERT INTO diabetes_type (description) VALUES('Diabetes Mellitus Type 1');
INSERT INTO diabetes_type (description) VALUES('Diabetes Mellitus Type 2');
INSERT INTO diabetes_type (description) VALUES('Diabetes Gestational');



---- BLOOD TYPE ----
CREATE TABLE blood_type (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  description VARCHAR(3),
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



---- GENDER ----
CREATE TABLE gender (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  description VARCHAR(20),
  created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
  updated_at  TIMESTAMP DEFAULT (datetime('now','localtime'))
);

INSERT INTO gender (description) VALUES('Male');
INSERT INTO gender (description) VALUES('Female');
INSERT INTO gender (description) VALUES('Unspecified');



---- MEASUREMENTS UNITY FOR GLUCOSE READINGS ----
CREATE TABLE measurement_unity ( 
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    description varchar(15) NOT NULL,
    created_at  TIMESTAMP DEFAULT (datetime('now','localtime')),
    updated_at  TIMESTAMP DEFAULT (datetime('now','localtime'))
);

-- mg/dL or mmol/L.
INSERT INTO measurement_unity (description) VALUES('mg/dL');
INSERT INTO measurement_unity (description) VALUES('mmol/L');

SELECT * FROM measurement_unity;



------------- MARKER MEAL -------------
CREATE TABLE marker_meal ( 
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    description varchar(50) NOT NULL,
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



------------- GLUCOSE -------------
CREATE TABLE glucose ( 
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id       varchar(50) NOT NULL,
	glucose       INTEGER NOT NULL,
	unity_id      INTEGER NOT NULL,
	dateTime      varchar(20) NOT NULL,
	markermeal_id INTEGER NOT NULL,
  created_at    TIMESTAMP DEFAULT (datetime('now','localtime')),
  updated_at    TIMESTAMP DEFAULT (datetime('now','localtime')),

  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(unity_id) REFERENCES measurement_unity(id),
  FOREIGN KEY(markermeal_id) REFERENCES marker_meal(id)
);

SELECT * FROM glucose;



------------- RESET TOKEN -------------
CREATE TABLE reset_token (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  token       varchar(50) NOT NULL,
	email_owner varchar(50) NOT NULL,
  created_at  TIMESTAMP DEFAULT (datetime('now','localtime'))
);