const Task = require('../models/task.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// ─── CREATE ──────────────────────────────────────────────────────────────────

// POST /api/tasks
// asyncHandler catches any thrown error and passes it to the global error handler
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.create({ title, description, status, priority, dueDate });

  // 201 Created — standard response for a successful resource creation
  res.status(201).json({
    status: 'success',
    data: { task },
  });
});

// ─── READ (LIST) ──────────────────────────────────────────────────────────────

// GET /api/tasks?status=todo&priority=high&page=1&limit=10&sortBy=dueDate&order=asc
const getAllTasks = asyncHandler(async (req, res) => {
  // --- Filtering ---
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;

  // --- Sorting ---
  const sortBy = req.query.sortBy || 'createdAt'; // field name to sort on
  const order = req.query.order === 'asc' ? 1 : -1; // 1 = ascending, -1 = descending
  const sort = { [sortBy]: order };

  // --- Pagination ---
  // Math.max(1, ...) prevents page=0 or negative pages
  // Math.min(100, ...) caps limit to avoid huge result sets
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit; // number of documents to skip

  // Run count and find at the same time using Promise.all for efficiency
  const [total, tasks] = await Promise.all([
    Task.countDocuments(filter),
    Task.find(filter).sort(sort).skip(skip).limit(limit),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data: { tasks },
  });
});

// ─── READ (SINGLE) ────────────────────────────────────────────────────────────

// GET /api/tasks/:id
const getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    // Pass a 404 AppError to next() — it goes straight to globalErrorHandler
    return next(new AppError(`No task found with ID: ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: { task },
  });
});

// ─── UPDATE ───────────────────────────────────────────────────────────────────

// PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { title, description, status, priority, dueDate },
    {
      new: true,          // return the updated document, not the old one
      runValidators: true, // re-run schema validators on the new values
    }
  );

  if (!task) {
    return next(new AppError(`No task found with ID: ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: { task },
  });
});

// ─── DELETE ───────────────────────────────────────────────────────────────────

// DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new AppError(`No task found with ID: ${req.params.id}`, 404));
  }

  // 204 No Content — success, but nothing to return in the body
  res.status(204).send();
});

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
