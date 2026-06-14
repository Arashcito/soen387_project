const getPool = require('../config/db');

const getAllCourses = async () => {
  const db = getPool();
  const [rows] = await db.query('SELECT * FROM courses ORDER BY id ASC');
  return rows;
};

const getCourseById = async (id) => {
  const db = getPool();
  const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
  return rows[0] || null;
};

const decrementSeats = async (id) => {
  const db = getPool();
  await db.query('UPDATE courses SET seats = seats - 1 WHERE id = ? AND seats > 0', [id]);
};

const incrementSeats = async (id) => {
  const db = getPool();
  await db.query('UPDATE courses SET seats = seats + 1 WHERE id = ?', [id]);
};

module.exports = { getAllCourses, getCourseById, decrementSeats, incrementSeats };
