const express = require('express');
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');

const { validateCreateTask, validateUpdateTask } = require('../middleware/validateTask');

// Routes for /api/tasks (no :id)
router
  .route('/')
  .post(validateCreateTask, createTask) // validate first, then create
  .get(getAllTasks);

// Routes for /api/tasks/:id
router
  .route('/:id')
  .get(getTaskById)
  .put(validateUpdateTask, updateTask)
  .delete(deleteTask);

module.exports = router;
