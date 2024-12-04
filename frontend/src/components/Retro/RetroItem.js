import React, { useState } from 'react';

export const RetroItem = ({ item, onVote, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="retro-item">
      <div className="item-header">
        <div className="vote-section">
          <button
            className="vote-button"
            onClick={() => onVote(item.id, true)}
          >
            ▲
          </button>
          <span className="vote-count">{item.votes}</span>
          <button
            className="vote-button"
            onClick={() => onVote(item.id, false)}
          >
            ▼
          </button>
        </div>

        <div 
          className="item-content"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <p className={`item-text ${isExpanded ? 'expanded' : ''}`}>
            {item.content}
          </p>
          {item.content.length > 100 && !isExpanded && (
            <span className="expand-indicator">...</span>
          )}
        </div>

        <button
          className="delete-button"
          onClick={() => onDelete(item.id)}
        >
          ×
        </button>
      </div>

      {item.author && (
        <div className="item-footer">
          <span className="author">Added by {item.author}</span>
          <span className="timestamp">
            {new Date(item.createdAt).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};
