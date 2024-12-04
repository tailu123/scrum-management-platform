import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  ThumbUp as ThumbUpIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const RETRO_CATEGORIES = [
  {
    title: 'What Went Well',
    color: '#e3f2fd',
    icon: '👍',
  },
  {
    title: 'What Could Be Improved',
    color: '#fff3e0',
    icon: '💭',
  },
  {
    title: 'Action Items',
    color: '#e8f5e9',
    icon: '✅',
  },
];

function Retrospective() {
  const [items, setItems] = useState([
    // Sample items - will be replaced with real data
    {
      id: 1,
      category: 'What Went Well',
      content: 'Great team collaboration',
      votes: 3,
    },
    {
      id: 2,
      category: 'What Could Be Improved',
      content: 'Sprint planning efficiency',
      votes: 2,
    },
  ]);

  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddItem = (category) => {
    if (newItem.trim()) {
      setItems([
        ...items,
        {
          id: Date.now(),
          category,
          content: newItem,
          votes: 0,
        },
      ]);
      setNewItem('');
      setSelectedCategory(null);
    }
  };

  const handleVote = (itemId) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, votes: item.votes + 1 } : item
      )
    );
  };

  const getItemsByCategory = (category) => {
    return items
      .filter((item) => item.category === category)
      .sort((a, b) => b.votes - a.votes);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sprint Retrospective
      </Typography>

      <Grid container spacing={3}>
        {RETRO_CATEGORIES.map((category) => (
          <Grid item xs={12} md={4} key={category.title}>
            <Paper
              sx={{
                p: 2,
                bgcolor: category.color,
                height: '100%',
                minHeight: '60vh',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {category.icon} {category.title}
              </Typography>

              {selectedCategory === category.title ? (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Type your thoughts..."
                    multiline
                    rows={2}
                  />
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAddItem(category.title)}
                    >
                      Add
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedCategory(null);
                        setNewItem('');
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setSelectedCategory(category.title)}
                  sx={{ mb: 2 }}
                >
                  Add Item
                </Button>
              )}

              {getItemsByCategory(category.title).map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body2">{item.content}</Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleVote(item.id)}
                      >
                        <ThumbUpIcon fontSize="small" />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {item.votes}
                        </Typography>
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Retrospective;
