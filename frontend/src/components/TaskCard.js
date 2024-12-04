import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';

const priorityColors = {
  High: 'error',
  Medium: 'warning',
  Low: 'success',
};

function TaskCard({ task, onClick }) {
  const {
    title,
    description,
    priority,
    dueDate,
    assignees,
    commentsCount,
    attachmentsCount,
  } = task;

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 3,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Chip
            label={priority}
            size="small"
            color={priorityColors[priority]}
            sx={{ mr: 1 }}
          />
          {dueDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="caption">
                {new Date(dueDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
            {assignees?.map((assignee, index) => (
              <Avatar
                key={index}
                alt={assignee.name}
                src={assignee.avatar}
                sx={{ width: 24, height: 24 }}
              >
                {assignee.name[0]}
              </Avatar>
            ))}
          </AvatarGroup>
          
          <Box>
            {commentsCount > 0 && (
              <IconButton size="small">
                <CommentIcon fontSize="small" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {commentsCount}
                </Typography>
              </IconButton>
            )}
            {attachmentsCount > 0 && (
              <IconButton size="small">
                <AttachFileIcon fontSize="small" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {attachmentsCount}
                </Typography>
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TaskCard;
