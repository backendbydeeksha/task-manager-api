const AppError = require('../utils/AppError');

// --- Mongoose-specific error transformers ---
// These convert Mongoose's raw errors into clean, user-friendly AppErrors.

// Triggered when a route param like :id isn't a valid MongoDB ObjectId
const handleCastError = (err) => {
  const message = `"${err.value}" is not a valid ID.`;
  return new AppError(message, 400);
};

// Triggered when you try to save a value that violates a unique index
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate value for field "${field}". Please use a different value.`;
  return new AppError(message, 400);
};

// Triggered by Mongoose schema-level validators (required, enum, maxlength, etc.)
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${messages.join('. ')}`, 400);
};

/**
 * Global error-handling middleware.
 *
 * Express identifies this as an error handler (not a normal middleware) because
 * it has exactly 4 parameters: (err, req, res, next). Any time code calls
 * next(someError), Express skips regular middleware and comes straight here.
 *
 * Response shape is always:
 *   { status: "fail"|"error", message: "...", [stack: "..."] }
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Clone the error so transformations don't mutate the original
  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  error.message = err.message;

  // Translate known Mongoose error types
  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);

  const response = {
    status: error.status,
    message: error.message,
  };

  // Only expose the stack trace during development — never in production
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
};

module.exports = globalErrorHandler;
