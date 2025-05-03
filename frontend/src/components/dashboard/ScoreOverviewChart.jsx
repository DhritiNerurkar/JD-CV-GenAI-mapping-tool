import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const ScoreOverviewChart = ({ results }) => {

  // Prepare data: [{ name: 'CV Filename', score: Number }, ...]
  const chartData = (results || [])
      .map(item => ({
          name: item.cv_filename.replace('.pdf', '').substring(0, 15) + (item.cv_filename.length > 19 ? '...' : ''), // Shorten name for axis
          score: item.overall_score ?? 0,
      }))
      .sort((a, b) => b.score - a.score); // Sort descending by score

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Find original filename if needed (might require passing full results)
            return (
            <Paper sx={{ p: 1, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
                <Typography variant="caption" display="block">{`CV: ${label}`}</Typography>
                <Typography variant="caption" display="block" fontWeight="bold">{`Score: ${payload[0].value}`}</Typography>
            </Paper>
            );
        }
        return null;
    };


  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2, height: 280 }}> {/* Use outlined paper */}
      <Typography variant="subtitle1" component="div" sx={{ mb: 1, fontWeight: 'medium' }}>
        CV Overall Scores
      </Typography>
      {(!chartData || chartData.length === 0) ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="80%">
             <Typography color="text.secondary" variant="body2">No results to display</Typography>
          </Box>
      ) : (
            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    data={chartData}
                    layout="vertical" // Vertical layout looks better for lists
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }}/>
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }}/>
                    {/* <Legend /> */}
                    <Bar dataKey="score" fill="#8884d8" name="Overall Score" barSize={15}>
                        {/* Optional: Label inside the bar */}
                         <LabelList dataKey="score" position="right" style={{ fontSize: '10px', fill: '#fff' }}/>
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        )}
    </Paper>
  );
};

export default ScoreOverviewChart;