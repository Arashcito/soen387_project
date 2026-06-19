const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const COST_PER_CREDIT = parseInt(process.env.COST_PER_CREDIT) || 500;
const VALID_SECTIONS  = ['Morning', 'Afternoon', 'Evening'];

// GET /api/enrollments?student_id=X&status=pending|confirmed
const getEnrollments = async (req, res, next) => {
  try {
    const { student_id, status = 'pending' } = req.query;
    if (!student_id) {
      return res.status(400).json({ success: false, message: 'student_id is required.' });
    }
    const enrollments = await Enrollment.getEnrollmentsByStatus(student_id, status);
    res.json({ success: true, data: enrollments });
  } catch (err) {
    next(err);
  }
};

// POST /api/enrollments
const addEnrollment = async (req, res, next) => {
  try {
    const { student_id, course_id, section, selected_credits } = req.body;

    if (!student_id || !course_id || !section || selected_credits === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: student_id, course_id, section, selected_credits.',
      });
    }

    if (!VALID_SECTIONS.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `Invalid section. Must be one of: ${VALID_SECTIONS.join(', ')}.`,
      });
    }

    const course = await Course.getCourseById(course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }
    if (course.seats <= 0) {
      return res.status(400).json({ success: false, message: 'No seats available for this course.' });
    }

    const credits = parseInt(selected_credits, 10);
    if (isNaN(credits) || credits < 1) {
      return res.status(400).json({ success: false, message: 'Credit hours must be at least 1.' });
    }
    if (credits > course.credit_hours) {
      return res.status(400).json({
        success: false,
        message: `Credit hours cannot exceed the course maximum of ${course.credit_hours}.`,
      });
    }

    const existing = await Enrollment.findByCourseId(course_id, student_id);
    if (existing) {
      return res.status(409).json({ success: false, message: 'You are already enrolled in this course.' });
    }

    const id = await Enrollment.addEnrollment({
      student_id, course_id, section,
      selected_credits: credits,
      cost_per_credit: COST_PER_CREDIT,
    });

    await Course.decrementSeats(course_id);

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

// PUT /api/enrollments/:id
const updateEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { selected_credits } = req.body;

    if (selected_credits === undefined) {
      return res.status(400).json({ success: false, message: 'selected_credits is required.' });
    }

    const enrollment = await Enrollment.getEnrollmentById(id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found.' });
    }

    const credits = parseInt(selected_credits, 10);
    if (isNaN(credits) || credits < 0) {
      return res.status(400).json({ success: false, message: 'Credit hours must be a non-negative number.' });
    }
    if (credits > enrollment.credit_hours) {
      return res.status(400).json({
        success: false,
        message: `Credit hours cannot exceed the course maximum of ${enrollment.credit_hours}.`,
      });
    }

    await Enrollment.updateEnrollment(id, { selected_credits: credits, cost_per_credit: COST_PER_CREDIT });
    res.json({ success: true, message: 'Enrollment updated successfully.' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/enrollments/:id
const deleteEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.getEnrollmentById(id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found.' });
    }

    await Enrollment.deleteEnrollment(id);
    await Course.incrementSeats(enrollment.course_id);

    res.json({ success: true, message: 'Enrollment removed.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/enrollments/confirm
const confirmEnrollment = async (req, res, next) => {
  try {
    const { student_id } = req.body;
    if (!student_id) {
      return res.status(400).json({ success: false, message: 'student_id is required.' });
    }

    const pending = await Enrollment.getEnrollmentsByStatus(student_id, 'pending');
    if (pending.length === 0) {
      return res.status(400).json({ success: false, message: 'No enrollments to confirm.' });
    }

    const totalCost = pending.reduce((sum, e) => sum + parseFloat(e.total_cost), 0);

    // Mark as confirmed — keep them in DB so My Classes can show them
    await Enrollment.confirmAllPending(student_id);

    res.json({
      success: true,
      message: 'Enrollment confirmed successfully!',
      total_courses: pending.length,
      total_cost: totalCost,
      courses: pending.map((e) => ({
        title:            e.title,
        code:             e.code,
        section:          e.section,
        selected_credits: e.selected_credits,
        total_cost:       parseFloat(e.total_cost),
      })),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getEnrollments, addEnrollment, updateEnrollment, deleteEnrollment, confirmEnrollment };
