
// src/components/Loader.js
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ message = 'جاري التحميل...' }) => {

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        p: 4
      }}
    >
      <CircularProgress
        color="primary"
        size={60}
        thickness={4}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;