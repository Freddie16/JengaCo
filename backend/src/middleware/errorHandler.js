/**
 * errorHandler.js
 *
 * Centralised error-handling middleware. Must be registered LAST in index.js
 * (after all routes) so it catches errors forwarded via next(err).
 *
 * Usage in controllers / routes:
 *   return next(new Error('Something broke'));
 *   or throw and let asyncHandler (below) forward it.
 */

// Attach a status code to any plain Error for convenience:
//   const err = new Error('Not found'); err.status = 404; return next(err);
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  // Log all 5xx server errors; skip 4xx client errors to keep logs clean
  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${statusCode}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack })
  });
};

/**
 * asyncHandler
 *
 * Wraps an async route/controller function and automatically forwards any
 * rejected promise to next(err), eliminating try/catch boilerplate in
 * every controller.
 *
 * Usage:
 *   router.get('/', asyncHandler(async (req, res) => { ... }));
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);