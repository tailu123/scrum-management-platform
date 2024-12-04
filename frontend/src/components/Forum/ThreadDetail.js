import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForumService } from '../../hooks/useForumService';

export const ThreadDetail = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState({ replies: [], total: 0, page: 1, totalPages: 1 });
  const [newReply, setNewReply] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  
  const {
    loading,
    error,
    getThreadById,
    getRepliesByThread,
    createReply,
    updateThread,
    deleteThread,
    deleteReply
  } = useForumService();

  useEffect(() => {
    loadThread();
  }, [threadId]);

  useEffect(() => {
    loadReplies();
  }, [threadId, currentPage]);

  const loadThread = async () => {
    try {
      const data = await getThreadById(threadId);
      setThread(data);
      setEditContent(data.content);
    } catch (err) {
      console.error('Error loading thread:', err);
    }
  };

  const loadReplies = async () => {
    try {
      const data = await getRepliesByThread(threadId, {
        page: currentPage,
        limit: 20
      });
      setReplies(data);
    } catch (err) {
      console.error('Error loading replies:', err);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      await createReply(threadId, {
        content: newReply,
        author: 'Current User' // TODO: Replace with actual user
      });
      setNewReply('');
      loadReplies();
    } catch (err) {
      console.error('Error creating reply:', err);
    }
  };

  const handleThreadEdit = async () => {
    try {
      await updateThread(threadId, { content: editContent });
      setIsEditing(false);
      loadThread();
    } catch (err) {
      console.error('Error updating thread:', err);
    }
  };

  const handleThreadDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this thread?')) {
      return;
    }

    try {
      await deleteThread(threadId);
      navigate(`/forum/categories/${thread.categoryId}`);
    } catch (err) {
      console.error('Error deleting thread:', err);
    }
  };

  const handleReplyDelete = async (replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }

    try {
      await deleteReply(replyId);
      loadReplies();
    } catch (err) {
      console.error('Error deleting reply:', err);
    }
  };

  if (loading) {
    return (
      <div className="forum-loading">
        <div className="loading-spinner"></div>
        <p>Loading thread...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forum-error">
        <p>Error loading thread: {error}</p>
        <button onClick={loadThread}>Retry</button>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="forum-error">
        <p>Thread not found</p>
        <Link to="/forum" className="back-link">Back to Forum</Link>
      </div>
    );
  }

  return (
    <div className="thread-detail">
      <header className="thread-header">
        <Link
          to={`/forum/categories/${thread.categoryId}`}
          className="back-link"
        >
          ← Back to Category
        </Link>
        <h1>{thread.title}</h1>
      </header>

      <div className="thread-content">
        <div className="post-meta">
          <div className="author-info">
            <span className="author-name">{thread.author}</span>
            <span className="post-date">
              {new Date(thread.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="post-actions">
            <button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button onClick={handleThreadDelete} className="delete-button">
              Delete
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="edit-content">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={5}
            />
            <button onClick={handleThreadEdit}>Save Changes</button>
          </div>
        ) : (
          <div className="content">{thread.content}</div>
        )}
      </div>

      <div className="replies-section">
        <h2>Replies ({replies.total})</h2>
        
        <div className="replies-list">
          {replies.replies.map(reply => (
            <div key={reply.id} className="reply-item">
              <div className="reply-meta">
                <div className="author-info">
                  <span className="author-name">{reply.author}</span>
                  <span className="post-date">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleReplyDelete(reply.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
              <div className="reply-content">{reply.content}</div>
            </div>
          ))}
        </div>

        {replies.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <span className="page-info">
              Page {currentPage} of {replies.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === replies.totalPages}
            >
              Next
            </button>
          </div>
        )}

        <form className="reply-form" onSubmit={handleReplySubmit}>
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write your reply..."
            rows={3}
            required
          />
          <button type="submit">Post Reply</button>
        </form>
      </div>
    </div>
  );
};
