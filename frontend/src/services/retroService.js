import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class RetroService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/retrospectives`,
    });

    this.api.interceptors.request.use((config) => {
      const user = authService.getCurrentUser();
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    });
  }

  async getCurrentRetro() {
    const response = await this.api.get('/current');
    return response.data;
  }

  async getAllRetros() {
    const response = await this.api.get('/');
    return response.data;
  }

  async getRetroById(retroId) {
    const response = await this.api.get(`/${retroId}`);
    return response.data;
  }

  async createRetro(retroData) {
    const response = await this.api.post('/', retroData);
    return response.data;
  }

  async updateRetro(retroId, retroData) {
    const response = await this.api.put(`/${retroId}`, retroData);
    return response.data;
  }

  async deleteRetro(retroId) {
    const response = await this.api.delete(`/${retroId}`);
    return response.data;
  }

  async addItem(retroId, item) {
    const response = await this.api.post(`/${retroId}/items`, item);
    return response.data;
  }

  async updateItem(retroId, itemId, itemData) {
    const response = await this.api.put(
      `/${retroId}/items/${itemId}`,
      itemData
    );
    return response.data;
  }

  async deleteItem(retroId, itemId) {
    const response = await this.api.delete(`/${retroId}/items/${itemId}`);
    return response.data;
  }

  async voteForItem(retroId, itemId) {
    const response = await this.api.post(`/${retroId}/items/${itemId}/vote`);
    return response.data;
  }

  async removeVoteFromItem(retroId, itemId) {
    const response = await this.api.delete(`/${retroId}/items/${itemId}/vote`);
    return response.data;
  }

  async addActionItem(retroId, actionItem) {
    const response = await this.api.post(`/${retroId}/action-items`, actionItem);
    return response.data;
  }

  async updateActionItem(retroId, actionItemId, actionItemData) {
    const response = await this.api.put(
      `/${retroId}/action-items/${actionItemId}`,
      actionItemData
    );
    return response.data;
  }

  async deleteActionItem(retroId, actionItemId) {
    const response = await this.api.delete(
      `/${retroId}/action-items/${actionItemId}`
    );
    return response.data;
  }

  async completeActionItem(retroId, actionItemId) {
    const response = await this.api.post(
      `/${retroId}/action-items/${actionItemId}/complete`
    );
    return response.data;
  }

  async getRetroSummary(retroId) {
    const response = await this.api.get(`/${retroId}/summary`);
    return response.data;
  }

  async exportRetro(retroId, format = 'pdf') {
    const response = await this.api.get(`/${retroId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new RetroService();
