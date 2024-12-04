import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRetroService } from '../../hooks/useRetroService';
import { useRetroTemplateService } from '../../hooks/useRetroTemplateService';
import { RetroColumn } from './RetroColumn';
import { RetroItemForm } from './RetroItemForm';
import { TemplateSelector } from './TemplateSelector';
import { TemplateForm } from './TemplateForm';
import { ExportButton } from './ExportButton';

export const RetroBoard = () => {
  const [retro, setRetro] = useState(null);
  const [items, setItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  
  const { retroId } = useParams();
  const navigate = useNavigate();
  const retroService = useRetroService();
  const templateService = useRetroTemplateService();

  useEffect(() => {
    if (retroId) {
      loadRetro();
      loadItems();
    } else {
      setShowTemplateSelector(true);
    }
  }, [retroId]);

  const loadRetro = async () => {
    try {
      const retroData = await retroService.getRetroById(retroId);
      setRetro(retroData);
    } catch (error) {
      console.error('Error loading retrospective:', error);
    }
  };

  const loadItems = async () => {
    try {
      const retroItems = await retroService.getRetroItems(retroId);
      setItems(retroItems);
    } catch (error) {
      console.error('Error loading retro items:', error);
    }
  };

  const handleTemplateSelect = async (template) => {
    try {
      const newRetro = await retroService.createRetro({
        title: `Sprint Retrospective using ${template.name}`,
        template: template.id,
        categories: template.categories
      });
      navigate(`/retros/${newRetro.id}`);
      setShowTemplateSelector(false);
    } catch (error) {
      console.error('Error creating retrospective:', error);
    }
  };

  const handleCreateTemplate = async (templateData) => {
    try {
      if (editingTemplate) {
        await templateService.updateCustomTemplate(editingTemplate.id, templateData);
      } else {
        await templateService.createCustomTemplate(templateData);
      }
      setShowTemplateForm(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      await retroService.addRetroItem(retroId, {
        ...itemData,
        categoryId: selectedCategory.id
      });
      await loadItems();
      setShowAddForm(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error adding retro item:', error);
    }
  };

  const handleVote = async (itemId, isAdding) => {
    try {
      if (isAdding) {
        await retroService.addVoteToItem(itemId);
      } else {
        await retroService.removeVoteFromItem(itemId);
      }
      await loadItems();
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await retroService.deleteRetroItem(itemId);
      await loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (showTemplateSelector) {
    return (
      <TemplateSelector
        onTemplateSelect={handleTemplateSelect}
        onCreateNew={() => {
          setShowTemplateSelector(false);
          setShowTemplateForm(true);
        }}
      />
    );
  }

  if (showTemplateForm) {
    return (
      <TemplateForm
        template={editingTemplate}
        onSubmit={handleCreateTemplate}
        onCancel={() => {
          setShowTemplateForm(false);
          setShowTemplateSelector(true);
          setEditingTemplate(null);
        }}
      />
    );
  }

  if (!retro) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="retro-board">
      <header className="retro-header">
        <h1>{retro.title}</h1>
        <div className="retro-actions">
          <ExportButton retroId={retroId} />
          <button 
            className="add-item-button"
            onClick={() => setShowAddForm(true)}
          >
            Add Item
          </button>
        </div>
      </header>

      <div className="retro-columns">
        {retro.categories.map(category => (
          <RetroColumn
            key={category.id}
            category={category}
            items={items.filter(item => item.categoryId === category.id)}
            onVote={handleVote}
            onDelete={handleDelete}
            onAddClick={() => {
              setSelectedCategory(category);
              setShowAddForm(true);
            }}
          />
        ))}
      </div>

      {showAddForm && (
        <RetroItemForm
          category={selectedCategory}
          onSubmit={handleAddItem}
          onCancel={() => {
            setShowAddForm(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
};
