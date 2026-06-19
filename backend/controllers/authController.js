const Student = require('../models/Student');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const student = await Student.findByEmail(email);

    if (!student || student.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    res.json({
      success: true,
      student: { id: student.id, name: student.name, email: student.email },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login };
