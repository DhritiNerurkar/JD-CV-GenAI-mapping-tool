import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Paper, Typography, Box } from '@mui/material'; // Import MUI components

const AverageBreakdownChart = ({ results }) => {
  let data = []; // Initialize empty data

   if (results && results.length > 0) {
        const totals = { skills: 0, experience: 0, education: 0, keywords: 0, count: results.length };
        results.forEach(item => {
            totals.skills += item.skills_match_score ?? 0;
            totals.experience += item.experience_relevance_score ?? 0;
            totals.education += item.education_fit_score ?? 0;
            totals.keywords += item.keyword_alignment_score ?? 0;
        });

        data = [
            { subject: 'Skills', score: Math.round(totals.skills / totals.count), fullMark: 100 },
            { subject: 'Experience', score: Math.round(totals.experience / totals.count), fullMark: 100 },
            { subject: 'Education', score: Math.round(totals.education / totals.count), fullMark: 100 },
            { subject: 'Keywords', score: Math.round(totals.keywords / totals.count), fullMark: 100 },
        ];
   }

  return (
    // Wrap chart in MUI Paper
     <Paper elevation={2} sx={{ p: 2, height: 280 }}>
        <Typography variant="h6" component="div" sx={{ mb: 0 }}>
            Average Score Breakdown
        </Typography>
         {(!results || results.length === 0) ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="80%">
               <Typography color="text.secondary">No data available</Typography>
            </Box>
        ) : (
            <ResponsiveContainer width="100%" height="90%">
                <RadarChart cx="50%" cy="55%" outerRadius="75%" data={data}>
                    <PolarGrid stroke="rgba(0, 0, 0, 0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }}/>
                    <Radar name="Avg Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip wrapperStyle={{ fontSize: '12px' }}/>
                    {/* <Legend wrapperStyle={{ fontSize: '12px' }} verticalAlign="top" height={30}/> */}
                </RadarChart>
            </ResponsiveContainer>
        )}
    </Paper>
  );
};

export default AverageBreakdownChart;