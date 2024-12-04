import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForumService } from '../../hooks/useForumService';

export const NewThread = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { loading, error, createThread } = useForumService();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return;
    }

    try {
      const thread = await createThread({
        categoryId,
        title: title.trim(),
        content: content.trim(),
        author: 'Current User', // TODO: Replace with actual user
      });

      navigate(`/forum/threads/${thread.id}`);
    } catch (err) {
      console.error('Error creating thread:', err);
    }
  };

  return (
    <div className="new-thread">
      <header className="new-thread-header">
        <Link to={`/forum/categories/${categoryId}`} className="back-link">
          ← Back to Category
        </Link>
        <h1>Create New Thread</h1>
      </header>

      {error && (
        <div className="error-message">
          Error creating thread: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="thread-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter thread title"
            required
            minLength={5}
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thread content..."
            required
            rows={10}
            minLength={20}
          />
        </div>

        <div className="form-guidelines">
          <h3>Posting Guidelines</h3>
          <ul>
            <li>Be clear and concise in your title</li>
            <li>Provide enough detail in your content</li>
            <li>Stay on topic and relevant to the category</li>
            <li>Be respectful and professional</li>
          </ul>
        </div>

        <div className="form-actions">
          <Link
            to={`/forum/categories/${categoryId}`}
            className="cancel-button"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? 'Creating...' : 'Create Thread'}
          </button>
        </div>
      </form>
    </div>
  );
};
