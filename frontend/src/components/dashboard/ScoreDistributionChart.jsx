import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box } from '@mui/material'; // Import MUI components

const ScoreDistributionChart = ({ results }) => {

   // Process data for chart: Count CVs in score ranges
   const scoreRanges = [
     { name: '0-19', count: 0 }, { name: '20-39', count: 0 },
     { name: '40-59', count: 0 }, { name: '60-79', count: 0 },
     { name: '80-100', count: 0 },
   ];

   if (results && results.length > 0){
        results.forEach(item => {
            const score = item.overall_score ?? 0;
            if (score >= 80) scoreRanges[4].count++;
            else if (score >= 60) scoreRanges[3].count++;
            else if (score >= 40) scoreRanges[2].count++;
            else if (score >= 20) scoreRanges[1].count++;
            else scoreRanges[0].count++;
        });
   }

  return (
    // Wrap chart in MUI Paper for styling consistency
    <Paper elevation={2} sx={{ p: 2, height: 280 }}>
      <Typography variant="h6" component="div" sx={{ mb: 1 }}>
        Overall Score Distribution
      </Typography>
      {(!results || results.length === 0) ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="80%">
             <Typography color="text.secondary">No data available</Typography>
          </Box>
      ) : (
            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    data={scoreRanges}
                    margin={{ top: 5, right: 5, left: -25, bottom: 5 }} // Adjusted margins
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={30}/>
                    <Tooltip wrapperStyle={{ fontSize: '12px' }}/>
                    {/* <Legend wrapperStyle={{ fontSize: '12px' }} verticalAlign="top" height={30} /> */}
                    <Bar dataKey="count" fill="#1976d2" name="CV Count" barSize={30}/> {/* MUI primary blue */}
                </BarChart>
            </ResponsiveContainer>
        )}
    </Paper>
  );
};

export default ScoreDistributionChart;