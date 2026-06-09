/**
 * Enrollment Routes
 * Maps HTTP methods + paths to the appropriate controller functions.
 *
 * IMPORTANT: /confirm must be registered BEFORE /:id to prevent
 * Express from treating "confirm" as a dynamic :id parameter.
 */

const express = require('express');
const router = express.Router();
const {
  getEnrollments,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
  confirmEnrollment,
} = require('../controllers/enrollmentController');

// GET    /api/enrollments         — fetch all enrollments
router.get('/', getEnrollments);

// POST   /api/enrollments/confirm — confirm and clear all enrollments
router.post('/confirm', confirmEnrollment);

// POST   /api/enrollments         — add a new enrollment
router.post('/', addEnrollment);

// PUT    /api/enrollments/:id     — update credit hours for an enrollment
router.put('/:id', updateEnrollment);

// DELETE /api/enrollments/:id     — remove an enrollment
router.delete('/:id', deleteEnrollment);

module.exports = router;
