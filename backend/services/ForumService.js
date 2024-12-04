const { Category, Thread, Reply } = require('../models/Forum');

class ForumService {
  // Category Methods
  async getCategories() {
    try {
      return await Category.find().sort({ order: 1 });
    } catch (error) {
      throw new Error('Error fetching categories: ' + error.message);
    }
  }

  async getCategoryById(categoryId) {
    try {
      return await Category.findById(categoryId);
    } catch (error) {
      throw new Error('Error fetching category: ' + error.message);
    }
  }

  async createCategory(categoryData) {
    try {
      const category = new Category(categoryData);
      return await category.save();
    } catch (error) {
      throw new Error('Error creating category: ' + error.message);
    }
  }

  // Thread Methods
  async createThread(threadData) {
    try {
      const thread = new Thread(threadData);
      return await thread.save();
    } catch (error) {
      throw new Error('Error creating thread: ' + error.message);
    }
  }

  async getThreadById(threadId) {
    try {
      const thread = await Thread.findById(threadId)
        .populate('author', 'username')
        .populate('categoryId');
      
      if (thread) {
        // Increment views
        await Thread.findByIdAndUpdate(threadId, { $inc: { views: 1 } });
      }
      
      return thread;
    } catch (error) {
      throw new Error('Error fetching thread: ' + error.message);
    }
  }

  async getThreadsByCategory(categoryId, { page = 1, limit = 20, sort = 'newest' }) {
    try {
      const sortOptions = {
        newest: { createdAt: -1 },
        mostViewed: { views: -1 },
        mostReplies: { replyCount: -1 },
        lastReplied: { lastReplyAt: -1 }
      };

      const query = { categoryId };
      const skip = (page - 1) * limit;
      
      const [threads, total] = await Promise.all([
        Thread.find(query)
          .sort(sortOptions[sort])
          .skip(skip)
          .limit(limit)
          .populate('author', 'username'),
        Thread.countDocuments(query)
      ]);

      return {
        threads,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error('Error fetching threads: ' + error.message);
    }
  }

  async updateThread(threadId, updates) {
    try {
      return await Thread.findByIdAndUpdate(
        threadId,
        { $set: updates },
        { new: true }
      );
    } catch (error) {
      throw new Error('Error updating thread: ' + error.message);
    }
  }

  async deleteThread(threadId) {
    try {
      const [thread] = await Promise.all([
        Thread.findByIdAndDelete(threadId),
        Reply.deleteMany({ threadId })
      ]);
      return thread != null;
    } catch (error) {
      throw new Error('Error deleting thread: ' + error.message);
    }
  }

  // Reply Methods
  async createReply(replyData) {
    try {
      const reply = new Reply(replyData);
      await reply.save();
      
      // Update thread's reply count
      await Thread.findByIdAndUpdate(
        replyData.threadId,
        {
          $inc: { replyCount: 1 },
          lastReplyAt: Date.now()
        }
      );
      
      return reply;
    } catch (error) {
      throw new Error('Error creating reply: ' + error.message);
    }
  }

  async getRepliesByThread(threadId, { page = 1, limit = 20 }) {
    try {
      const skip = (page - 1) * limit;
      
      const [replies, total] = await Promise.all([
        Reply.find({ threadId })
          .sort({ createdAt: 1 })
          .skip(skip)
          .limit(limit)
          .populate('author', 'username'),
        Reply.countDocuments({ threadId })
      ]);

      return {
        replies,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error('Error fetching replies: ' + error.message);
    }
  }

  async updateReply(replyId, updates) {
    try {
      return await Reply.findByIdAndUpdate(
        replyId,
        { $set: updates },
        { new: true }
      );
    } catch (error) {
      throw new Error('Error updating reply: ' + error.message);
    }
  }

  async deleteReply(replyId) {
    try {
      const reply = await Reply.findById(replyId);
      if (!reply) return false;

      await Promise.all([
        Reply.findByIdAndDelete(replyId),
        Thread.findByIdAndUpdate(
          reply.threadId,
          { $inc: { replyCount: -1 } }
        )
      ]);

      return true;
    } catch (error) {
      throw new Error('Error deleting reply: ' + error.message);
    }
  }

  // Search Methods
  async searchThreads(searchQuery, { page = 1, limit = 20 }) {
    try {
      const skip = (page - 1) * limit;
      
      const [threads, total] = await Promise.all([
        Thread.find(
          { $text: { $search: searchQuery } },
          { score: { $meta: 'textScore' } }
        )
          .sort({ score: { $meta: 'textScore' } })
          .skip(skip)
          .limit(limit)
          .populate('author', 'username')
          .populate('categoryId'),
        Thread.countDocuments({ $text: { $search: searchQuery } })
      ]);

      return {
        threads,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error('Error searching threads: ' + error.message);
    }
  }
}

module.exports = ForumService;
