const express = require('express');
const router = express.Router();
const BurndownService = require('../services/BurndownService');
const SprintService = require('../services/SprintService');
const TaskService = require('../services/TaskService');

const burndownService = new BurndownService();
const sprintService = new SprintService();
const taskService = new TaskService();

// Get burndown chart data for a sprint
router.get('/sprint/:sprintId', async (req, res) => {
  try {
    const { sprintId } = req.params;
    
    // Get sprint data
    const sprint = await sprintService.getSprintById(sprintId);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    // Get tasks for the sprint
    const tasks = await taskService.getTasksBySprint(sprintId);

    // Calculate burndown data
    const burndownData = await burndownService.getBurndownData(
      sprintId,
      sprint,
      tasks
    );

    res.json(burndownData);
  } catch (error) {
    console.error('Error getting burndown data:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update burndown data when a task is updated
router.post('/sprint/:sprintId/task/:taskId', async (req, res) => {
  try {
    const { sprintId, taskId } = req.params;
    const { action } = req.body;

    const updatedData = await burndownService.updateBurndownData(
      sprintId,
      taskId,
      action
    );

    res.json(updatedData);
  } catch (error) {
    console.error('Error updating burndown data:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
