/**
 * AppError — a custom Error subclass for "operational" errors: mistakes
 * we expect and can handle gracefully (404, 400, etc.).
 *
 * Any error thrown as `new AppError(message, statusCode)` will be caught by
 * the global error handler and returned as clean JSON to the client.
 *
 * Contrast with programmer bugs (typos, null refs) which also end up in the
 * global handler but are logged differently and return a generic 500.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // sets this.message via the built-in Error class
    this.statusCode = statusCode;
    // "fail" for 4xx client errors, "error" for 5xx server errors
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // Flag lets the global handler distinguish expected vs unexpected errors
    this.isOperational = true;

    // Keeps the AppError constructor itself out of the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
