import React from 'react';
import {
  Grid, Typography, Box, useTheme, Paper, Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// Linear progress bar with label
const LinearScoreIndicator = ({ 
  score, 
  label, 
  tooltipText = null,
  height = 10, 
  borderRadius = 5
}) => {
  const theme = useTheme();
  let color;
  
  if (score >= 80) {
    color = theme.palette.success.main;
  } else if (score >= 60) {
    color = theme.palette.warning.main;
  } else {
    color = theme.palette.error.main;
  }
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 0.5 }}>
            {label}
          </Typography>
          {tooltipText && (
            <Tooltip title={tooltipText} arrow placement="top">
              <InfoIcon fontSize="small" sx={{ fontSize: '16px', color: 'text.secondary', opacity: 0.7 }} />
            </Tooltip>
          )}
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color }}>
          {score}%
        </Typography>
      </Box>
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        backgroundColor: '#e6e6e6', 
        borderRadius,
        height 
      }}>
        <Box sx={{ 
          position: 'absolute', 
          left: 0, 
          top: 0, 
          bottom: 0, 
          backgroundColor: color, 
          width: `${score}%`, 
          borderRadius 
        }} />
      </Box>
    </Box>
  );
};

const ScoreBreakdown = ({ analysis }) => {
  const theme = useTheme();
  
  if (!analysis) return null;
  
  const scores = [
    { 
      key: 'skills_match_score', 
      label: 'Skills', 
      tooltip: 'Measure of how well the candidate\'s skills match the job requirements.'
    },
    { 
      key: 'experience_relevance_score', 
      label: 'Experience', 
      tooltip: 'Relevance and depth of candidate\'s work experience to the role.'
    },
    { 
      key: 'education_fit_score', 
      label: 'Education', 
      tooltip: 'How well the candidate\'s educational background meets job requirements.'
    },
    { 
      key: 'keyword_alignment_score', 
      label: 'Keywords', 
      tooltip: 'Alignment with specific keywords and terminology from the job description.'
    }
  ];

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Grid container spacing={3}>
        {scores.map((score) => (
          <Grid item xs={12} sm={6} key={score.key}>
            <LinearScoreIndicator
              score={analysis[score.key] ?? 0}
              label={score.label}
              tooltipText={score.tooltip}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ScoreBreakdown;