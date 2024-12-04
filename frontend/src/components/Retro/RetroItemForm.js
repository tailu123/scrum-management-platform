import React, { useState } from 'react';

export const RetroItemForm = ({ category, onSubmit, onCancel }) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      content: content.trim(),
      author: author.trim() || 'Anonymous'
    });

    setContent('');
    setAuthor('');
  };

  return (
    <div className="retro-item-form-overlay">
      <div className="retro-item-form">
        <h3>Add Item to {category.name}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Your Name (optional):</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Anonymous"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button 
              type="submit"
              className="primary"
              disabled={!content.trim()}
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
