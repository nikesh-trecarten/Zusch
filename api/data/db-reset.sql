-- CREATE EXTENSION postgis;
-- ^this only needs to be run once

DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS boxes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
user_id VARCHAR(255) PRIMARY KEY,
street VARCHAR(255) NOT NULL,
house_number VARCHAR(255) NOT NULL,
postal_code VARCHAR(255) NOT NULL,
city VARCHAR(255) NOT NULL,
country VARCHAR(255) NOT NULL
);

CREATE TABLE boxes (
box_id SERIAL PRIMARY KEY,
user_id VARCHAR(255) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
location GEOGRAPHY(Point, 4326) NOT NULL,
latitude DOUBLE PRECISION GENERATED ALWAYS AS (ST_Y(location::geometry)) STORED,
longitude DOUBLE PRECISION GENERATED ALWAYS AS (ST_X(location::geometry)) STORED
);

CREATE TABLE items (
item_id SERIAL PRIMARY KEY,
box_id INT NOT NULL REFERENCES boxes(box_id) ON DELETE CASCADE,
item_name VARCHAR(255) NOT NULL,
is_checked BOOLEAN DEFAULT FALSE
);

INSERT INTO users (user_id, street, house_number, postal_code, city, country) VALUES
('test_user_id1', 'Mozartstrasse', '4-10', '53115', 'Bonn', 'Germany'),
('test_user_id2', 'Mozartstrasse', '4-10', '53115', 'Bonn', 'Germany'),
('test_user_id3', 'Mozartstrasse', '4-10', '53115', 'Bonn', 'Germany');

INSERT INTO boxes (user_id, location) VALUES -- enter longitude before latitude
('test_user_id1', ST_GeographyFromText('SRID=4326;POINT(7.090183 50.732843)')),
('test_user_id2', ST_GeographyFromText('SRID=4326;POINT(7.090315 50.733017)')),
('test_user_id3', ST_GeographyFromText('SRID=4326;POINT(7.090492 50.732749)'));

INSERT INTO items (box_id, item_name) VALUES
(1, 'lamp'),
(1, 'CDs'),
(1, 'CD player'),
(2, 'tennis racket'),
(2, 'tennis balls'),
(3, 'Nintendo 64'),
(3, 'grey controller'),
(3, 'red controller'),
(3, 'blue controller');