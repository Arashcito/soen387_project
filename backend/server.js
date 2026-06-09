/**
 * server.js — Application Entry Point
 * Sets up Express, middleware, routes, and starts the HTTP server.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file FIRST
dotenv.config();

const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ── Middleware ────────────────────────────────────────────────
// Allow cross-origin requests from the React frontend (localhost:5173)
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));

// Parse incoming JSON request bodies
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Health-check endpoint — useful for testing if the server is alive
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running!' });
});

// ── Global Error Handler ──────────────────────────────────────
// Must be registered AFTER all routes
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
