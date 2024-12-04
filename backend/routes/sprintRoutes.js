const express = require('express');
const router = express.Router();
const SprintService = require('../services/SprintService');

// Dependency injection for better testability and extensibility
const sprintService = new SprintService();

// Each route handles a single responsibility
router.get('/', async (req, res) => {
  try {
    const sprints = await sprintService.getAllSprints();
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const sprint = await sprintService.createSprint(req.body);
    res.status(201).json(sprint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const sprint = await sprintService.updateSprint(req.params.id, req.body);
    res.json(sprint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
