
DROP TABLE IF EXISTS glicemia;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS role;

DROP SEQUENCE IF EXISTS role_id_seq;
DROP SEQUENCE IF EXISTS user_id_seq;
DROP SEQUENCE IF EXISTS glicemia_id_seq;



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
    password varchar(100) NOT NULL, 
    role_id int NOT NULL, 

    CONSTRAINT user_pk PRIMARY KEY (id),
    CONSTRAINT fk_role
      FOREIGN KEY(role_id) 
	  REFERENCES role(id) 
);

INSERT INTO users (name, email, login, password, role_id) VALUES('Admin Test', 'admin@admin.com', 'adm_test', 'admin123', 1);

SELECT * FROM users;



------------- GLICEMIA -------------
CREATE SEQUENCE glicemia_id_seq; 

CREATE TABLE glicemia ( 
    id int NOT NULL DEFAULT nextval('glicemia_id_seq'), 
	user_id int NOT NULL,
	glicemia int NOT NULL,
	unity varchar(10) NOT NULL, -- acceptable values: mg/dL or mmol/L.
	date TIMESTAMP NOT NULL,
	marker_meal varchar(50) NOT NULL,

    CONSTRAINT glicemia_pk PRIMARY KEY (id),
	CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES users(id)
);

INSERT INTO glicemia (user_id, glicemia, unity, date, marker_meal) VALUES(1, 100, 'mg/dL', '2022-08-01 12:30:00', 'after dinner');

SELECT * FROM glicemia;