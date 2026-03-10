/**
 * validate.js
 *
 * Lightweight schema-based request body validator.
 * Returns 422 Unprocessable Entity with a list of field errors when
 * validation fails, so the frontend can display per-field messages.
 *
 * Usage:
 *   import { validate, schemas } from '../middleware/validate.js';
 *   router.post('/login', validate(schemas.login), loginController);
 */

// ── Tiny rule engine ──────────────────────────────────────────────────────────

const rules = {
  required: (val) => (val !== undefined && val !== null && val !== '' ? null : 'is required'),
  string: (val) => (typeof val === 'string' ? null : 'must be a string'),
  email: (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'must be a valid email address',
  minLength: (min) => (val) =>
    typeof val === 'string' && val.length >= min
      ? null
      : `must be at least ${min} characters`,
  maxLength: (max) => (val) =>
    typeof val === 'string' && val.length <= max
      ? null
      : `must be no more than ${max} characters`,
  positiveNumber: (val) =>
    !isNaN(Number(val)) && Number(val) > 0 ? null : 'must be a positive number',
  oneOf: (options) => (val) =>
    options.includes(val) ? null : `must be one of: ${options.join(', ')}`
};

// ── Schema definitions ────────────────────────────────────────────────────────

export const schemas = {
  // Auth
  register: {
    name: [rules.required, rules.string, rules.minLength(2), rules.maxLength(80)],
    email: [rules.required, rules.email],
    password: [rules.required, rules.minLength(6), rules.maxLength(128)]
  },
  login: {
    email: [rules.required, rules.email],
    password: [rules.required, rules.minLength(1)]
  },

  // Projects
  createProject: {
    name: [rules.required, rules.string, rules.minLength(2), rules.maxLength(120)],
    location: [rules.required, rules.string, rules.minLength(2), rules.maxLength(120)],
    budget: [rules.required, rules.positiveNumber]
  },

  // Materials
  createMaterial: {
    item: [rules.required, rules.string, rules.minLength(1), rules.maxLength(120)],
    quantity: [rules.required, rules.positiveNumber],
    cost: [rules.required, rules.positiveNumber]
  },

  // Milestones
  createMilestone: {
    title: [rules.required, rules.string, rules.minLength(2), rules.maxLength(120)],
    description: [rules.required, rules.string, rules.minLength(5)],
    cost: [rules.required, rules.positiveNumber]
  },

  // Fundis
  createFundi: {
    name: [rules.required, rules.string, rules.minLength(2), rules.maxLength(80)],
    category: [rules.required, rules.oneOf(['Plumber', 'Electrician', 'Mason', 'Foreman'])]
  }
};

// ── Middleware factory ────────────────────────────────────────────────────────

export const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, fieldRules] of Object.entries(schema)) {
    const value = req.body[field];
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors.push({ field, message: `${field} ${error}` });
        break; // only report first failing rule per field
      }
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};