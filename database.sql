CREATE DATABASE superlabs_career;

CREATE TABLE location(
    location_id SERIAL PRIMARY KEY,
    location_title VARCHAR(255)
    );
CREATE TABLE jobpost(
    job_id SERIAL PRIMARY KEY,
    job_title TEXT ,
    job_location_type TEXT[] ,
    job_category TEXT ,
    job_type TEXT[] ,
    job_location TEXT ,
    job_experience_level VARCHAR(255) ,
    job_technical_skills TEXT[] ,
    job_education_qualification TEXT[] ,
    job_description TEXT ,
    job_interview_rounds VARCHAR(255) ,
    job_budget VARCHAR(255) ,
    job_create_date TEXT ,
    job_close_date TEXT ,
    job_status TEXT ,
    job_created_by TEXT 
    );



  CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  linkedin TEXT,
  website TEXT,
  resume TEXT NOT NULL,
  cover TEXT NOT NULL,
  job_title TEXT NOT NULL
);


CREATE TABLE category(
    category_id SERIAL PRIMARY KEY,
    category_title VARCHAR(255)
    );

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(30),
    email VARCHAR(40),
    password VARCHAR(150)
    );