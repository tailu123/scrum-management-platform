import { useCallback } from 'react';

export const useRetroService = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const createRetro = useCallback(async (retroData) => {
    try {
      const response = await fetch(`${API_URL}/retros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(retroData),
      });
      if (!response.ok) throw new Error('Failed to create retrospective');
      return await response.json();
    } catch (error) {
      console.error('Error creating retrospective:', error);
      throw error;
    }
  }, [API_URL]);

  const getRetroById = useCallback(async (retroId) => {
    try {
      const response = await fetch(`${API_URL}/retros/${retroId}`);
      if (!response.ok) throw new Error('Failed to fetch retrospective');
      return await response.json();
    } catch (error) {
      console.error('Error fetching retrospective:', error);
      throw error;
    }
  }, [API_URL]);

  const getRetroItems = useCallback(async (retroId) => {
    try {
      const response = await fetch(`${API_URL}/retros/${retroId}/items`);
      if (!response.ok) throw new Error('Failed to fetch retro items');
      return await response.json();
    } catch (error) {
      console.error('Error fetching retro items:', error);
      return [];
    }
  }, [API_URL]);

  const addRetroItem = useCallback(async (retroId, itemData) => {
    try {
      const response = await fetch(`${API_URL}/retros/${retroId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) throw new Error('Failed to add retro item');
      return await response.json();
    } catch (error) {
      console.error('Error adding retro item:', error);
      throw error;
    }
  }, [API_URL]);

  const updateRetroItem = useCallback(async (itemId, updateData) => {
    try {
      const response = await fetch(`${API_URL}/retros/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error('Failed to update retro item');
      return await response.json();
    } catch (error) {
      console.error('Error updating retro item:', error);
      throw error;
    }
  }, [API_URL]);

  const addVoteToItem = useCallback(async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/retros/items/${itemId}/vote`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to add vote');
      return await response.json();
    } catch (error) {
      console.error('Error adding vote:', error);
      throw error;
    }
  }, [API_URL]);

  const removeVoteFromItem = useCallback(async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/retros/items/${itemId}/vote`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove vote');
      return await response.json();
    } catch (error) {
      console.error('Error removing vote:', error);
      throw error;
    }
  }, [API_URL]);

  const deleteRetroItem = useCallback(async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/retros/items/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete retro item');
      return true;
    } catch (error) {
      console.error('Error deleting retro item:', error);
      throw error;
    }
  }, [API_URL]);

  return {
    createRetro,
    getRetroById,
    getRetroItems,
    addRetroItem,
    updateRetroItem,
    addVoteToItem,
    removeVoteFromItem,
    deleteRetroItem,
  };
};
