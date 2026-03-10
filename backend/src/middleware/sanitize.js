/**
 * sanitize.js
 *
 * Two middleware functions:
 *
 * 1. sanitizeBody  – recursively strips MongoDB operator keys (keys starting
 *    with '$') and dot-notation keys from req.body to prevent NoSQL injection.
 *    Replaces the commonly-used `mongo-sanitize` npm package with a
 *    zero-dependency implementation.
 *
 * 2. sanitizeParams – strips '$' and '.' from URL params (req.params) and
 *    query strings (req.query) for the same reason.
 */

const DANGEROUS_KEY = /^\$|\.|\.\$/;

const deepSanitize = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (DANGEROUS_KEY.test(key)) {
        // Drop the key entirely — log in dev so developers notice
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[sanitize] Stripped dangerous key: "${key}"`);
        }
        continue;
      }
      sanitized[key] = deepSanitize(value);
    }
    return sanitized;
  }

  return obj;
};

/** Strip operator keys from req.body */
export const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = deepSanitize(req.body);
  }
  next();
};

/** Strip operator characters from URL params and query strings */
export const sanitizeParams = (req, res, next) => {
  for (const key of Object.keys(req.params)) {
    if (typeof req.params[key] === 'string') {
      req.params[key] = req.params[key].replace(/\$|\./g, '');
    }
  }
  for (const key of Object.keys(req.query)) {
    if (typeof req.query[key] === 'string') {
      req.query[key] = req.query[key].replace(/\$|\./g, '');
    }
  }
  next();
};