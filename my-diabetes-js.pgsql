
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS glicemia;


------------- USERS -------------
CREATE SEQUENCE user_id_seq; 

CREATE TABLE users ( 
    id int NOT NULL DEFAULT nextval('user_id_seq'), 
    name varchar(200) NOT NULL, 
    email varchar(100) NOT NULL, 
    login varchar(100) NOT NULL, 
    password varchar(100) NOT NULL, 
    roles varchar (200)  NOT NULL DEFAULT 'USER', 
    CONSTRAINT user_pk PRIMARY KEY (id) 
);

INSERT INTO users (name, login, password, email, roles) VALUES('ADMIN', 'admin', 'admin123', 'admin@admin.com.br', 'USER');

SELECT * FROM users



------------- GLICEMIA -------------
CREATE SEQUENCE glicemia_id_seq; 
CREATE TABLE glicemia ( 
    id int NOT NULL DEFAULT nextval('glicemia_id_seq'), 
	user_id int NOT NULL,
	glicemia int NOT NULL,
	unity varchar(50) NOT NULL, 
	date varchar(50) NOT NULL,
	hour varchar(50) NOT NULL,
	marker_meal varchar(50) NOT NULL,

    CONSTRAINT glicemia_pk PRIMARY KEY (id),
	CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES users(id)
);

SELECT * FROM glicemia;

INSERT INTO glicemia (user_id, glicemia, unity, date, hour, marker_meal) VALUES(7, 123, 'md/L', '20/07/22', '23:00', 'after dinner');