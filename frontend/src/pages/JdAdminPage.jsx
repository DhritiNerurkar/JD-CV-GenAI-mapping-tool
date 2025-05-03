import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import JdList from '../components/jd/JdList'; // Reusing JdList

// Receives initial JDs and the setter from App
const JdAdminPage = ({ initialJds, setJds }) => {

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, md: 3 } }}> {/* Add responsive padding */}
      <Typography variant="h4" gutterBottom>
        Manage Job Descriptions
      </Typography>
      <Typography paragraph color="text.secondary">
        Add new job descriptions or remove existing ones. These will be available in the JD-CV Mapping tab.
      </Typography>
      <JdList
        jds={initialJds}
        setJds={setJds} // Pass the setter down so JdList can update App's state
        selectedJdIds={[]} // No selection needed on this page
        onSelectionChange={() => {}} // No-op selection change
        showAddButton={true} // Explicitly show add button
      />
    </Paper>
  );
};

export default JdAdminPage;