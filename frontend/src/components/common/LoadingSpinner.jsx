import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2, // Add some padding
        width: '100%', // Ensure it takes width if needed
      }}
    >
      <CircularProgress sx={{ mb: 1 }} /> {/* Margin bottom */}
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;