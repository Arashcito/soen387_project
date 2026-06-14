const Course = require('../models/Course');

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.getAllCourses();
    res.json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCourses };
