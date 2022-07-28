------------- CLEAN DATABASE -------------
DELETE FROM glucose;
DELETE FROM measurement_unity;
DELETE FROM marker_meal;
DELETE FROM users;
DELETE FROM role;

ALTER SEQUENCE IF EXISTS glucose_id_seq RESTART;
ALTER SEQUENCE IF EXISTS measurement_id_seq RESTART;
ALTER SEQUENCE IF EXISTS markermeal_id_seq RESTART;
ALTER SEQUENCE IF EXISTS user_id_seq RESTART;
ALTER SEQUENCE IF EXISTS role_id_seq RESTART;



------------- DROPS -------------
DROP TABLE IF EXISTS glucose;
DROP TABLE IF EXISTS measurement_unity;
DROP TABLE IF EXISTS marker_meal;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS role;

DROP SEQUENCE IF EXISTS glucose_id_seq;
DROP SEQUENCE IF EXISTS measurement_id_seq;
DROP SEQUENCE IF EXISTS markermeal_id_seq;
DROP SEQUENCE IF EXISTS user_id_seq;
DROP SEQUENCE IF EXISTS role_id_seq;



------------- ROLES -------------
CREATE SEQUENCE role_id_seq; 

CREATE TABLE role ( 
    id int NOT NULL DEFAULT nextval('role_id_seq'), 
    description varchar(100) NOT NULL,
    CONSTRAINT role_pk PRIMARY KEY (id) 
);

INSERT INTO role (description) VALUES('ADMIN');
INSERT INTO role (description) VALUES('USER');

SELECT * FROM role;



------------- USERS -------------
CREATE SEQUENCE user_id_seq; 

CREATE TABLE users ( 
    id int NOT NULL DEFAULT nextval('user_id_seq'), 
    name varchar(200) NOT NULL, 
    email varchar(100) NOT NULL, 
    login varchar(100) NOT NULL, 
    password varchar(200) NOT NULL, 
    role_id int NOT NULL, 

    CONSTRAINT user_pk PRIMARY KEY (id),
    CONSTRAINT fk_role
      FOREIGN KEY(role_id) 
	  REFERENCES role(id) 
);

INSERT INTO users (name, email, login, password, role_id) VALUES('Admin Test', 'admin@admin.com', 'adm_test', 'admin123', 1);

SELECT * FROM users;



---- MEASUREMENTS UNITY FOR GLICEMIC READINGS ----
CREATE SEQUENCE measurement_id_seq; 

CREATE TABLE measurement_unity ( 
    id int NOT NULL DEFAULT nextval('measurement_id_seq'), 
    description varchar(15) NOT NULL,
    CONSTRAINT measurement_pk PRIMARY KEY (id) 
);

-- mg/dL or mmol/L.
INSERT INTO measurement_unity (description) VALUES('mg/dL');
INSERT INTO measurement_unity (description) VALUES('mmol/L');

SELECT * FROM measurement_unity;



------------- MARKER MEAL -------------
CREATE SEQUENCE markermeal_id_seq; 

CREATE TABLE marker_meal ( 
    id int NOT NULL DEFAULT nextval('markermeal_id_seq'), 
    description varchar(50) NOT NULL,
    CONSTRAINT markermeal_pk PRIMARY KEY (id) 
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



------------- GLICEMIA -------------
CREATE SEQUENCE glucose_id_seq; 

CREATE TABLE glucose ( 
    id int NOT NULL DEFAULT nextval('glucose_id_seq'), 
	user_id int NOT NULL,
	glucose int NOT NULL,
	unity_id int NOT NULL,
	date DATE NOT NULL,
    hour TIME(6) NOT NULL,
	markermeal_id int NOT NULL,

    CONSTRAINT glucose_pk PRIMARY KEY (id),
	CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES users(id),
    
    CONSTRAINT fk_unity
      FOREIGN KEY(unity_id) 
	  REFERENCES measurement_unity(id),

    CONSTRAINT fk_markermeal
      FOREIGN KEY(markermeal_id) 
	  REFERENCES marker_meal(id)
);

INSERT INTO glucose (user_id, glucose, unity_id, date, hour, markermeal_id) VALUES(1, 100, 1, '2022-08-01', '12:30:00', 1);

SELECT * FROM glucose;