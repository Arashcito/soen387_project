/**
 * Course Model
 * Handles all database queries related to the `courses` table.
 */

const getPool = require('../config/db');

/**
 * Retrieve all courses from the database.
 * @returns {Promise<Array>} Array of course objects
 */
const getAllCourses = async () => {
  const db = getPool(); // Singleton pool
  const [rows] = await db.query('SELECT * FROM courses ORDER BY id ASC');
  return rows;
};

module.exports = { getAllCourses };
