/**
 * Enrollment Model
 * Handles all database queries related to the `enrollments` table.
 */

const getPool = require('../config/db');

/**
 * Retrieve all enrollments joined with course data.
 * @returns {Promise<Array>} Array of enrollment + course info objects
 */
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

/**
 * Add a new enrollment record.
 * @param {Object} data - { course_id, section, selected_credits, cost_per_credit }
 * @returns {Promise<number>} The new enrollment's auto-incremented id
 */
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

/**
 * Update the credit hours (and recalculate cost) for an existing enrollment.
 * @param {number} id              - Enrollment row id
 * @param {number} selected_credits
 * @param {number} cost_per_credit
 */
const updateEnrollment = async (id, { selected_credits, cost_per_credit }) => {
  const db = getPool();
  const total_cost = selected_credits * cost_per_credit;
  await db.query(
    `UPDATE enrollments SET selected_credits = ?, total_cost = ? WHERE id = ?`,
    [selected_credits, total_cost, id]
  );
};

/**
 * Delete a single enrollment by id.
 * @param {number} id
 */
const deleteEnrollment = async (id) => {
  const db = getPool();
  await db.query('DELETE FROM enrollments WHERE id = ?', [id]);
};

/**
 * Delete ALL enrollments (used after a confirmed enrollment).
 */
const deleteAllEnrollments = async () => {
  const db = getPool();
  await db.query('DELETE FROM enrollments');
};

module.exports = {
  getAllEnrollments,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
  deleteAllEnrollments,
};
