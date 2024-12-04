const mongoose = require('mongoose');

// Document Schema
const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['retro', 'sprint', 'note'],
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['editor', 'viewer'],
      default: 'editor'
    }
  }],
  version: {
    type: Number,
    default: 1
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Document = mongoose.model('Document', documentSchema);

class CollaborativeService {
  constructor(webSocketService) {
    this.webSocketService = webSocketService;
    this.activeDocuments = new Map(); // Store document versions and operations
  }

  // Create new document
  async createDocument(title, type, ownerId, initialContent = '') {
    try {
      const document = new Document({
        title,
        type,
        ownerId,
        content: initialContent
      });
      await document.save();

      // Initialize document in memory
      this.activeDocuments.set(document._id.toString(), {
        version: 1,
        operations: [],
        content: initialContent
      });

      return document;
    } catch (error) {
      throw new Error(`Failed to create document: ${error.message}`);
    }
  }

  // Get document
  async getDocument(documentId, userId) {
    try {
      const document = await Document.findById(documentId)
        .populate('ownerId', 'username')
        .populate('collaborators.userId', 'username');

      if (!document) {
        throw new Error('Document not found');
      }

      // Check access rights
      if (!this.hasAccess(document, userId)) {
        throw new Error('Unauthorized access');
      }

      return document;
    } catch (error) {
      throw new Error(`Failed to get document: ${error.message}`);
    }
  }

  // Apply operation to document
  async applyOperation(documentId, userId, operation) {
    try {
      const document = await Document.findById(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      // Check edit rights
      if (!this.canEdit(document, userId)) {
        throw new Error('Unauthorized to edit');
      }

      // Get active document state
      let activeDoc = this.activeDocuments.get(documentId);
      if (!activeDoc) {
        activeDoc = {
          version: document.version,
          operations: [],
          content: document.content
        };
        this.activeDocuments.set(documentId, activeDoc);
      }

      // Apply operation
      const newContent = this.transformContent(activeDoc.content, operation);
      activeDoc.content = newContent;
      activeDoc.version += 1;
      activeDoc.operations.push({
        ...operation,
        version: activeDoc.version,
        userId
      });

      // Update document in database periodically
      if (activeDoc.operations.length >= 10) {
        await this.saveDocument(documentId);
      }

      // Broadcast operation to other users
      this.webSocketService.broadcastToRoom(
        `doc:${documentId}`,
        'operation',
        {
          operation,
          version: activeDoc.version,
          userId
        }
      );

      return {
        version: activeDoc.version,
        content: newContent
      };
    } catch (error) {
      throw new Error(`Failed to apply operation: ${error.message}`);
    }
  }

  // Transform content based on operation
  transformContent(content, operation) {
    const { type, position, value } = operation;

    switch (type) {
      case 'insert':
        return content.slice(0, position) + value + content.slice(position);
      case 'delete':
        return content.slice(0, position) + content.slice(position + value.length);
      case 'replace':
        return content.slice(0, position.start) + value + content.slice(position.end);
      default:
        throw new Error('Invalid operation type');
    }
  }

  // Save document to database
  async saveDocument(documentId) {
    try {
      const activeDoc = this.activeDocuments.get(documentId);
      if (!activeDoc) return;

      await Document.findByIdAndUpdate(documentId, {
        content: activeDoc.content,
        version: activeDoc.version,
        lastModified: new Date()
      });

      // Clear operations after save
      activeDoc.operations = [];
    } catch (error) {
      throw new Error(`Failed to save document: ${error.message}`);
    }
  }

  // Add collaborator to document
  async addCollaborator(documentId, ownerId, collaboratorId, role = 'editor') {
    try {
      const document = await Document.findOne({
        _id: documentId,
        ownerId
      });

      if (!document) {
        throw new Error('Document not found or unauthorized');
      }

      // Check if already a collaborator
      const existingCollaborator = document.collaborators
        .find(c => c.userId.toString() === collaboratorId);

      if (existingCollaborator) {
        existingCollaborator.role = role;
      } else {
        document.collaborators.push({
          userId: collaboratorId,
          role
        });
      }

      await document.save();

      // Notify through WebSocket
      this.webSocketService.broadcastToRoom(
        `doc:${documentId}`,
        'collaborator-added',
        { collaboratorId, role }
      );

      return document;
    } catch (error) {
      throw new Error(`Failed to add collaborator: ${error.message}`);
    }
  }

  // Remove collaborator from document
  async removeCollaborator(documentId, ownerId, collaboratorId) {
    try {
      const document = await Document.findOne({
        _id: documentId,
        ownerId
      });

      if (!document) {
        throw new Error('Document not found or unauthorized');
      }

      document.collaborators = document.collaborators
        .filter(c => c.userId.toString() !== collaboratorId);

      await document.save();

      // Notify through WebSocket
      this.webSocketService.broadcastToRoom(
        `doc:${documentId}`,
        'collaborator-removed',
        { collaboratorId }
      );

      return document;
    } catch (error) {
      throw new Error(`Failed to remove collaborator: ${error.message}`);
    }
  }

  // Check if user has access to document
  hasAccess(document, userId) {
    const userIdStr = userId.toString();
    return (
      document.ownerId.toString() === userIdStr ||
      document.collaborators.some(c => c.userId.toString() === userIdStr)
    );
  }

  // Check if user can edit document
  canEdit(document, userId) {
    const userIdStr = userId.toString();
    return (
      document.ownerId.toString() === userIdStr ||
      document.collaborators.some(
        c => c.userId.toString() === userIdStr && c.role === 'editor'
      )
    );
  }

  // Get active users in document
  getActiveUsers(documentId) {
    return this.webSocketService.getActiveUsers(`doc:${documentId}`);
  }
}

module.exports = {
  CollaborativeService,
  Document
};
