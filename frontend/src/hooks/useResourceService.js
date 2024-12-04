import { useCallback } from 'react';

export const useResourceService = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const getAllResources = useCallback(async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_URL}/resources?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch resources');
      return await response.json();
    } catch (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
  }, [API_URL]);

  const getResourceById = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_URL}/resources/${id}`);
      if (!response.ok) throw new Error('Failed to fetch resource');
      return await response.json();
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }
  }, [API_URL]);

  const getResourcesByCategory = useCallback(async (category) => {
    try {
      const response = await fetch(`${API_URL}/resources/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch resources by category');
      return await response.json();
    } catch (error) {
      console.error('Error fetching resources by category:', error);
      return [];
    }
  }, [API_URL]);

  const searchResourcesByTags = useCallback(async (tags) => {
    try {
      const queryParams = new URLSearchParams({ tags: tags.join(',') }).toString();
      const response = await fetch(`${API_URL}/resources/search/tags?${queryParams}`);
      if (!response.ok) throw new Error('Failed to search resources by tags');
      return await response.json();
    } catch (error) {
      console.error('Error searching resources by tags:', error);
      return [];
    }
  }, [API_URL]);

  return {
    getAllResources,
    getResourceById,
    getResourcesByCategory,
    searchResourcesByTags,
  };
};
