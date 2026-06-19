const getPool = require('../config/db');

const getEnrollmentsByStatus = async (student_id, status) => {
  const db = getPool();
  const [rows] = await db.query(`
    SELECT
      e.id,
      e.section,
      e.selected_credits,
      e.total_cost,
      e.status,
      e.enrolled_at,
      c.id          AS course_id,
      c.title,
      c.code,
      c.instructor,
      c.credit_hours,
      c.description
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = ? AND e.status = ?
    ORDER BY e.id ASC
  `, [student_id, status]);
  return rows;
};

const getEnrollmentById = async (id) => {
  const db = getPool();
  const [rows] = await db.query(`
    SELECT e.*, c.credit_hours, c.title
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.id = ?
  `, [id]);
  return rows[0] || null;
};

const findByCourseId = async (course_id, student_id) => {
  const db = getPool();
  const [rows] = await db.query(
    'SELECT id FROM enrollments WHERE course_id = ? AND student_id = ?',
    [course_id, student_id]
  );
  return rows[0] || null;
};

const addEnrollment = async ({ student_id, course_id, section, selected_credits, cost_per_credit }) => {
  const db = getPool();
  const total_cost = selected_credits * cost_per_credit;
  const [result] = await db.query(
    `INSERT INTO enrollments (student_id, course_id, section, selected_credits, total_cost)
     VALUES (?, ?, ?, ?, ?)`,
    [student_id, course_id, section, selected_credits, total_cost]
  );
  return result.insertId;
};

const updateEnrollment = async (id, { selected_credits, cost_per_credit }) => {
  const db = getPool();
  const total_cost = selected_credits * cost_per_credit;
  await db.query(
    `UPDATE enrollments SET selected_credits = ?, total_cost = ? WHERE id = ?`,
    [selected_credits, total_cost, id]
  );
};

const confirmAllPending = async (student_id) => {
  const db = getPool();
  await db.query(
    `UPDATE enrollments SET status = 'confirmed' WHERE student_id = ? AND status = 'pending'`,
    [student_id]
  );
};

const deleteEnrollment = async (id) => {
  const db = getPool();
  await db.query('DELETE FROM enrollments WHERE id = ?', [id]);
};

module.exports = {
  getEnrollmentsByStatus,
  getEnrollmentById,
  findByCourseId,
  addEnrollment,
  updateEnrollment,
  confirmAllPending,
  deleteEnrollment,
};
