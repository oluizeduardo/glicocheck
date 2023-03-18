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
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       varchar(200) NOT NULL, 
    email      varchar(100) NOT NULL,
    password   varchar(200) NOT NULL, 
    picture    TEXT,
    role_id    INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT (datetime('now','localtime')),
    updated_at TIMESTAMP DEFAULT (datetime('now','localtime')),

    FOREIGN KEY(role_id) REFERENCES role(id) 
);

SELECT * FROM users;



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
	user_id       INTEGER NOT NULL,
	glucose       INTEGER NOT NULL,
	unity_id      INTEGER NOT NULL,
	date          varchar(10) NOT NULL,
    hour          TIME(6) NOT NULL,
	markermeal_id INTEGER NOT NULL,
    created_at    TIMESTAMP DEFAULT (datetime('now','localtime')),
    updated_at    TIMESTAMP DEFAULT (datetime('now','localtime')),

    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(unity_id) REFERENCES measurement_unity(id),
    FOREIGN KEY(markermeal_id) REFERENCES marker_meal(id)
);

SELECT * FROM glucose;