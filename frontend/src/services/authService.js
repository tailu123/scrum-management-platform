import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthService {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  async register(userData) {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  async updateProfile(userData) {
    const user = this.getCurrentUser();
    const response = await axios.put(
      `${API_URL}/users/profile`,
      userData,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    return response.data;
  }

  async changePassword(currentPassword, newPassword) {
    const user = this.getCurrentUser();
    const response = await axios.put(
      `${API_URL}/users/password`,
      { currentPassword, newPassword },
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    return response.data;
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  }
}

export default new AuthService();
