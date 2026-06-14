const express = require('express');
const router = express.Router();
const {
  getEnrollments,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
  confirmEnrollment,
} = require('../controllers/enrollmentController');

router.get('/', getEnrollments);
router.post('/confirm', confirmEnrollment);
router.post('/', addEnrollment);
router.put('/:id', updateEnrollment);
router.delete('/:id', deleteEnrollment);

module.exports = router;
