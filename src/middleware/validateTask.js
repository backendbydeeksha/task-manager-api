const { body, validationResult } = require('express-validator');

/**
 * Reads the results that express-validator accumulated in previous middleware
 * and short-circuits with a 400 if any rules were violated.
 * Each error includes the field name and a human-readable message.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed. Please fix the errors below and try again.',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// --- Rules for POST /api/tasks ---
// title is required; everything else is optional with sensible defaults on the model
const validateCreateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be one of: todo, in-progress, done'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date (e.g. 2024-12-31)')
    .toDate(), // convert the string to a JS Date object for Mongoose

  handleValidationErrors,
];

// --- Rules for PUT /api/tasks/:id ---
// All fields are optional on update — client sends only what changed
const validateUpdateTask = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be an empty string')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be one of: todo, in-progress, done'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date (e.g. 2024-12-31)')
    .toDate(),

  handleValidationErrors,
];

module.exports = { validateCreateTask, validateUpdateTask };
