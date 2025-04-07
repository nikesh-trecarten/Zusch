-- CREATE EXTENSION postgis;
-- ^this only needs to be run once

DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS boxes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
clerk_id VARCHAR(255) UNIQUE NOT NULL,
user_name VARCHAR(255) UNIQUE NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
street VARCHAR(255) NOT NULL,
house_number VARCHAR(255) NOT NULL,
postal_code VARCHAR(255) NOT NULL,
city VARCHAR(255) NOT NULL,
country VARCHAR(255) NOT NULL
);

CREATE TABLE boxes (
box_id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
location GEOGRAPHY(Point, 4326) NOT NULL,
latitude DOUBLE PRECISION GENERATED ALWAYS AS (ST_Y(location::geometry)) STORED,
longitude DOUBLE PRECISION GENERATED ALWAYS AS (ST_X(location::geometry)) STORED
);

CREATE TABLE items (
item_id SERIAL PRIMARY KEY,
box_id INT NOT NULL REFERENCES boxes(box_id) ON DELETE CASCADE,
item_name VARCHAR(255) NOT NULL
);

INSERT INTO users (clerk_id, user_name, email, street, house_number, postal_code, city, country) VALUES
('test_clerk_id1', 'test_user1', 'test1@test.de', 'Mozartstrasse', '4-10', '53115', 'Bonn', 'Germany'),
('test_clerk_id2', 'test_user2', 'test2@test.de', 'Mozartstrasse', '4-10', '53115', 'Bonn', 'Germany'),
('test_clerk_id3', 'test_user3', 'test3@test.de', 'Mozartstrasse', '4-10', '53115', 'Bonn', 'Germany');

INSERT INTO boxes (user_id, location) VALUES -- enter longitude before latitude
(1, ST_GeographyFromText('SRID=4326;POINT(7.090183 50.732843)')),
(2, ST_GeographyFromText('SRID=4326;POINT(7.090315 50.733017)')),
(3, ST_GeographyFromText('SRID=4326;POINT(7.090492 50.732749)'));

INSERT INTO items (box_id, item_name) VALUES
(1, 'test_box1_test_item1'),
(1, 'test_box1_test_item2'),
(1, 'test_box1_test_item3'),
(2, 'test_box2_test_item1'),
(2, 'test_box2_test_item2'),
(2, 'test_box2_test_item3'),
(3, 'test_box3_test_item1'),
(3, 'test_box3_test_item2'),
(3, 'test_box3_test_item3');