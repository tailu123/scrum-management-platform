import { useState, useEffect, useCallback } from 'react';

export const useBurndownChart = (sprintId) => {
  const [burndownData, setBurndownData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchBurndownData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/burndown/sprint/${sprintId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch burndown data');
      }

      const data = await response.json();
      setBurndownData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching burndown data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL, sprintId]);

  const updateBurndownData = useCallback(async (taskId, action) => {
    try {
      const response = await fetch(
        `${API_URL}/burndown/sprint/${sprintId}/task/${taskId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update burndown data');
      }

      const data = await response.json();
      setBurndownData(data);
      return data;
    } catch (err) {
      console.error('Error updating burndown data:', err);
      throw err;
    }
  }, [API_URL, sprintId]);

  useEffect(() => {
    if (sprintId) {
      fetchBurndownData();
    }
  }, [sprintId, fetchBurndownData]);

  return {
    burndownData,
    loading,
    error,
    refreshBurndownData: fetchBurndownData,
    updateBurndownData,
  };
};
