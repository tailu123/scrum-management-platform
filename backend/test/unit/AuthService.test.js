const AuthService = require('../../services/AuthService');
const User = require('../../models/User');
const testConfig = require('../testConfig');

describe('AuthService', () => {
  let authService;

  beforeAll(async () => {
    await testConfig.startDB();
    authService = new AuthService();
  });

  afterAll(async () => {
    await testConfig.stopDB();
  });

  beforeEach(async () => {
    await testConfig.clearDB();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };

      const result = await authService.register(userData);

      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe(userData.username);
      expect(result.user.email).toBe(userData.email);
      expect(result.user.password).toBeUndefined();
    });

    it('should not register user with existing email', async () => {
      const userData = {
        username: 'user1',
        email: 'test@example.com',
        password: 'password123'
      };

      await authService.register(userData);

      await expect(authService.register({
        ...userData,
        username: 'user2'
      })).rejects.toThrow('User already exists');
    });

    it('should hash password before saving', async () => {
      const userData = {
        username: 'user1',
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await authService.register(userData);
      const savedUser = await User.findById(result.user._id);

      expect(savedUser.password).not.toBe(userData.password);
      expect(savedUser.password).toMatch(/^\$2[aby]\$\d+\$/);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await testConfig.createTestUser();
    });

    it('should login user with correct credentials', async () => {
      const result = await authService.login('test@example.com', 'password123');

      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.password).toBeUndefined();
    });

    it('should not login with incorrect password', async () => {
      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should not login non-existent user', async () => {
      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should update lastLogin timestamp', async () => {
      const before = new Date();
      await authService.login('test@example.com', 'password123');
      const user = await User.findOne({ email: 'test@example.com' });

      expect(user.lastLogin).toBeDefined();
      expect(user.lastLogin.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });
  });

  describe('verifyToken', () => {
    beforeEach(async () => {
      await testConfig.createTestUser();
    });

    it('should verify valid token', async () => {
      const user = await authService.verifyToken(testConfig.testToken);

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBeUndefined();
    });

    it('should reject invalid token', async () => {
      await expect(
        authService.verifyToken('invalid.token.here')
      ).rejects.toThrow('Token verification failed');
    });

    it('should reject expired token', async () => {
      const expiredToken = jwt.sign(
        { id: testConfig.testUser._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '0s' }
      );

      await expect(
        authService.verifyToken(expiredToken)
      ).rejects.toThrow('Token verification failed');
    });
  });

  describe('oauthLogin', () => {
    it('should create new user from OAuth profile', async () => {
      const profile = {
        email: 'oauth@example.com',
        username: 'oauthuser',
        id: '12345',
        avatar: 'https://example.com/avatar.jpg'
      };

      const result = await authService.oauthLogin(profile, 'github');

      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(profile.email);
      expect(result.user.username).toBe(profile.username);
      expect(result.user.socialProfiles.github).toBe(profile.id);
    });

    it('should link OAuth profile to existing user', async () => {
      await testConfig.createTestUser();

      const profile = {
        email: 'test@example.com',
        id: '12345',
        avatar: 'https://example.com/avatar.jpg'
      };

      const result = await authService.oauthLogin(profile, 'github');

      expect(result.user._id.toString()).toBe(testConfig.testUser._id.toString());
      expect(result.user.socialProfiles.github).toBe(profile.id);
    });
  });

  describe('changePassword', () => {
    beforeEach(async () => {
      await testConfig.createTestUser();
    });

    it('should change password with correct current password', async () => {
      const result = await authService.changePassword(
        testConfig.testUser._id,
        'password123',
        'newpassword123'
      );

      expect(result.message).toBe('Password updated successfully');

      // Verify new password works
      const loginResult = await authService.login('test@example.com', 'newpassword123');
      expect(loginResult.token).toBeDefined();
    });

    it('should not change password with incorrect current password', async () => {
      await expect(
        authService.changePassword(
          testConfig.testUser._id,
          'wrongpassword',
          'newpassword123'
        )
      ).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('updateProfile', () => {
    beforeEach(async () => {
      await testConfig.createTestUser();
    });

    it('should update user profile', async () => {
      const updates = {
        bio: 'New bio',
        avatar: 'https://example.com/new-avatar.jpg',
        preferences: {
          darkMode: true
        }
      };

      const result = await authService.updateProfile(testConfig.testUser._id, updates);

      expect(result.bio).toBe(updates.bio);
      expect(result.avatar).toBe(updates.avatar);
      expect(result.preferences.darkMode).toBe(true);
    });

    it('should not update sensitive fields', async () => {
      const updates = {
        email: 'newemail@example.com',
        password: 'newpassword',
        role: 'admin'
      };

      const result = await authService.updateProfile(testConfig.testUser._id, updates);

      expect(result.email).toBe('test@example.com');
      expect(result.role).toBe('user');
    });
  });
});
