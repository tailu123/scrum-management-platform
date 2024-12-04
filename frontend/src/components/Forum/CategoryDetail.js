import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForumService } from '../../hooks/useForumService';

export const CategoryDetail = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [threads, setThreads] = useState({ threads: [], total: 0, page: 1, totalPages: 1 });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, getCategoryById, getThreadsByCategory } = useForumService();

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  useEffect(() => {
    loadThreads();
  }, [categoryId, sortBy, currentPage]);

  const loadCategory = async () => {
    try {
      const data = await getCategoryById(categoryId);
      setCategory(data);
    } catch (err) {
      console.error('Error loading category:', err);
    }
  };

  const loadThreads = async () => {
    try {
      const data = await getThreadsByCategory(categoryId, {
        page: currentPage,
        limit: 20,
        sort: sortBy
      });
      setThreads(data);
    } catch (err) {
      console.error('Error loading threads:', err);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="forum-loading">
        <div className="loading-spinner"></div>
        <p>Loading threads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forum-error">
        <p>Error loading content: {error}</p>
        <button onClick={loadThreads}>Retry</button>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="forum-error">
        <p>Category not found</p>
        <Link to="/forum" className="back-link">Back to Forum</Link>
      </div>
    );
  }

  return (
    <div className="category-detail">
      <header className="category-header">
        <div className="header-content">
          <Link to="/forum" className="back-link">← Back to Categories</Link>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
        <Link to={`/forum/categories/${categoryId}/new`} className="new-thread-button">
          New Thread
        </Link>
      </header>

      <div className="thread-controls">
        <div className="sort-control">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="mostViewed">Most Viewed</option>
            <option value="mostReplies">Most Replies</option>
            <option value="lastReplied">Last Replied</option>
          </select>
        </div>
      </div>

      <div className="thread-list">
        {threads.threads.map(thread => (
          <Link
            key={thread.id}
            to={`/forum/threads/${thread.id}`}
            className="thread-card"
          >
            <div className="thread-main">
              <h3>{thread.title}</h3>
              <p className="thread-preview">
                {thread.content.substring(0, 150)}...
              </p>
              <div className="thread-meta">
                <span>By {thread.author}</span>
                <span>•</span>
                <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="thread-stats">
              <div className="stat">
                <span className="stat-value">{thread.views}</span>
                <span className="stat-label">views</span>
              </div>
              <div className="stat">
                <span className="stat-value">{thread.replyCount}</span>
                <span className="stat-label">replies</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {threads.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {currentPage} of {threads.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === threads.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
