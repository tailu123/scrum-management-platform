import { useCallback } from 'react';

// Custom hook following SRP - handles sprint-related API calls
export const useSprintService = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const getAllSprints = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/sprints`);
      if (!response.ok) throw new Error('Failed to fetch sprints');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sprints:', error);
      return [];
    }
  }, [API_URL]);

  const createSprint = useCallback(async (sprintData) => {
    try {
      const response = await fetch(`${API_URL}/sprints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sprintData),
      });
      if (!response.ok) throw new Error('Failed to create sprint');
      return await response.json();
    } catch (error) {
      console.error('Error creating sprint:', error);
      throw error;
    }
  }, [API_URL]);

  // Return the service methods
  return {
    getAllSprints,
    createSprint,
  };
};
