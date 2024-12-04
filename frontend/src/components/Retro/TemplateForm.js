import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

export const TemplateForm = ({ template, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(template || {
    name: '',
    description: '',
    categories: [{ id: Date.now().toString(), name: '', color: '#007bff' }]
  });
  const [editingColorFor, setEditingColorFor] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...formData.categories];
    newCategories[index] = {
      ...newCategories[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  const handleAddCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        { id: Date.now().toString(), name: '', color: '#007bff' }
      ]
    }));
  };

  const handleRemoveCategory = (index) => {
    if (formData.categories.length <= 1) return;
    const newCategories = [...formData.categories];
    newCategories.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="template-form-container">
      <form onSubmit={handleSubmit} className="template-form">
        <h2>{template ? 'Edit Template' : 'Create New Template'}</h2>

        <div className="form-group">
          <label htmlFor="name">Template Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Sprint Retrospective"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the purpose and format of this template"
            required
          />
        </div>

        <div className="categories-section">
          <h3>Categories</h3>
          {formData.categories.map((category, index) => (
            <div key={category.id} className="category-form-group">
              <div className="category-inputs">
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                  placeholder="Category Name"
                  required
                />
                <div className="color-picker-container">
                  <div
                    className="color-preview"
                    style={{ backgroundColor: category.color }}
                    onClick={() => setEditingColorFor(category.id)}
                  />
                  {editingColorFor === category.id && (
                    <div className="color-picker-popover">
                      <div
                        className="color-picker-cover"
                        onClick={() => setEditingColorFor(null)}
                      />
                      <ChromePicker
                        color={category.color}
                        onChange={(color) => {
                          handleCategoryChange(index, 'color', color.hex);
                        }}
                      />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="remove-category"
                  onClick={() => handleRemoveCategory(index)}
                  disabled={formData.categories.length <= 1}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            className="add-category"
            onClick={handleAddCategory}
          >
            + Add Category
          </button>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary">
            {template ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      </form>
    </div>
  );
};
