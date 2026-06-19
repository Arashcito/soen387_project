const getPool = require('../config/db');

const findByEmail = async (email) => {
  const db = getPool();
  const [rows] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const db = getPool();
  const [rows] = await db.query('SELECT id, name, email FROM students WHERE id = ?', [id]);
  return rows[0] || null;
};

module.exports = { findByEmail, findById };
