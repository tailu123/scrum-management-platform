const express = require('express');
const router = express.Router();
const TaskService = require('../services/TaskService');

const taskService = new TaskService();

// Get all tasks with optional filters
router.get('/', async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks(req.query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task status (specific endpoint for Kanban board)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const task = await taskService.updateTaskStatus(req.params.id, status);
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
