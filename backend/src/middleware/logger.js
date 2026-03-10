/**
 * logger.js
 *
 * Structured HTTP request logger.
 * Logs method, path, status code, response time, and the authenticated
 * user's id (once auth middleware has run).
 *
 * In production you would pipe this to a log aggregator (Datadog, Logtail, etc.).
 * For now it writes clean, colour-coded lines to stdout.
 */

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  grey: '\x1b[90m'
};

const colorForStatus = (status) => {
  if (status >= 500) return COLORS.red;
  if (status >= 400) return COLORS.yellow;
  if (status >= 300) return COLORS.cyan;
  return COLORS.green;
};

const isProd = process.env.NODE_ENV === 'production';

export const requestLogger = (req, res, next) => {
  const startedAt = Date.now();

  // Capture the real end() so we can hook into it
  const originalEnd = res.end.bind(res);

  res.end = (...args) => {
    const duration = Date.now() - startedAt;
    const status = res.statusCode;
    const userId = req.user?._id || '-';

    if (isProd) {
      // JSON log for production — easy to parse by log aggregators
      console.log(
        JSON.stringify({
          ts: new Date().toISOString(),
          method: req.method,
          path: req.originalUrl,
          status,
          duration_ms: duration,
          user: userId,
          ip: req.ip
        })
      );
    } else {
      // Human-readable coloured log for development
      const colour = colorForStatus(status);
      console.log(
        `${COLORS.grey}${new Date().toISOString()}${COLORS.reset} ` +
        `${COLORS.cyan}${req.method.padEnd(7)}${COLORS.reset}` +
        `${req.originalUrl.padEnd(50)} ` +
        `${colour}${status}${COLORS.reset} ` +
        `${COLORS.grey}${duration}ms  user:${userId}${COLORS.reset}`
      );
    }

    originalEnd(...args);
  };

  next();
};