const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ id: userId }, this.jwtSecret, {
      expiresIn: '30d'
    });
  }

  // Register new user
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: userData.email },
          { username: userData.username }
        ]
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      // Generate token
      const token = this.generateToken(user._id);

      return {
        token,
        user: user.getPublicProfile()
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      user.lastLogin = Date.now();
      await user.save();

      // Generate token
      const token = this.generateToken(user._id);

      return {
        token,
        user: user.getPublicProfile()
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Verify token and get user
  async verifyToken(token) {
    try {
      if (!token) {
        throw new Error('No token provided');
      }

      // Verify token
      const decoded = jwt.verify(token, this.jwtSecret);
      
      // Get user
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }

      return user.getPublicProfile();
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  // OAuth login/register
  async oauthLogin(profile, provider) {
    try {
      let user = await User.findOne({ email: profile.email });

      if (!user) {
        // Create new user from OAuth profile
        user = new User({
          email: profile.email,
          username: profile.username || profile.email.split('@')[0],
          password: Math.random().toString(36).slice(-8), // Random password
          avatar: profile.avatar,
          socialProfiles: {
            [provider]: profile.id
          }
        });
        await user.save();
      }

      // Generate token
      const token = this.generateToken(user._id);

      return {
        token,
        user: user.getPublicProfile()
      };
    } catch (error) {
      throw new Error(`OAuth login failed: ${error.message}`);
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new Error(`Password change failed: ${error.message}`);
    }
  }

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      // Prevent updating sensitive fields
      delete updates.password;
      delete updates.email;
      delete updates.role;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user.getPublicProfile();
    } catch (error) {
      throw new Error(`Profile update failed: ${error.message}`);
    }
  }

  // Check if user has required role
  async checkRole(userId, requiredRole) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const roles = {
        user: 0,
        moderator: 1,
        admin: 2
      };

      return roles[user.role] >= roles[requiredRole];
    } catch (error) {
      throw new Error(`Role check failed: ${error.message}`);
    }
  }
}

module.exports = AuthService;
