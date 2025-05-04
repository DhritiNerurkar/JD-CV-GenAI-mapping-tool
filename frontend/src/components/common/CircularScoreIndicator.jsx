import React from 'react';
import { Box, Typography } from '@mui/material';

// Helper function to determine color based on score
const getScoreColor = (score) => {
  if (score >= 85) return '#2e7d32'; // success.dark
  if (score >= 65) return '#ed6c02'; // warning.main
  return '#d32f2f'; // error.main
};

const CircularScoreIndicator = ({ 
  score = 0,
  size = 80, 
  thickness = 8,
  label = '',
  scoreVariant = 'body1',
  labelVariant = 'caption',
  scoreWeight = 'bold'
}) => {
  // Ensure score is within 0-100
  const validScore = Math.max(0, Math.min(100, score));
  const percentage = validScore / 100;
  const color = getScoreColor(validScore);
  
  // SVG dimensions
  const viewBoxSize = 36;
  const radius = (viewBoxSize - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashArray = circumference;
  const dashOffset = circumference * (1 - percentage);
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        mx: 1,
        my: 1,
      }}
    >
      <Box 
        sx={{ 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: size, 
          height: size,
        }}
      >
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth={thickness}
          />
          <circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Score text */}
        <Typography 
          variant={scoreVariant} 
          component="div" 
          sx={{ 
            fontWeight: scoreWeight,
            fontSize: size > 70 ? undefined : '0.9rem', // Adjust font size for smaller circles
          }}
        >
          {Math.round(validScore)}%
        </Typography>
      </Box>
      
      {/* Label text */}
      {label && (
        <Typography 
          variant={labelVariant} 
          align="center" 
          color="text.secondary" 
          sx={{ 
            mt: 0.5,
            fontSize: size > 70 ? undefined : '0.75rem', // Adjust font size for smaller circles
            maxWidth: size * 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default CircularScoreIndicator;