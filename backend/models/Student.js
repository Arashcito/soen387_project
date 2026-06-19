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

const createStudent = async ({ name, email, password }) => {
  const db = getPool();
  const [result] = await db.query(
    'INSERT INTO students (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  return result.insertId;
};

module.exports = { findByEmail, findById, createStudent };
