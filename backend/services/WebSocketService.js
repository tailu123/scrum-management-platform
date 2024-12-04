const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class WebSocketService {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    // Store active connections
    this.connections = new Map();
    
    // Initialize socket handlers
    this.initialize();
  }

  // Initialize WebSocket server
  initialize() {
    // Authenticate socket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Authentication required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.id);
        
        if (!user) {
          throw new Error('User not found');
        }

        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });

    // Handle connections
    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
    });
  }

  // Handle new socket connection
  handleConnection(socket) {
    const userId = socket.user._id.toString();
    this.connections.set(userId, socket);

    // Join user-specific room
    socket.join(`user:${userId}`);

    // Handle retrospective room
    socket.on('join-retro', (retroId) => {
      socket.join(`retro:${retroId}`);
      this.notifyRoomUpdate('retro', retroId);
    });

    // Handle sprint room
    socket.on('join-sprint', (sprintId) => {
      socket.join(`sprint:${sprintId}`);
      this.notifyRoomUpdate('sprint', sprintId);
    });

    // Handle chat messages
    socket.on('chat-message', (data) => {
      this.handleChatMessage(socket, data);
    });

    // Handle collaborative editing
    socket.on('edit-content', (data) => {
      this.handleContentEdit(socket, data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      this.handleDisconnection(socket);
    });
  }

  // Handle chat messages
  handleChatMessage(socket, { roomId, message }) {
    const messageData = {
      userId: socket.user._id,
      username: socket.user.username,
      message,
      timestamp: new Date()
    };

    this.io.to(roomId).emit('chat-message', messageData);
  }

  // Handle collaborative editing
  handleContentEdit(socket, { roomId, content, position }) {
    socket.to(roomId).emit('content-update', {
      userId: socket.user._id,
      username: socket.user.username,
      content,
      position,
      timestamp: new Date()
    });
  }

  // Handle disconnection
  handleDisconnection(socket) {
    const userId = socket.user._id.toString();
    this.connections.delete(userId);

    // Notify relevant rooms about user disconnection
    socket.rooms.forEach((room) => {
      if (room.startsWith('retro:') || room.startsWith('sprint:')) {
        this.notifyRoomUpdate(room.split(':')[0], room.split(':')[1]);
      }
    });
  }

  // Notify room about updates
  notifyRoomUpdate(type, roomId) {
    const room = this.io.sockets.adapter.rooms.get(`${type}:${roomId}`);
    if (room) {
      const userCount = room.size;
      this.io.to(`${type}:${roomId}`).emit('room-update', {
        type,
        roomId,
        userCount,
        timestamp: new Date()
      });
    }
  }

  // Send notification to specific user
  sendUserNotification(userId, notification) {
    this.io.to(`user:${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date()
    });
  }

  // Broadcast to room
  broadcastToRoom(roomId, eventName, data) {
    this.io.to(roomId).emit(eventName, {
      ...data,
      timestamp: new Date()
    });
  }

  // Get active users in room
  getActiveUsers(roomId) {
    const room = this.io.sockets.adapter.rooms.get(roomId);
    if (!room) return [];

    return Array.from(room).map(socketId => {
      const socket = this.io.sockets.sockets.get(socketId);
      return {
        userId: socket.user._id,
        username: socket.user.username
      };
    });
  }
}

module.exports = WebSocketService;
