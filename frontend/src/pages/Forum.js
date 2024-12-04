import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';

function Forum() {
  const [discussions, setDiscussions] = useState([
    // Sample discussions - will be replaced with real data
    {
      id: 1,
      title: 'Sprint Planning Discussion',
      content: "Let's discuss the upcoming sprint goals and priorities.",
      author: 'John Doe',
      date: '2024-01-15',
      likes: 5,
      comments: 3,
    },
    {
      id: 2,
      title: 'Technical Debt Review',
      content: 'We need to address some critical technical debt issues.',
      author: 'Jane Smith',
      date: '2024-01-14',
      likes: 3,
      comments: 2,
    },
  ]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Team Forum</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // TODO: Implement new discussion functionality
          }}
        >
          New Discussion
        </Button>
      </Box>

      <Paper>
        <List>
          {discussions.map((discussion, index) => (
            <React.Fragment key={discussion.id}>
              {index > 0 && <Divider />}
              <ListItem
                alignItems="flex-start"
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  // TODO: Implement discussion detail view
                }}
              >
                <ListItemAvatar>
                  <Avatar>{discussion.author[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={discussion.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {discussion.author}
                      </Typography>
                      {' — '}
                      {discussion.content}
                      <Box sx={{ mt: 1 }}>
                        <IconButton size="small">
                          <ThumbUpIcon fontSize="small" />
                        </IconButton>
                        {discussion.likes}
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <CommentIcon fontSize="small" />
                        </IconButton>
                        {discussion.comments}
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ ml: 2 }}
                        >
                          {discussion.date}
                        </Typography>
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default Forum;
