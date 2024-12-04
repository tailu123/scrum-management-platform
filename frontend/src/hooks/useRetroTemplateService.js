import { useCallback } from 'react';

export const useRetroTemplateService = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const getAllTemplates = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/retro-templates`);
      if (!response.ok) throw new Error('Failed to fetch templates');
      return await response.json();
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  }, [API_URL]);

  const getTemplateById = useCallback(async (templateId) => {
    try {
      const response = await fetch(`${API_URL}/retro-templates/${templateId}`);
      if (!response.ok) throw new Error('Failed to fetch template');
      return await response.json();
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  }, [API_URL]);

  const createCustomTemplate = useCallback(async (templateData) => {
    try {
      const response = await fetch(`${API_URL}/retro-templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });
      if (!response.ok) throw new Error('Failed to create template');
      return await response.json();
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }, [API_URL]);

  const updateCustomTemplate = useCallback(async (templateId, updateData) => {
    try {
      const response = await fetch(`${API_URL}/retro-templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error('Failed to update template');
      return await response.json();
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }, [API_URL]);

  const deleteCustomTemplate = useCallback(async (templateId) => {
    try {
      const response = await fetch(`${API_URL}/retro-templates/${templateId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete template');
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }, [API_URL]);

  return {
    getAllTemplates,
    getTemplateById,
    createCustomTemplate,
    updateCustomTemplate,
    deleteCustomTemplate,
  };
};
