/**
 * DESIGN PATTERN #1 — SINGLETON (Creational)
 *
 * Ensures only ONE MySQL connection pool exists for the entire app.
 * Every module that calls getPool() receives the same instance,
 * avoiding the overhead of creating a new pool per request.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

let instance = null;

const getPool = () => {
  if (!instance) {
    instance = mysql.createPool({
      host:     process.env.DB_HOST || 'localhost',
      port:     process.env.DB_PORT || 3306,
      user:     process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'soen387_assignment2',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('[Singleton] Database connection pool created.');
  }
  return instance;
};

module.exports = getPool;
