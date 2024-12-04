import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const SPRINT_STATUSES = ['To Do', 'In Progress', 'Review', 'Done'];

function SprintBoard() {
  const [tasks, setTasks] = useState([
    // Sample tasks - will be replaced with real data
    {
      id: 1,
      title: 'Implement user authentication',
      description: 'Add JWT-based authentication system',
      status: 'In Progress',
      priority: 'High',
    },
    {
      id: 2,
      title: 'Design database schema',
      description: 'Create MongoDB schemas for core entities',
      status: 'Done',
      priority: 'High',
    },
  ]);

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Sprint Board</Typography>
        <IconButton
          color="primary"
          size="large"
          onClick={() => {
            // TODO: Implement add task functionality
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        {SPRINT_STATUSES.map((status) => (
          <Grid item xs={12} md={3} key={status}>
            <Paper
              sx={{
                p: 2,
                bgcolor: 'grey.100',
                height: '100%',
                minHeight: '70vh',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {status}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {getTasksByStatus(status).map((task) => (
                  <Card
                    key={task.id}
                    sx={{ mb: 2, cursor: 'pointer' }}
                    onClick={() => {
                      // TODO: Implement task detail view
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1">{task.title}</Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {task.description}
                      </Typography>
                      <Chip
                        label={task.priority}
                        size="small"
                        color={task.priority === 'High' ? 'error' : 'default'}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SprintBoard;
