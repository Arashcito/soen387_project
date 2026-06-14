const getPool = require('../config/db');

const getAllEnrollments = async () => {
  const db = getPool();
  const [rows] = await db.query(`
    SELECT
      e.id,
      e.section,
      e.selected_credits,
      e.total_cost,
      c.id        AS course_id,
      c.title,
      c.code,
      c.instructor,
      c.credit_hours,
      c.description
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    ORDER BY e.id ASC
  `);
  return rows;
};

const getEnrollmentById = async (id) => {
  const db = getPool();
  const [rows] = await db.query(`
    SELECT e.*, c.credit_hours, c.title, c.course_id AS c_course_id
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.id = ?
  `, [id]);
  return rows[0] || null;
};

const findByCourseId = async (course_id) => {
  const db = getPool();
  const [rows] = await db.query(
    'SELECT id FROM enrollments WHERE course_id = ?',
    [course_id]
  );
  return rows[0] || null;
};

const addEnrollment = async ({ course_id, section, selected_credits, cost_per_credit }) => {
  const db = getPool();
  const total_cost = selected_credits * cost_per_credit;
  const [result] = await db.query(
    `INSERT INTO enrollments (course_id, section, selected_credits, total_cost)
     VALUES (?, ?, ?, ?)`,
    [course_id, section, selected_credits, total_cost]
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

const deleteEnrollment = async (id) => {
  const db = getPool();
  await db.query('DELETE FROM enrollments WHERE id = ?', [id]);
};

const deleteAllEnrollments = async () => {
  const db = getPool();
  await db.query('DELETE FROM enrollments');
};

module.exports = {
  getAllEnrollments,
  getEnrollmentById,
  findByCourseId,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
  deleteAllEnrollments,
};
