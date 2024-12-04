import React from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import Navbar from '../Navbar';

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Navbar />
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          py: isMobile ? 2 : 4,
          px: isMobile ? 2 : 3,
        }}
      >
        <Box
          sx={{
            borderRadius: 2,
            bgcolor: 'background.paper',
            p: isMobile ? 2 : 3,
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default MainLayout;
