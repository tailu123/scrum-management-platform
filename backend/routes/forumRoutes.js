const express = require('express');
const router = express.Router();
const ForumService = require('../services/ForumService');

const forumService = new ForumService();

// Category Routes
router.get('/categories', async (req, res) => {
  try {
    const categories = await forumService.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/categories/:categoryId', async (req, res) => {
  try {
    const category = await forumService.getCategoryById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Thread Routes
router.post('/threads', async (req, res) => {
  try {
    const thread = await forumService.createThread(req.body);
    res.status(201).json(thread);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/threads/:threadId', async (req, res) => {
  try {
    const thread = await forumService.getThreadById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/categories/:categoryId/threads', async (req, res) => {
  try {
    const { page, limit, sort } = req.query;
    const threads = await forumService.getThreadsByCategory(
      req.params.categoryId,
      { page: Number(page), limit: Number(limit), sort }
    );
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/threads/:threadId', async (req, res) => {
  try {
    const thread = await forumService.updateThread(req.params.threadId, req.body);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    res.json(thread);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/threads/:threadId', async (req, res) => {
  try {
    const success = await forumService.deleteThread(req.params.threadId);
    if (!success) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reply Routes
router.post('/threads/:threadId/replies', async (req, res) => {
  try {
    const reply = await forumService.createReply({
      threadId: req.params.threadId,
      ...req.body
    });
    res.status(201).json(reply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/threads/:threadId/replies', async (req, res) => {
  try {
    const { page, limit } = req.query;
    const replies = await forumService.getRepliesByThread(
      req.params.threadId,
      { page: Number(page), limit: Number(limit) }
    );
    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/replies/:replyId', async (req, res) => {
  try {
    const reply = await forumService.updateReply(req.params.replyId, req.body);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }
    res.json(reply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/replies/:replyId', async (req, res) => {
  try {
    const success = await forumService.deleteReply(req.params.replyId);
    if (!success) {
      return res.status(404).json({ message: 'Reply not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search Routes
router.get('/search', async (req, res) => {
  try {
    const { q, page, limit } = req.query;
    const results = await forumService.searchThreads(
      q,
      { page: Number(page), limit: Number(limit) }
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
