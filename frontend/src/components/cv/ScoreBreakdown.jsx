import React from 'react';
import { List, ListItem, ListItemText, Typography, Chip } from '@mui/material';

// Helper to determine color based on score
const getScoreChipColor = (score) => {
    if (score >= 85) return 'success';
    if (score >= 65) return 'warning';
    return 'error';
};

const ScoreBreakdown = ({ analysis }) => {
  const breakdown = [
    { label: 'Skills Match', score: analysis?.skills_match_score },
    { label: 'Experience Relevance', score: analysis?.experience_relevance_score },
    { label: 'Education Fit', score: analysis?.education_fit_score },
    { label: 'Keyword Alignment', score: analysis?.keyword_alignment_score },
  ];

  return (
    <>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Score Breakdown:</Typography>
        <List dense disablePadding>
            {breakdown.map(item => (
                 <ListItem key={item.label} disableGutters sx={{ py: 0.2 }}>
                    <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                    <Chip
                        label={typeof item.score === 'number' ? item.score : 'N/A'}
                        color={getScoreChipColor(item.score ?? 0)}
                        size="small"
                        variant="outlined" // Use outlined or filled
                        sx={{ fontWeight: 'medium' }}
                    />
                 </ListItem>
            ))}
        </List>
    </>
  );
};

export default ScoreBreakdown;