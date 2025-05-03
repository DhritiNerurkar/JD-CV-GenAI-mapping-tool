import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function CircularProgressWithLabel(props) {
  const theme = useTheme();
  // Destructure size and label from props, provide defaults
  const { value, label = '', size = 55, labelVariant = "caption", scoreVariant = "caption", scoreWeight = "bold", ...rest } = props;

  // Determine color based on score
  let progressColor = theme.palette.error.main;
  if (value >= 85) {
    progressColor = theme.palette.success.main;
  } else if (value >= 65) {
    progressColor = theme.palette.warning.main;
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', mx: 1 }}>
        <Box sx={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                sx={{ color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 300 : 700] }} // Slightly darker grey track
                size={size}
                thickness={4}
                value={100} // Background track always 100
            />
            <CircularProgress
                variant="determinate"
                disableShrink
                sx={{
                    color: progressColor,
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                }}
                 size={size}
                 thickness={4}
                value={value} // Actual score value
                {...rest} // Pass any other CircularProgress props
            />
            <Box
                sx={{
                    top: 0, left: 0, bottom: 0, right: 0,
                    position: 'absolute', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                }}
            >
                <Typography
                    variant={scoreVariant} // Use prop for score variant
                    component="div"
                    fontWeight={scoreWeight} // Use prop for score weight
                    color="text.primary" // Make score primary color
                 >
                   {/* Display value based on type */}
                   {typeof value === 'number' ? `${Math.round(value)}${label ? '%' : ''}` : 'N/A'}
                </Typography>
            </Box>
        </Box>
        {/* Label below the circle */}
        {label && ( // Only show label if provided
            <Typography variant={labelVariant} component="div" color="text.secondary" sx={{ mt: 0.5, textAlign: 'center' }}>
                {label}
            </Typography>
        )}
    </Box>
  );
}

// Updated wrapper component to pass props through
const CircularScoreIndicator = ({ score = 0, label, size, labelVariant, scoreVariant, scoreWeight }) => {
    return <CircularProgressWithLabel
                value={score}
                label={label}
                size={size}
                labelVariant={labelVariant}
                scoreVariant={scoreVariant}
                scoreWeight={scoreWeight}
            />;
}

export default CircularScoreIndicator;