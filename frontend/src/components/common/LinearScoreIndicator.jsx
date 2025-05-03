import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';

// Helper function to determine color based on score
const getScoreColor = (value, theme) => {
    if (value >= 85) return theme.palette.success.main;
    if (value >= 65) return theme.palette.warning.main;
    return theme.palette.error.main;
};

const StyledLinearProgress = styled(LinearProgress)(({ theme, scorecolor }) => ({
  height: 8,
  borderRadius: 4,
  [`& .MuiLinearProgress-bar`]: { // Target the bar itself
    backgroundColor: scorecolor,
    borderRadius: 4,
  },
   backgroundColor: alpha(scorecolor, 0.15), // Background track color based on score color
}));

const LinearScoreIndicator = ({ value = 0, label }) => {
  const theme = useTheme();
  const color = getScoreColor(value, theme);
  const displayValue = typeof value === 'number' ? Math.round(value) : 0;

  return (
    <Box sx={{ width: '100%', mb: 1.5 }}> {/* Add margin bottom */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body2" fontWeight="medium" sx={{ color: color }}>
             {displayValue}%
        </Typography>
      </Box>
      <StyledLinearProgress
            variant="determinate"
            value={displayValue}
            scorecolor={color} // Pass color to styled component
      />
    </Box>
  );
};

export default LinearScoreIndicator;