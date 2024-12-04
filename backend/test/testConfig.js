const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

class TestConfig {
  constructor() {
    this.mongoServer = null;
    this.testUser = null;
    this.testToken = null;
  }

  // Start MongoDB Memory Server
  async startDB() {
    this.mongoServer = await MongoMemoryServer.create();
    const mongoUri = this.mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }

  // Stop MongoDB Memory Server
  async stopDB() {
    await mongoose.disconnect();
    await this.mongoServer.stop();
  }

  // Clear all collections
  async clearDB() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  }

  // Create test user
  async createTestUser() {
    const User = mongoose.model('User');
    this.testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    this.testToken = jwt.sign(
      { id: this.testUser._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    return this.testUser;
  }

  // Get test headers
  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.testToken}`
    };
  }

  // Create test document
  async createTestDocument(type = 'retro') {
    const Document = mongoose.model('Document');
    return Document.create({
      title: 'Test Document',
      type,
      ownerId: this.testUser._id,
      content: 'Initial content'
    });
  }

  // Create test chat room
  async createTestChatRoom() {
    const ChatMessage = mongoose.model('ChatMessage');
    const roomId = 'test-room';
    await ChatMessage.create({
      roomId,
      userId: this.testUser._id,
      content: 'Test message'
    });
    return roomId;
  }

  // Mock WebSocket connection
  createMockSocket() {
    return {
      user: this.testUser,
      rooms: new Set(),
      join: function(room) { this.rooms.add(room); },
      leave: function(room) { this.rooms.delete(room); },
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
      broadcast: jest.fn().mockReturnThis()
    };
  }

  // Mock WebSocket service
  createMockWebSocketService() {
    return {
      io: {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn()
      },
      connections: new Map(),
      broadcastToRoom: jest.fn(),
      sendUserNotification: jest.fn(),
      getActiveUsers: jest.fn().mockReturnValue([])
    };
  }
}

module.exports = new TestConfig();
