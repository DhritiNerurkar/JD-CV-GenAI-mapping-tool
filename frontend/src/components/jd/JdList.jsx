import React, { useState } from 'react'; // Removed useEffect for fetch
import { Box, Typography, Button, Alert, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { addJd, deleteJd } from '../../services/jdService';
import JdCard from './JdCard';
import AddJdModal from './AddJdModal';
import LoadingSpinner from '../common/LoadingSpinner';

// Added showAddButton prop, default to true for backward compatibility if needed
const JdList = ({ jds, setJds, selectedJdIds, onSelectionChange, showAddButton = true }) => {
  const [isLoading, setIsLoading] = useState(false); // For delete/add ops
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // handleAddJd and handleDeleteJd remain the same as before
   const handleAddJd = async (newJdData) => {
    setIsLoading(true);
    setError('');
    try {
        const addedJd = await addJd(newJdData);
        // Use the setter passed from the parent (App or JdAdminPage)
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
    setError('');
    setIsLoading(true);
    try {
      await deleteJd(id);
      // Use the setter passed from the parent
      setJds(prevJds => prevJds.filter(jd => jd.id !== id));
      // Update selection in the parent (MappingPage)
      onSelectionChange(selectedJdIds.filter(selectedId => selectedId !== id));
    } catch (err) {
      setError(`Failed to delete JD: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
        setIsLoading(false);
    }
  };


  const handleToggleSelection = (id) => {
    // Only call selection change if the callback exists (for Mapping Page)
    if (onSelectionChange) {
        const newSelection = selectedJdIds.includes(id)
          ? selectedJdIds.filter(selectedId => selectedId !== id)
          : [...selectedJdIds, id];
        onSelectionChange(newSelection);
    }
  };


  return (
    // Removed outer Paper, assuming parent page provides it
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {/* Conditionally render title based on context? Or keep generic */}
        {/* <Typography variant="h6">Job Descriptions</Typography> */}
        {showAddButton && ( // Conditionally render Add button
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading} // Disable if delete is happening
          >
            Add JD
          </Button>
        )}
      </Box>

      {isLoading && <LoadingSpinner message="Processing..." />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Display logic remains similar */}
      {!isLoading && (!jds || jds.length === 0) && !error && (
        <Typography color="text.secondary" align="center" sx={{ p: 2 }}>
           {showAddButton ? "No Job Descriptions found. Add one!" : "No Job Descriptions available."}
        </Typography>
      )}

       {jds?.length > 0 && !showAddButton && ( // Show selection text only on mapping page
         <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Select JD(s) to analyze CVs against:
         </Typography>
      )}

      <Box sx={{ maxHeight: showAddButton ? 400 : 350, overflowY: 'auto', pr: 1 }}>
        {jds?.map(jd => (
          <JdCard
            key={jd.id}
            jd={jd}
            onDelete={handleDeleteJd}
            onSelect={handleToggleSelection}
            isSelected={selectedJdIds.includes(jd.id)}
            // Conditionally disable selection interaction if needed?
          />
        ))}
      </Box>

      {/* Modal is only relevant if Add button is shown */}
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