-- SOEN 387 Assignment 2 — Database Schema
-- Run: mysql -u root -proot123 < database/schema.sql

CREATE DATABASE IF NOT EXISTS soen387_assignment2;
USE soen387_assignment2;

-- ── students ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── courses ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  code         VARCHAR(50)  NOT NULL UNIQUE,
  instructor   VARCHAR(255) NOT NULL,
  seats        INT          NOT NULL DEFAULT 30,
  credit_hours INT          NOT NULL DEFAULT 3,
  description  TEXT
);

-- ── enrollments ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id               INT      AUTO_INCREMENT PRIMARY KEY,
  student_id       INT      NOT NULL,
  course_id        INT      NOT NULL,
  section          ENUM('Morning', 'Afternoon', 'Evening') NOT NULL DEFAULT 'Morning',
  selected_credits INT      NOT NULL DEFAULT 3,
  total_cost       DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  enrolled_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE,
  UNIQUE KEY unique_student_course (student_id, course_id)
);

-- ── Seed Data ─────────────────────────────────────────────────
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE enrollments;
TRUNCATE TABLE courses;
TRUNCATE TABLE students;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO students (name, email, password) VALUES
('Alice Johnson',  'alice@concordia.ca',   'pass123'),
('Bob Smith',      'bob@concordia.ca',     'pass123'),
('Charlie Brown',  'charlie@concordia.ca', 'pass123');

INSERT INTO courses (title, code, instructor, seats, credit_hours, description) VALUES
('Introduction to Web Development',  'SOEN-101', 'Dr. Alice Johnson',   30, 3, 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern, responsive websites from scratch.'),
('Data Structures and Algorithms',   'COMP-201', 'Prof. Robert Chen',   25, 4, 'Study core data structures like arrays, trees, graphs, and master dynamic programming techniques.'),
('Database Systems',                 'SOEN-387', 'Dr. Sarah Williams',  35, 3, 'Design and query relational databases using SQL, explore normalization, indexing, and transactions.'),
('Software Engineering Principles',  'SOEN-341', 'Prof. Michael Brown', 28, 3, 'Apply software development methodologies, design patterns, and SDLC practices to real-world projects.'),
('Computer Networks',                'COMP-445', 'Dr. Emily Davis',     20, 3, 'Understand TCP/IP, DNS, HTTP protocols and network architecture, routing, and security fundamentals.'),
('Artificial Intelligence',          'COMP-472', 'Prof. James Wilson',  25, 4, 'Explore search algorithms, machine learning classifiers, and an introduction to neural network design.');
