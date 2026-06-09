/**
 * Enrollment Controller
 * Handles HTTP requests for enrollment-related routes.
 */

const Enrollment = require('../models/Enrollment');

// Cost per credit hour (read from .env, fallback to 500)
const COST_PER_CREDIT = parseInt(process.env.COST_PER_CREDIT) || 500;

/**
 * GET /api/enrollments
 * Returns all current enrollments (joined with course info).
 */
const getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.getAllEnrollments();
    res.json({ success: true, data: enrollments });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/enrollments
 * Adds a new course enrollment.
 * Body: { course_id, section, selected_credits }
 */
const addEnrollment = async (req, res, next) => {
  try {
    const { course_id, section, selected_credits } = req.body;

    // Input validation
    if (!course_id || !section || selected_credits === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: course_id, section, selected_credits',
      });
    }

    if (selected_credits < 0) {
      return res.status(400).json({
        success: false,
        message: 'Credit hours cannot be negative.',
      });
    }

    const id = await Enrollment.addEnrollment({
      course_id,
      section,
      selected_credits,
      cost_per_credit: COST_PER_CREDIT,
    });

    res.status(201).json({
      success: true,
      message: 'Course enrolled successfully!',
      id,
      cost_per_credit: COST_PER_CREDIT,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/enrollments/:id
 * Updates the selected credit hours for an existing enrollment.
 * Body: { selected_credits }
 */
const updateEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { selected_credits } = req.body;

    if (selected_credits === undefined || selected_credits < 0) {
      return res.status(400).json({
        success: false,
        message: 'Credit hours must be a non-negative number.',
      });
    }

    await Enrollment.updateEnrollment(id, {
      selected_credits,
      cost_per_credit: COST_PER_CREDIT,
    });

    res.json({ success: true, message: 'Enrollment updated successfully.' });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/enrollments/:id
 * Removes a specific enrollment by id.
 */
const deleteEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Enrollment.deleteEnrollment(id);
    res.json({ success: true, message: 'Enrollment removed.' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/enrollments/confirm
 * Confirms all enrollments: calculates total cost, clears the enrollments table,
 * and returns a summary to the frontend.
 */
const confirmEnrollment = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.getAllEnrollments();

    if (enrollments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No enrollments to confirm.',
      });
    }

    const totalCost = enrollments.reduce(
      (sum, e) => sum + parseFloat(e.total_cost),
      0
    );

    await Enrollment.deleteAllEnrollments();

    res.json({
      success: true,
      message: 'Enrollment confirmed successfully!',
      total_courses: enrollments.length,
      total_cost: totalCost,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEnrollments,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
  confirmEnrollment,
};
