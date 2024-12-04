import { useState, useCallback } from 'react';

export const useForumService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const FORUM_API = `${API_URL}/forum`;

  const handleRequest = async (url, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = response.status === 204 ? null : await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Category Methods
  const getCategories = useCallback(() => {
    return handleRequest(`${FORUM_API}/categories`);
  }, [FORUM_API]);

  const getCategoryById = useCallback((categoryId) => {
    return handleRequest(`${FORUM_API}/categories/${categoryId}`);
  }, [FORUM_API]);

  // Thread Methods
  const createThread = useCallback((threadData) => {
    return handleRequest(`${FORUM_API}/threads`, {
      method: 'POST',
      body: JSON.stringify(threadData),
    });
  }, [FORUM_API]);

  const getThreadById = useCallback((threadId) => {
    return handleRequest(`${FORUM_API}/threads/${threadId}`);
  }, [FORUM_API]);

  const getThreadsByCategory = useCallback((categoryId, { page = 1, limit = 20, sort = 'newest' } = {}) => {
    const query = new URLSearchParams({ page, limit, sort }).toString();
    return handleRequest(`${FORUM_API}/categories/${categoryId}/threads?${query}`);
  }, [FORUM_API]);

  const updateThread = useCallback((threadId, updates) => {
    return handleRequest(`${FORUM_API}/threads/${threadId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }, [FORUM_API]);

  const deleteThread = useCallback((threadId) => {
    return handleRequest(`${FORUM_API}/threads/${threadId}`, {
      method: 'DELETE',
    });
  }, [FORUM_API]);

  // Reply Methods
  const createReply = useCallback((threadId, replyData) => {
    return handleRequest(`${FORUM_API}/threads/${threadId}/replies`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    });
  }, [FORUM_API]);

  const getRepliesByThread = useCallback((threadId, { page = 1, limit = 20 } = {}) => {
    const query = new URLSearchParams({ page, limit }).toString();
    return handleRequest(`${FORUM_API}/threads/${threadId}/replies?${query}`);
  }, [FORUM_API]);

  const updateReply = useCallback((replyId, updates) => {
    return handleRequest(`${FORUM_API}/replies/${replyId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }, [FORUM_API]);

  const deleteReply = useCallback((replyId) => {
    return handleRequest(`${FORUM_API}/replies/${replyId}`, {
      method: 'DELETE',
    });
  }, [FORUM_API]);

  // Search Methods
  const searchThreads = useCallback((searchQuery, { page = 1, limit = 20 } = {}) => {
    const query = new URLSearchParams({ q: searchQuery, page, limit }).toString();
    return handleRequest(`${FORUM_API}/search?${query}`);
  }, [FORUM_API]);

  return {
    // State
    loading,
    error,
    
    // Category Methods
    getCategories,
    getCategoryById,
    
    // Thread Methods
    createThread,
    getThreadById,
    getThreadsByCategory,
    updateThread,
    deleteThread,
    
    // Reply Methods
    createReply,
    getRepliesByThread,
    updateReply,
    deleteReply,
    
    // Search Methods
    searchThreads,
  };
};
