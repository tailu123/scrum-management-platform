const express = require('express');
const router = express.Router();
const RetroService = require('../services/RetroService');

const retroService = new RetroService();

// Create a new retrospective
router.post('/', async (req, res) => {
  try {
    const retro = await retroService.createRetro(req.body);
    res.status(201).json(retro);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific retrospective
router.get('/:id', async (req, res) => {
  try {
    const retro = await retroService.getRetroById(req.params.id);
    res.json(retro);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get retrospectives by sprint ID
router.get('/sprint/:sprintId', async (req, res) => {
  try {
    const retros = await retroService.getRetrosBySprintId(req.params.sprintId);
    res.json(retros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update retrospective status
router.patch('/:id/status', async (req, res) => {
  try {
    const retro = await retroService.updateRetroStatus(req.params.id, req.body.status);
    res.json(retro);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Retro Items Routes

// Add a new retro item
router.post('/:retroId/items', async (req, res) => {
  try {
    const item = await retroService.addRetroItem(req.params.retroId, req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all items for a retrospective
router.get('/:retroId/items', async (req, res) => {
  try {
    const items = await retroService.getRetroItems(req.params.retroId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a retro item
router.put('/items/:itemId', async (req, res) => {
  try {
    const item = await retroService.updateRetroItem(req.params.itemId, req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add vote to an item
router.post('/items/:itemId/vote', async (req, res) => {
  try {
    const item = await retroService.addVoteToItem(req.params.itemId);
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove vote from an item
router.delete('/items/:itemId/vote', async (req, res) => {
  try {
    const item = await retroService.removeVoteFromItem(req.params.itemId);
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a retro item
router.delete('/items/:itemId', async (req, res) => {
  try {
    await retroService.deleteRetroItem(req.params.itemId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
