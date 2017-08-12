CREATE TABLE tasks ( 
    id SERIAL PRIMARY KEY, 
    task VARCHAR(128) NOT NULL, 
    completed BOOLEAN NOT NULL 
);


INSERT INTO tasks (task, completed) VALUES  ('Grocery shop', false);