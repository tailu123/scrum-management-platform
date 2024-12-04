const WebSocketService = require('../../services/WebSocketService');
const testConfig = require('../testConfig');

describe('WebSocketService', () => {
  let webSocketService;
  let mockServer;
  let mockSocket;

  beforeAll(async () => {
    await testConfig.startDB();
    await testConfig.createTestUser();
  });

  afterAll(async () => {
    await testConfig.stopDB();
  });

  beforeEach(() => {
    mockServer = {
      on: jest.fn(),
      emit: jest.fn()
    };
    webSocketService = new WebSocketService(mockServer);
    mockSocket = testConfig.createMockSocket();
  });

  describe('authentication', () => {
    it('should authenticate socket connection with valid token', async () => {
      const next = jest.fn();
      await webSocketService.io.use.mock.calls[0][0](
        {
          handshake: { auth: { token: testConfig.testToken } },
          user: null
        },
        next
      );

      expect(next).toHaveBeenCalledWith();
    });

    it('should reject socket connection with invalid token', async () => {
      const next = jest.fn();
      await webSocketService.io.use.mock.calls[0][0](
        {
          handshake: { auth: { token: 'invalid.token.here' } },
          user: null
        },
        next
      );

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('handleConnection', () => {
    it('should store connection and join user room', () => {
      webSocketService.handleConnection(mockSocket);

      expect(webSocketService.connections.get(mockSocket.user._id.toString()))
        .toBe(mockSocket);
      expect(mockSocket.join)
        .toHaveBeenCalledWith(`user:${mockSocket.user._id}`);
    });

    it('should handle join-retro event', () => {
      webSocketService.handleConnection(mockSocket);
      
      const retroId = 'retro123';
      mockSocket.emit('join-retro', retroId);

      expect(mockSocket.join).toHaveBeenCalledWith(`retro:${retroId}`);
    });

    it('should handle join-sprint event', () => {
      webSocketService.handleConnection(mockSocket);
      
      const sprintId = 'sprint123';
      mockSocket.emit('join-sprint', sprintId);

      expect(mockSocket.join).toHaveBeenCalledWith(`sprint:${sprintId}`);
    });
  });

  describe('handleChatMessage', () => {
    it('should broadcast chat message to room', () => {
      const roomId = 'room123';
      const message = 'Hello, world!';

      webSocketService.handleChatMessage(mockSocket, { roomId, message });

      expect(webSocketService.io.to).toHaveBeenCalledWith(roomId);
      expect(webSocketService.io.emit).toHaveBeenCalledWith('chat-message', {
        userId: mockSocket.user._id,
        username: mockSocket.user.username,
        message,
        timestamp: expect.any(Date)
      });
    });
  });

  describe('handleContentEdit', () => {
    it('should broadcast content updates to room', () => {
      const roomId = 'doc123';
      const content = 'Updated content';
      const position = { start: 0, end: 5 };

      webSocketService.handleContentEdit(mockSocket, {
        roomId,
        content,
        position
      });

      expect(mockSocket.to).toHaveBeenCalledWith(roomId);
      expect(mockSocket.emit).toHaveBeenCalledWith('content-update', {
        userId: mockSocket.user._id,
        username: mockSocket.user.username,
        content,
        position,
        timestamp: expect.any(Date)
      });
    });
  });

  describe('handleDisconnection', () => {
    it('should remove connection and notify rooms', () => {
      const roomId = 'retro123';
      mockSocket.rooms.add(`retro:${roomId}`);
      
      webSocketService.handleConnection(mockSocket);
      webSocketService.handleDisconnection(mockSocket);

      expect(webSocketService.connections.has(mockSocket.user._id.toString()))
        .toBe(false);
      expect(webSocketService.io.to)
        .toHaveBeenCalledWith(`retro:${roomId}`);
    });
  });

  describe('notifyRoomUpdate', () => {
    it('should send room update to all users in room', () => {
      const type = 'retro';
      const roomId = 'retro123';
      const mockRoom = new Set(['socket1', 'socket2']);

      webSocketService.io.sockets.adapter.rooms.set(`${type}:${roomId}`, mockRoom);
      webSocketService.notifyRoomUpdate(type, roomId);

      expect(webSocketService.io.to).toHaveBeenCalledWith(`${type}:${roomId}`);
      expect(webSocketService.io.emit).toHaveBeenCalledWith('room-update', {
        type,
        roomId,
        userCount: 2,
        timestamp: expect.any(Date)
      });
    });
  });

  describe('sendUserNotification', () => {
    it('should send notification to specific user', () => {
      const userId = testConfig.testUser._id;
      const notification = {
        type: 'mention',
        message: 'You were mentioned'
      };

      webSocketService.sendUserNotification(userId, notification);

      expect(webSocketService.io.to).toHaveBeenCalledWith(`user:${userId}`);
      expect(webSocketService.io.emit).toHaveBeenCalledWith('notification', {
        ...notification,
        timestamp: expect.any(Date)
      });
    });
  });

  describe('broadcastToRoom', () => {
    it('should broadcast event to all users in room', () => {
      const roomId = 'room123';
      const eventName = 'custom-event';
      const data = { key: 'value' };

      webSocketService.broadcastToRoom(roomId, eventName, data);

      expect(webSocketService.io.to).toHaveBeenCalledWith(roomId);
      expect(webSocketService.io.emit).toHaveBeenCalledWith(eventName, {
        ...data,
        timestamp: expect.any(Date)
      });
    });
  });

  describe('getActiveUsers', () => {
    it('should return list of active users in room', () => {
      const roomId = 'room123';
      const mockRoom = new Set(['socket1', 'socket2']);
      const mockSockets = new Map([
        ['socket1', { user: { _id: 'user1', username: 'User 1' } }],
        ['socket2', { user: { _id: 'user2', username: 'User 2' } }]
      ]);

      webSocketService.io.sockets.adapter.rooms.set(roomId, mockRoom);
      webSocketService.io.sockets.sockets = mockSockets;

      const activeUsers = webSocketService.getActiveUsers(roomId);

      expect(activeUsers).toHaveLength(2);
      expect(activeUsers[0]).toEqual({
        userId: 'user1',
        username: 'User 1'
      });
      expect(activeUsers[1]).toEqual({
        userId: 'user2',
        username: 'User 2'
      });
    });

    it('should return empty array for non-existent room', () => {
      const activeUsers = webSocketService.getActiveUsers('nonexistent');
      expect(activeUsers).toEqual([]);
    });
  });
});
