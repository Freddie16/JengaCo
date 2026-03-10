/**
 * rateLimiter.js
 *
 * In-memory rate limiting without an external dependency.
 * For multi-instance deployments, swap the store for a Redis-backed
 * solution (e.g. rate-limiter-flexible with ioredis).
 *
 * Two limiters are exported:
 *   authLimiter  – tight limits for /api/auth/login & /api/auth/register
 *   apiLimiter   – relaxed limits for all other API endpoints
 */

// Simple in-memory store: Map<key, { count, resetAt }>
const store = new Map();

const createLimiter = ({ windowMs, max, message }) => {
  return (req, res, next) => {
    // Key by IP address (use req.ip which respects X-Forwarded-For via Express trust proxy)
    const key = req.ip;
    const now = Date.now();

    const record = store.get(key);

    if (!record || now > record.resetAt) {
      // First request in window, or window has expired — reset
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      const retryAfterSecs = Math.ceil((record.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfterSecs));
      return res.status(429).json({
        success: false,
        message,
        retryAfter: retryAfterSecs
      });
    }

    record.count += 1;
    next();
  };
};

// Periodically purge expired entries to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetAt) store.delete(key);
  }
}, 60_000); // every 60 s

// ── Exported limiters ─────────────────────────────────────────────────────────

/** Strict limiter for authentication endpoints */
export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 login/register attempts per 15 min
  message: 'Too many authentication attempts. Please try again in 15 minutes.'
});

/** General limiter for all other API routes */
export const apiLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 120,            // 120 requests per minute per IP
  message: 'Too many requests. Please slow down.'
});