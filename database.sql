CREATE TABLE to_do_app ( 
    id SERIAL PRIMARY KEY, 
    todo VARCHAR(128) NOT NULL, 
    completed BOOLEAN NOT NULL 
);


INSERT INTO to_do_app (todo, completed) VALUES  ('Grocery shop', false);