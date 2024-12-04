const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const { authenticate, authorize, sanitizeInput } = require('../middleware/auth');

const authService = new AuthService();

// Register new user
router.post('/register', sanitizeInput, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.register({ username, email, password });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', sanitizeInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json(req.user.getPublicProfile());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile
router.put('/profile', authenticate, sanitizeInput, async (req, res) => {
  try {
    const result = await authService.updateProfile(req.user._id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Change password
router.put('/change-password', authenticate, sanitizeInput, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(
      req.user._id,
      currentPassword,
      newPassword
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// OAuth routes
router.post('/oauth/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const { profile } = req.body;
    const result = await authService.oauthLogin(profile, provider);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin routes
router.get('/users', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/users/:userId/role', 
  authenticate, 
  authorize(['admin']), 
  sanitizeInput,
  async (req, res) => {
    try {
      const { role } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { role },
        { new: true }
      );
      res.json(user.getPublicProfile());
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
