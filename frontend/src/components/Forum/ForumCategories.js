import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForumService } from '../../hooks/useForumService';
import '../../styles/forum.css';

export const ForumCategories = () => {
  const [categories, setCategories] = useState([]);
  const { loading, error, getCategories } = useForumService();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  if (loading) {
    return (
      <div className="forum-loading">
        <div className="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forum-error">
        <p>Error loading categories: {error}</p>
        <button onClick={loadCategories}>Retry</button>
      </div>
    );
  }

  return (
    <div className="forum-container">
      <header className="forum-header">
        <h1>Scrum Community Forum</h1>
        <p>Join discussions about Scrum and Agile development</p>
      </header>

      <div className="forum-search">
        <input
          type="text"
          placeholder="Search forum threads..."
          onChange={(e) => {/* TODO: Implement search */}}
        />
      </div>

      <div className="forum-categories">
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/forum/categories/${category.id}`}
            className="category-card"
          >
            <div className="category-info">
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </div>
            <div className="category-stats">
              {/* TODO: Add real stats */}
              <span>0 threads</span>
              <span>0 replies</span>
            </div>
            <div className="category-arrow">→</div>
          </Link>
        ))}
      </div>

      <div className="forum-footer">
        <div className="forum-stats">
          <div className="stat-item">
            <label>Total Threads</label>
            <span>0</span>
          </div>
          <div className="stat-item">
            <label>Total Replies</label>
            <span>0</span>
          </div>
          <div className="stat-item">
            <label>Active Users</label>
            <span>0</span>
          </div>
        </div>

        <div className="forum-guidelines">
          <h3>Forum Guidelines</h3>
          <ul>
            <li>Be respectful and professional</li>
            <li>Stay on topic</li>
            <li>No spam or self-promotion</li>
            <li>Search before posting</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
