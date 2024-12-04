const express = require('express');
const router = express.Router();
const RetroTemplateService = require('../services/RetroTemplateService');

const templateService = new RetroTemplateService();

// Get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await templateService.getAllTemplates();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get template by ID
router.get('/:id', async (req, res) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    res.json(template);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Create custom template
router.post('/', async (req, res) => {
  try {
    const template = await templateService.createCustomTemplate(req.body);
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update custom template
router.put('/:id', async (req, res) => {
  try {
    const template = await templateService.updateCustomTemplate(req.params.id, req.body);
    res.json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete custom template
router.delete('/:id', async (req, res) => {
  try {
    await templateService.deleteCustomTemplate(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
