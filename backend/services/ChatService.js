const mongoose = require('mongoose');

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  metadata: {
    fileName: String,
    fileSize: Number,
    mimeType: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

class ChatService {
  constructor(webSocketService) {
    this.webSocketService = webSocketService;
  }

  // Send message to room
  async sendMessage(roomId, userId, content, type = 'text', metadata = {}) {
    try {
      // Create and save message
      const message = new ChatMessage({
        roomId,
        userId,
        content,
        type,
        metadata
      });
      await message.save();

      // Broadcast message through WebSocket
      this.webSocketService.broadcastToRoom(roomId, 'new-message', {
        messageId: message._id,
        userId,
        content,
        type,
        metadata,
        createdAt: message.createdAt
      });

      return message;
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  // Get messages for room
  async getMessages(roomId, { page = 1, limit = 50 } = {}) {
    try {
      const skip = (page - 1) * limit;

      const [messages, total] = await Promise.all([
        ChatMessage.find({ roomId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('userId', 'username avatar')
          .lean(),
        ChatMessage.countDocuments({ roomId })
      ]);

      return {
        messages: messages.reverse(),
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get messages: ${error.message}`);
    }
  }

  // Delete message
  async deleteMessage(messageId, userId) {
    try {
      const message = await ChatMessage.findOne({
        _id: messageId,
        userId
      });

      if (!message) {
        throw new Error('Message not found or unauthorized');
      }

      await message.remove();

      // Notify room about message deletion
      this.webSocketService.broadcastToRoom(message.roomId, 'message-deleted', {
        messageId
      });

      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  // Edit message
  async editMessage(messageId, userId, newContent) {
    try {
      const message = await ChatMessage.findOne({
        _id: messageId,
        userId,
        type: 'text' // Only text messages can be edited
      });

      if (!message) {
        throw new Error('Message not found or unauthorized');
      }

      message.content = newContent;
      await message.save();

      // Notify room about message update
      this.webSocketService.broadcastToRoom(message.roomId, 'message-updated', {
        messageId,
        content: newContent
      });

      return message;
    } catch (error) {
      throw new Error(`Failed to edit message: ${error.message}`);
    }
  }

  // Search messages
  async searchMessages(roomId, query, { page = 1, limit = 20 } = {}) {
    try {
      const skip = (page - 1) * limit;

      const [messages, total] = await Promise.all([
        ChatMessage.find({
          roomId,
          content: { $regex: query, $options: 'i' }
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('userId', 'username avatar')
          .lean(),
        ChatMessage.countDocuments({
          roomId,
          content: { $regex: query, $options: 'i' }
        })
      ]);

      return {
        messages,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to search messages: ${error.message}`);
    }
  }

  // Get active users in room
  getActiveUsers(roomId) {
    return this.webSocketService.getActiveUsers(roomId);
  }
}

module.exports = {
  ChatService,
  ChatMessage
};
