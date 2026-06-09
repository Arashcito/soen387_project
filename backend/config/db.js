/**
 * ============================================================
 * DESIGN PATTERN #1: SINGLETON (Creational Pattern)
 * ============================================================
 * Category: Creational
 * Purpose: Ensures that only ONE database connection pool is
 *          created for the entire application lifecycle.
 *
 * Why Singleton here?
 *   - Creating a new DB pool on every request wastes resources.
 *   - A single shared pool handles concurrent requests safely.
 *   - The `instance` variable is kept in module scope and is
 *     only assigned once; every subsequent call returns the
 *     same object — that is the Singleton guarantee.
 * ============================================================
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Private variable — holds the single pool instance
let instance = null;

/**
 * getPool() — returns the shared MySQL connection pool.
 * If it has never been created before, it creates it now
 * (lazy initialization). Otherwise it returns the existing one.
 */
const getPool = () => {
  if (!instance) {
    instance = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'soen387_assignment2',
      waitForConnections: true,
      connectionLimit: 10,   // max simultaneous connections
      queueLimit: 0,
    });
    console.log('[Singleton] Database connection pool created.');
  }
  return instance;
};

module.exports = getPool;
