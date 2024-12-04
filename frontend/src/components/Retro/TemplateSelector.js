import React, { useState, useEffect } from 'react';
import { useRetroTemplateService } from '../../hooks/useRetroTemplateService';

export const TemplateSelector = ({ onTemplateSelect, onCreateNew }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const templateService = useRetroTemplateService();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const fetchedTemplates = await templateService.getAllTemplates();
    setTemplates(fetchedTemplates);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    onTemplateSelect(template);
  };

  return (
    <div className="template-selector">
      <h2>Choose a Retrospective Template</h2>
      
      <div className="templates-grid">
        {templates.map(template => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
            onClick={() => handleTemplateSelect(template)}
          >
            <h3>{template.name}</h3>
            <p>{template.description}</p>
            
            <div className="template-preview">
              {template.categories.map(category => (
                <div
                  key={category.id}
                  className="category-preview"
                  style={{ backgroundColor: category.color + '20', borderColor: category.color }}
                >
                  {category.name}
                </div>
              ))}
            </div>

            {template.isCustom && (
              <span className="custom-badge">Custom Template</span>
            )}
          </div>
        ))}

        <div 
          className="template-card create-new"
          onClick={onCreateNew}
        >
          <div className="create-new-content">
            <span className="plus-icon">+</span>
            <h3>Create Custom Template</h3>
            <p>Design your own retrospective format</p>
          </div>
        </div>
      </div>
    </div>
  );
};
