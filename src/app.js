const express = require('express');
const morgan = require('morgan');

const taskRoutes = require('./routes/task.routes');
const globalErrorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

// Parse JSON bodies — without this, req.body would be undefined
app.use(express.json());

// HTTP request logger — "dev" format logs: METHOD /path STATUS ms
// Only active outside production to avoid noisy logs in deployment
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// Health check — useful for uptime monitoring and deployment platforms (e.g. Render)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Task Manager API is up and running',
    timestamp: new Date().toISOString(),
  });
});

// Mount task CRUD routes under /api/tasks
app.use('/api/tasks', taskRoutes);

// Catch-all for any route that wasn't matched above
// app.all('*') runs for every HTTP method on every unmatched path
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
// Must come LAST — Express recognises 4-param functions as error handlers
app.use(globalErrorHandler);

module.exports = app;
