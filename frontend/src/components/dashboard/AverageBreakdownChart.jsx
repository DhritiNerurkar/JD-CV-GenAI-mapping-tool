import React from 'react';
import { Paper, Typography, Box, Grid, Divider } from '@mui/material'; // Import Grid
import CircularScoreIndicator from '../common/CircularScoreIndicator'; // Import the circular indicator

const AverageBreakdownChart = ({ results }) => {
  let averageData = [];
  let hasData = false;

   if (results && results.length > 0) {
        hasData = true;
        const totals = { skills: 0, experience: 0, education: 0, keywords: 0, count: results.length };
        results.forEach(item => {
            // Ensure scores are numbers, default to 0 if not
            totals.skills += Number(item.skills_match_score) || 0;
            totals.experience += Number(item.experience_relevance_score) || 0;
            totals.education += Number(item.education_fit_score) || 0;
            totals.keywords += Number(item.keyword_alignment_score) || 0;
        });

        // Prepare data for the circular indicators
        averageData = [
            // Renamed 'subject' to 'label' for consistency with indicator props
            { label: 'Avg. Skills', score: Math.round(totals.skills / totals.count) },
            { label: 'Avg. Experience', score: Math.round(totals.experience / totals.count) },
            { label: 'Avg. Education', score: Math.round(totals.education / totals.count) },
            { label: 'Avg. Keywords', score: Math.round(totals.keywords / totals.count) },
        ];
   }

  return (
    // Use outlined Paper consistent with other charts
     <Paper elevation={0} variant="outlined" sx={{ p: 2, height: 280, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" component="div" sx={{ mb: 1, fontWeight: 'medium' }}>
            Average Score Breakdown
            <Typography variant='caption' display="block" color="text.secondary">Across displayed candidates</Typography>
        </Typography>
         <Divider sx={{ mb: 2 }} />
         {!hasData ? (
            <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
               <Typography color="text.secondary" variant="body2">No results to average</Typography>
            </Box>
        ) : (
            // Use Flexbox to arrange indicators horizontally and center them
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'space-around', // Distribute space
                    alignItems: 'center', // Vertically align
                    flexWrap: 'wrap', // Allow wrapping on small screens
                    gap: 1, // Add gap between items
                    py: 2 // Add some vertical padding
                }}
             >
               {averageData.map(item => (
                    <CircularScoreIndicator
                        key={item.label}
                        score={item.score}
                        label={item.label}
                        size={75} // Adjust size as needed for this context
                        scoreVariant="h6" // Slightly larger score font
                    />
                ))}
            </Box>
        )}
    </Paper>
  );
};

export default AverageBreakdownChart;