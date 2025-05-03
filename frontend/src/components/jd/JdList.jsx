import React, { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material'; // Removed Paper import
import AddIcon from '@mui/icons-material/Add';
import { addJd, deleteJd } from '../../services/jdService';
import JdCard from './JdCard';
import AddJdModal from './AddJdModal';
import LoadingSpinner from '../common/LoadingSpinner';

const JdList = ({ jds, setJds, selectedJdIds, onSelectionChange, showAddButton = true }) => {
  const [isLoading, setIsLoading] = useState(false); // For delete/add ops ONLY if showAddButton is true
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

   // handleAddJd and handleDeleteJd only relevant if showAddButton is true
   const handleAddJd = async (newJdData) => {
        if (!showAddButton) return; // Shouldn't be called, but safe check
        // ... rest of add logic ...
        setIsLoading(true);
        setError('');
        try {
            const addedJd = await addJd(newJdData);
            setJds(prevJds => [...prevJds, addedJd]);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error adding JD:", err)
            setError(err.message || "Failed to add JD")
        } finally {
            setIsLoading(false);
        }
   };

   const handleDeleteJd = async (id) => {
       if (!showAddButton) return; // Only allow delete from Admin page
        // ... rest of delete logic ...
        setError('');
        setIsLoading(true);
        try {
            await deleteJd(id);
            setJds(prevJds => prevJds.filter(jd => jd.id !== id));
            onSelectionChange(selectedJdIds.filter(selectedId => selectedId !== id));
        } catch (err) {
            setError(`Failed to delete JD: ${err.message || 'Unknown error'}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
   };

  const handleToggleSelection = (id) => {
     // Mapping page expects single selection, Admin page doesn't care
     if (onSelectionChange) {
       // Simplified for single selection: always replace
       const newSelection = selectedJdIds.includes(id) ? [] : [id]; // Toggle or select new
       onSelectionChange(newSelection);
     }
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}> {/* Ensure Box takes height */}
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        {/* Optional: Title can be added by parent page */}
        {showAddButton && (
          <Button
            variant="contained" // Make Add button more prominent on Admin page
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
          >
            Add New JD
          </Button>
        )}
      </Box>

      {/* Loading/Error for Admin operations */}
      {showAddButton && isLoading && <Box sx={{my:1}}><LoadingSpinner message="Processing..." /></Box>}
      {showAddButton && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

       {/* Instructions / Empty State */}
       {!showAddButton && jds?.length > 0 && ( // Show selection text only on mapping page
         <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            Click a Job Description below to select it for analysis.
         </Typography>
      )}
        {(!jds || jds.length === 0) && (
            <Typography color="text.secondary" align="center" sx={{ p: 2, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {showAddButton ? "No Job Descriptions found. Add one!" : "No Job Descriptions available."}
            </Typography>
        )}


      {/* Scrollable List Area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5, mt: (!showAddButton && jds?.length > 0) ? 0 : 1 }}>
        {jds?.map(jd => (
          <JdCard
            key={jd.id}
            jd={jd}
            onDelete={showAddButton ? handleDeleteJd : undefined} // Only pass delete if on admin page
            onSelect={handleToggleSelection}
            isSelected={selectedJdIds.includes(jd.id)}
            showDeleteButton={showAddButton} // Tell card whether to show delete
          />
        ))}
      </Box>

      {/* Modal (only rendered if needed) */}
      {showAddButton && (
        <AddJdModal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setError(''); }}
            onAdd={handleAddJd}
            isAdding={isLoading}
            addError={error}
        />
      )}
    </Box>
  );
};

export default JdList;