/**
 * Course Routes
 * Maps HTTP methods + paths to the appropriate controller functions.
 */

const express = require('express');
const router = express.Router();
const { getCourses } = require('../controllers/courseController');

// GET /api/courses — fetch all courses
router.get('/', getCourses);

module.exports = router;
