import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class SprintService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/sprints`,
    });

    this.api.interceptors.request.use((config) => {
      const user = authService.getCurrentUser();
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    });
  }

  async getCurrentSprint() {
    const response = await this.api.get('/current');
    return response.data;
  }

  async getAllSprints() {
    const response = await this.api.get('/');
    return response.data;
  }

  async createSprint(sprintData) {
    const response = await this.api.post('/', sprintData);
    return response.data;
  }

  async updateSprint(sprintId, sprintData) {
    const response = await this.api.put(`/${sprintId}`, sprintData);
    return response.data;
  }

  async deleteSprint(sprintId) {
    const response = await this.api.delete(`/${sprintId}`);
    return response.data;
  }

  async startSprint(sprintId) {
    const response = await this.api.post(`/${sprintId}/start`);
    return response.data;
  }

  async endSprint(sprintId, retrospectiveData) {
    const response = await this.api.post(`/${sprintId}/end`, retrospectiveData);
    return response.data;
  }

  async getSprintTasks(sprintId) {
    const response = await this.api.get(`/${sprintId}/tasks`);
    return response.data;
  }

  async addTaskToSprint(sprintId, taskId) {
    const response = await this.api.post(`/${sprintId}/tasks/${taskId}`);
    return response.data;
  }

  async removeTaskFromSprint(sprintId, taskId) {
    const response = await this.api.delete(`/${sprintId}/tasks/${taskId}`);
    return response.data;
  }

  async getSprintMetrics(sprintId) {
    const response = await this.api.get(`/${sprintId}/metrics`);
    return response.data;
  }

  async getSprintBurndown(sprintId) {
    const response = await this.api.get(`/${sprintId}/burndown`);
    return response.data;
  }

  async getSprintVelocity() {
    const response = await this.api.get('/velocity');
    return response.data;
  }
}

export default new SprintService();
