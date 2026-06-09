/**
 * api.js — Centralized Axios service layer
 * All HTTP calls to the Express backend live here.
 * Components import named functions instead of writing raw axios calls.
 */

import axios from 'axios';

// Base URL — Vite's dev proxy forwards /api → http://localhost:5000
const BASE_URL = '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Courses ───────────────────────────────────────────────────

/** Fetch all available courses */
export const fetchCourses = () => api.get('/courses');

// ── Enrollments ───────────────────────────────────────────────

/** Fetch all current enrollments (joined with course info) */
export const fetchEnrollments = () => api.get('/enrollments');

/**
 * Enroll in a course
 * @param {{ course_id, section, selected_credits }} payload
 */
export const enrollCourse = (payload) => api.post('/enrollments', payload);

/**
 * Update credit hours for an enrollment
 * @param {number} id
 * @param {{ selected_credits }} payload
 */
export const updateEnrollment = (id, payload) =>
  api.put(`/enrollments/${id}`, payload);

/**
 * Remove an enrollment by id
 * @param {number} id
 */
export const removeEnrollment = (id) => api.delete(`/enrollments/${id}`);

/**
 * Confirm all enrollments — clears the enrollment table on the backend
 * and returns a summary { total_courses, total_cost }
 */
export const confirmEnrollments = () => api.post('/enrollments/confirm');
