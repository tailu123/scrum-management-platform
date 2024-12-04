import React, { useState } from 'react';
import {
  Box,
  Avatar,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

function CommentBox({ comment, onEdit, onDelete, currentUser }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleSaveEdit = () => {
    onEdit(comment.id, editedContent);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    onDelete(comment.id);
    handleMenuClose();
  };

  const isAuthor = currentUser?.id === comment.author.id;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Avatar
          src={comment.author.avatar}
          alt={comment.author.name}
          sx={{ mr: 2 }}
        >
          {comment.author.name[0]}
        </Avatar>
        
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box>
              <Typography variant="subtitle2">
                {comment.author.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(comment.timestamp).toLocaleString()}
              </Typography>
            </Box>
            
            {isAuthor && (
              <div>
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleEditClick}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                  </MenuItem>
                  <MenuItem onClick={handleDeleteClick}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Box>

          {isEditing ? (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(comment.content);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSaveEdit}
                >
                  Save
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2">{comment.content}</Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default CommentBox;
