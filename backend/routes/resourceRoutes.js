const express = require('express');
const router = express.Router();
const ResourceService = require('../services/ResourceService');

const resourceService = new ResourceService();

// Get all resources with optional filters
router.get('/', async (req, res) => {
  try {
    const resources = await resourceService.getAllResources(req.query);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await resourceService.getResourceById(req.params.id);
    res.json(resource);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get resources by category
router.get('/category/:category', async (req, res) => {
  try {
    const resources = await resourceService.getResourcesByCategory(req.params.category);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get resources by difficulty
router.get('/difficulty/:level', async (req, res) => {
  try {
    const resources = await resourceService.getResourcesByDifficulty(req.params.level);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search resources by tags
router.get('/search/tags', async (req, res) => {
  try {
    const tags = req.query.tags?.split(',') || [];
    const resources = await resourceService.searchResourcesByTags(tags);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new resource
router.post('/', async (req, res) => {
  try {
    const resource = await resourceService.createResource(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a resource
router.put('/:id', async (req, res) => {
  try {
    const resource = await resourceService.updateResource(req.params.id, req.body);
    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a resource
router.delete('/:id', async (req, res) => {
  try {
    await resourceService.deleteResource(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
