/**
 * Course Controller
 * Handles HTTP requests for course-related routes.
 * Follows the MVC pattern: controller sits between route and model.
 */

const Course = require('../models/Course');

/**
 * GET /api/courses
 * Returns all courses in the database.
 */
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.getAllCourses();
    res.json({ success: true, data: courses });
  } catch (err) {
    next(err); // Pass to global error handler
  }
};

module.exports = { getCourses };
