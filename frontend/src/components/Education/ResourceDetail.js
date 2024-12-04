import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResourceService } from '../../hooks/useResourceService';

// Component for displaying detailed view of an educational resource
export const ResourceDetail = () => {
  const [resource, setResource] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const resourceService = useResourceService();

  useEffect(() => {
    loadResource();
  }, [id]);

  const loadResource = async () => {
    try {
      const fetchedResource = await resourceService.getResourceById(id);
      setResource(fetchedResource);
    } catch (error) {
      console.error('Error loading resource:', error);
      navigate('/resources');
    }
  };

  if (!resource) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="resource-detail">
      <header className="resource-detail-header">
        <h1>{resource.title}</h1>
        <div className="resource-metadata">
          <span className={`difficulty-badge ${resource.difficulty}`}>
            {resource.difficulty}
          </span>
          <span className="category-badge">
            {resource.category}
          </span>
        </div>
      </header>

      <div className="resource-content">
        {resource.content.sections.map((section, index) => (
          <section key={index} className="content-section">
            <h2>{section.title}</h2>
            <div className="section-content">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      <div className="resource-tags">
        {resource.tags.map(tag => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <button 
        className="back-button"
        onClick={() => navigate('/resources')}
      >
        Back to Resources
      </button>
    </div>
  );
};
