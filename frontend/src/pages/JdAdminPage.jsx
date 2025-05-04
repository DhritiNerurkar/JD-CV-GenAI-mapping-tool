import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import JdList from '../components/jd/JdList'; // Reusing JdList

// Receives initial JDs (current state from App) and the setter from App
const JdAdminPage = ({ initialJds, setJds }) => { // Props from App.jsx

  return (
    <Paper elevation={1} sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom>
        Manage Job Descriptions
      </Typography>
      <Typography paragraph color="text.secondary">
        Add new job descriptions or remove/edit existing ones using the buttons on each card. These JDs will be available in the JD-CV Mapping tab.
      </Typography>
      <Divider sx={{ my: 2 }} />
      {/* Pass the received prop (current list) as the 'jds' prop to JdList */}
      <JdList
        jds={initialJds} // Pass the current list received from App
        setJds={setJds} // Pass the setter function down
        selectedJdIds={[]} // No selection state needed here
        onSelectionChange={() => {}} // No selection action needed here
        showAddButton={true} // Show Add button and enable Edit/Delete
        allowSelection={false} // Disable selection click behavior
      />
    </Paper>
  );
};

export default JdAdminPage;