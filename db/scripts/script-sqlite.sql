-- SQLite

------------- CLEAN DATABASE -------------
DELETE FROM glucose;
DELETE FROM measurement_unity;
DELETE FROM marker_meal;
DELETE FROM users;
DELETE FROM role;


------------- DROPS -------------
DROP TABLE IF EXISTS glucose;
DROP TABLE IF EXISTS measurement_unity;
DROP TABLE IF EXISTS marker_meal;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS role;


------------- ROLES -------------
CREATE TABLE role ( 
    id integer primary key autoincrement,
    description varchar(50) NOT NULL
);

INSERT INTO role (description) VALUES('ADMIN');
INSERT INTO role (description) VALUES('USER');

SELECT * FROM role;



------------- USERS -------------
CREATE TABLE users ( 
    id integer primary key autoincrement,
    name varchar(200) NOT NULL, 
    email varchar(100) NOT NULL, 
    login varchar(100) NOT NULL, 
    password varchar(200) NOT NULL, 
    role_id int NOT NULL, 

    CONSTRAINT fk_role
      FOREIGN KEY(role_id) 
	  REFERENCES role(id) 
);

INSERT INTO users (name, email, login, password, role_id) 
    VALUES('Admin Test', 'admin@admin.com', 'adm_test', '$2a$08$TxWIlv2tAVrtjf2sayFVkuYBneqtQrufo5985f0m396qNsNpeqwSO', 1);

SELECT * FROM users;



---- MEASUREMENTS UNITY FOR GLUCOSE READINGS ----
CREATE TABLE measurement_unity ( 
    id integer primary key autoincrement,
    description varchar(15) NOT NULL
);

-- mg/dL or mmol/L.
INSERT INTO measurement_unity (description) VALUES('mg/dL');
INSERT INTO measurement_unity (description) VALUES('mmol/L');

SELECT * FROM measurement_unity;



------------- MARKER MEAL -------------
CREATE TABLE marker_meal ( 
    id integer primary key autoincrement,
    description varchar(50) NOT NULL
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
    id integer primary key autoincrement,
	user_id integer NOT NULL,
	glucose integer NOT NULL,
	unity_id integer NOT NULL,
	date varchar(10) NOT NULL,
    hour TIME(6) NOT NULL,
	markermeal_id integer NOT NULL,

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

INSERT INTO glucose (user_id, glucose, unity_id, date, hour, markermeal_id) VALUES(1, 60, 1, '2022-08-01', '00:05:00', 1);

SELECT * FROM glucose;