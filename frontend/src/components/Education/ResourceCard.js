import React from 'react';
import { Link } from 'react-router-dom';

// Component for displaying individual educational resources
export const ResourceCard = ({ resource }) => {
  return (
    <div className="resource-card">
      <div className="resource-header">
        <h3 className="resource-title">{resource.title}</h3>
        <span className={`difficulty-badge ${resource.difficulty}`}>
          {resource.difficulty}
        </span>
      </div>
      
      <div className="resource-preview">
        {resource.content.sections[0]?.content.substring(0, 150)}...
      </div>
      
      <div className="resource-tags">
        {resource.tags.map(tag => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="resource-footer">
        <Link 
          to={`/resources/${resource.id}`}
          className="read-more-button"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};
