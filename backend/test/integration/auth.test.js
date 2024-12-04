const request = require('supertest');
const app = require('../../app');
const testConfig = require('../testConfig');

describe('Authentication API', () => {
  beforeAll(async () => {
    await testConfig.startDB();
  });

  afterAll(async () => {
    await testConfig.stopDB();
  });

  beforeEach(async () => {
    await testConfig.clearDB();
  });

  describe('POST /api/auth/register', () => {
    it('should register new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.password).toBeUndefined();
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'u', // too short
          email: 'invalid-email',
          password: '123' // too short
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBeDefined();
    });

    it('should return 400 for duplicate email', async () => {
      await testConfig.createTestUser();

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/already exists/i);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await testConfig.createTestUser();
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should return 401 for incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });

    it('should return 401 for non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });
  });

  describe('GET /api/auth/me', () => {
    beforeEach(async () => {
      await testConfig.createTestUser();
    });

    it('should return user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set(testConfig.getAuthHeaders());

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe('test@example.com');
      expect(res.body.password).toBeUndefined();
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/authentication required/i);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/authentication failed/i);
    });
  });

  describe('PUT /api/auth/profile', () => {
    beforeEach(async () => {
      await testConfig.createTestUser();
    });

    it('should update user profile', async () => {
      const updates = {
        bio: 'New bio',
        avatar: 'https://example.com/avatar.jpg',
        preferences: {
          darkMode: true
        }
      };

      const res = await request(app)
        .put('/api/auth/profile')
        .set(testConfig.getAuthHeaders())
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.bio).toBe(updates.bio);
      expect(res.body.avatar).toBe(updates.avatar);
      expect(res.body.preferences.darkMode).toBe(true);
    });

    it('should not update sensitive fields', async () => {
      const updates = {
        email: 'newemail@example.com',
        password: 'newpassword',
        role: 'admin'
      };

      const res = await request(app)
        .put('/api/auth/profile')
        .set(testConfig.getAuthHeaders())
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe('test@example.com');
      expect(res.body.role).toBe('user');
    });
  });

  describe('PUT /api/auth/change-password', () => {
    beforeEach(async () => {
      await testConfig.createTestUser();
    });

    it('should change password with correct credentials', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set(testConfig.getAuthHeaders())
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/password updated/i);

      // Verify can login with new password
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'newpassword123'
        });

      expect(loginRes.statusCode).toBe(200);
    });

    it('should return 400 for incorrect current password', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set(testConfig.getAuthHeaders())
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/incorrect/i);
    });
  });

  describe('POST /api/auth/oauth/:provider', () => {
    it('should create new user from OAuth profile', async () => {
      const res = await request(app)
        .post('/api/auth/oauth/github')
        .send({
          profile: {
            email: 'oauth@example.com',
            username: 'oauthuser',
            id: '12345',
            avatar: 'https://example.com/avatar.jpg'
          }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('oauth@example.com');
      expect(res.body.user.socialProfiles.github).toBe('12345');
    });

    it('should link OAuth profile to existing user', async () => {
      await testConfig.createTestUser();

      const res = await request(app)
        .post('/api/auth/oauth/github')
        .send({
          profile: {
            email: 'test@example.com',
            id: '12345',
            avatar: 'https://example.com/avatar.jpg'
          }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.user._id).toBe(testConfig.testUser._id.toString());
      expect(res.body.user.socialProfiles.github).toBe('12345');
    });
  });
});
