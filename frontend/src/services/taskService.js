import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class TaskService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/tasks`,
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const user = authService.getCurrentUser();
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    });
  }

  async getAllTasks() {
    const response = await this.api.get('/');
    return response.data;
  }

  async getTaskById(taskId) {
    const response = await this.api.get(`/${taskId}`);
    return response.data;
  }

  async createTask(taskData) {
    const response = await this.api.post('/', taskData);
    return response.data;
  }

  async updateTask(taskId, taskData) {
    const response = await this.api.put(`/${taskId}`, taskData);
    return response.data;
  }

  async deleteTask(taskId) {
    const response = await this.api.delete(`/${taskId}`);
    return response.data;
  }

  async updateTaskStatus(taskId, status) {
    const response = await this.api.patch(`/${taskId}/status`, { status });
    return response.data;
  }

  async assignTask(taskId, userId) {
    const response = await this.api.post(`/${taskId}/assign`, { userId });
    return response.data;
  }

  async addComment(taskId, comment) {
    const response = await this.api.post(`/${taskId}/comments`, { content: comment });
    return response.data;
  }

  async getTaskComments(taskId) {
    const response = await this.api.get(`/${taskId}/comments`);
    return response.data;
  }

  async addAttachment(taskId, file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.api.post(`/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getTasksByStatus(status) {
    const response = await this.api.get(`/status/${status}`);
    return response.data;
  }

  async getTasksByAssignee(userId) {
    const response = await this.api.get(`/assignee/${userId}`);
    return response.data;
  }
}

export default new TaskService();
