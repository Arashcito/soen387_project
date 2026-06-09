/**
 * Global Error Handler Middleware
 * Catches any error passed via next(err) in controllers.
 * Must have 4 parameters for Express to recognize it as an error handler.
 */

const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
  });
};

module.exports = errorHandler;
