import { useCallback } from 'react';

export const useTaskService = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const getAllTasks = useCallback(async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_URL}/tasks?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }, [API_URL]);

  const createTask = useCallback(async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }, [API_URL]);

  const updateTaskStatus = useCallback(async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update task status');
      return await response.json();
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }, [API_URL]);

  const deleteTask = useCallback(async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }, [API_URL]);

  return {
    getAllTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
  };
};
