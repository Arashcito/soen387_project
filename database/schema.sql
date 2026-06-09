-- ============================================================
-- SOEN 387 Assignment 2 — Database Schema
-- Online Course Enrollment System
-- ============================================================
-- Run this file in MySQL to set up the database:
--   mysql -u root -p < database/schema.sql
-- ============================================================

-- Step 1: Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS soen387_assignment2;

-- Step 2: Switch to the new database
USE soen387_assignment2;

-- ── Table: courses ───────────────────────────────────────────
-- Stores all available courses that students can enroll in.
CREATE TABLE IF NOT EXISTS courses (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  code         VARCHAR(50)  NOT NULL UNIQUE,
  instructor   VARCHAR(255) NOT NULL,
  seats        INT          NOT NULL DEFAULT 30,
  credit_hours INT          NOT NULL DEFAULT 3,
  description  TEXT
);

-- ── Table: enrollments ───────────────────────────────────────
-- Stores a student's current enrollment "cart".
-- Rows are deleted after confirmation (fresh start for each session).
CREATE TABLE IF NOT EXISTS enrollments (
  id               INT      AUTO_INCREMENT PRIMARY KEY,
  course_id        INT      NOT NULL,
  section          ENUM('Morning', 'Afternoon', 'Evening') NOT NULL DEFAULT 'Morning',
  selected_credits INT      NOT NULL DEFAULT 3,
  total_cost       DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  enrolled_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ── Sample Data: courses ─────────────────────────────────────
-- Truncate safely by disabling foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE enrollments;
TRUNCATE TABLE courses;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO courses (title, code, instructor, seats, credit_hours, description) VALUES
(
  'Introduction to Web Development',
  'SOEN-101',
  'Dr. Alice Johnson',
  30, 3,
  'Learn the fundamentals of HTML, CSS, and JavaScript to build modern, responsive websites from scratch.'
),
(
  'Data Structures and Algorithms',
  'COMP-201',
  'Prof. Robert Chen',
  25, 4,
  'Study core data structures like arrays, trees, graphs, and master dynamic programming techniques.'
),
(
  'Database Systems',
  'SOEN-387',
  'Dr. Sarah Williams',
  35, 3,
  'Design and query relational databases using SQL, explore normalization, indexing, and transactions.'
),
(
  'Software Engineering Principles',
  'SOEN-341',
  'Prof. Michael Brown',
  28, 3,
  'Apply software development methodologies, design patterns, and SDLC practices to real-world projects.'
),
(
  'Computer Networks',
  'COMP-445',
  'Dr. Emily Davis',
  20, 3,
  'Understand TCP/IP, DNS, HTTP protocols and network architecture, routing, and security fundamentals.'
),
(
  'Artificial Intelligence',
  'COMP-472',
  'Prof. James Wilson',
  25, 4,
  'Explore search algorithms, machine learning classifiers, and an introduction to neural network design.'
);
