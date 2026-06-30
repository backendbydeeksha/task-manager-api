/**
 * asyncHandler — wraps an async route handler so that any thrown error or
 * rejected promise is automatically forwarded to Express's next() function,
 * which routes it to the global error handler.
 *
 * Without this you'd need try/catch in every controller:
 *   async (req, res, next) => { try { ... } catch (e) { next(e); } }
 *
 * With this you just write:
 *   asyncHandler(async (req, res) => { ... })
 * and errors bubble up automatically.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
