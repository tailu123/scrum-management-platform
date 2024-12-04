import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ForumService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/forum`,
    });

    this.api.interceptors.request.use((config) => {
      const user = authService.getCurrentUser();
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    });
  }

  async getAllDiscussions(page = 1, limit = 10) {
    const response = await this.api.get('/', {
      params: { page, limit },
    });
    return response.data;
  }

  async getDiscussionById(discussionId) {
    const response = await this.api.get(`/${discussionId}`);
    return response.data;
  }

  async createDiscussion(discussionData) {
    const response = await this.api.post('/', discussionData);
    return response.data;
  }

  async updateDiscussion(discussionId, discussionData) {
    const response = await this.api.put(`/${discussionId}`, discussionData);
    return response.data;
  }

  async deleteDiscussion(discussionId) {
    const response = await this.api.delete(`/${discussionId}`);
    return response.data;
  }

  async addComment(discussionId, comment) {
    const response = await this.api.post(`/${discussionId}/comments`, {
      content: comment,
    });
    return response.data;
  }

  async updateComment(discussionId, commentId, content) {
    const response = await this.api.put(
      `/${discussionId}/comments/${commentId}`,
      { content }
    );
    return response.data;
  }

  async deleteComment(discussionId, commentId) {
    const response = await this.api.delete(
      `/${discussionId}/comments/${commentId}`
    );
    return response.data;
  }

  async likeDiscussion(discussionId) {
    const response = await this.api.post(`/${discussionId}/like`);
    return response.data;
  }

  async unlikeDiscussion(discussionId) {
    const response = await this.api.delete(`/${discussionId}/like`);
    return response.data;
  }

  async searchDiscussions(query) {
    const response = await this.api.get('/search', {
      params: { q: query },
    });
    return response.data;
  }

  async getMyDiscussions() {
    const response = await this.api.get('/my-discussions');
    return response.data;
  }

  async pinDiscussion(discussionId) {
    const response = await this.api.post(`/${discussionId}/pin`);
    return response.data;
  }

  async unpinDiscussion(discussionId) {
    const response = await this.api.delete(`/${discussionId}/pin`);
    return response.data;
  }
}

export default new ForumService();
