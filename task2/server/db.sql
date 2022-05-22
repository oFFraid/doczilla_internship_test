CREATE DATABASE students
    WITH
    OWNER = z8
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

CREATE TABLE studyGroup (
	id serial PRIMARY KEY,
	name VARCHAR(255) NOT NULL
);

CREATE TABLE student (
	id serial PRIMARY KEY,
	firstName varchar(100) NOT NULL,
	lastName varchar(100) NOT NULL,
	patronymic varchar(100),
	groupId integer NOT NULL,
	birthday DATE NOT NULL,
	FOREIGN KEY (groupId) references studyGroup (id)
);

INSERT INTO studyGroup (name) VALUES ('dsdasda')
INSERT INTO studyGroup (name) VALUES ('iamofmawiofma')
INSERT INTO studyGroup (name) VALUES ('iamofmaw')
INSERT INTO studyGroup (name) VALUES ('wiofma')
INSERT INTO studyGroup (name) VALUES ('wafaf')
INSERT INTO studyGroup (name) VALUES ('iamofmaa')
