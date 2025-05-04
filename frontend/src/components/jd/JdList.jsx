import React, { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { addJd, deleteJd } from '../../services/jdService';
import JdCard from './JdCard';
import AddJdModal from './AddJdModal';
import LoadingSpinner from '../common/LoadingSpinner';
import ViewJdDialog from './ViewJdDialog'; // Import the new dialog

const JdList = ({ jds, setJds, selectedJdIds, onSelectionChange, showAddButton = true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // --- State for View Dialog ---
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [jdToView, setJdToView] = useState(null);
  // --- End State for View Dialog ---

   const handleAddJd = async (newJdData) => {
       // ... add logic remains same ...
        if (!showAddButton) return;
        setIsLoading(true);
        setError('');
        try {
            const addedJd = await addJd(newJdData);
            setJds(prevJds => [...prevJds, addedJd]);
            setIsAddModalOpen(false);
        } catch (err) {
            console.error("Error adding JD:", err)
            setError(err.message || "Failed to add JD")
        } finally {
            setIsLoading(false);
        }
   };

   const handleDeleteJd = async (id) => {
       // ... delete logic remains same ...
        if (!showAddButton) return;
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
    if (onSelectionChange) {
       const newSelection = selectedJdIds.includes(id) ? [] : [id];
       onSelectionChange(newSelection);
     }
  };

  // --- Handler for View Details ---
  const handleViewDetails = (jd) => {
      setJdToView(jd);
      setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
      setIsViewDialogOpen(false);
      setJdToView(null); // Clear selected JD
  };
  // --- End Handler ---


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        {showAddButton && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
            disabled={isLoading}
          >
            Add New JD
          </Button>
        )}
      </Box>

      {showAddButton && isLoading && <Box sx={{my:1}}><LoadingSpinner message="Processing..." /></Box>}
      {showAddButton && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

       {!showAddButton && jds?.length > 0 && (
         <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            Click a Job Description below to select it. Use the <VisibilityIcon sx={{fontSize: 'inherit', verticalAlign: 'bottom'}}/> icon to view details.
         </Typography>
      )}
        {(!jds || jds.length === 0) && (
            <Typography color="text.secondary" align="center" sx={{ p: 2, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {showAddButton ? "No Job Descriptions found. Add one!" : "No Job Descriptions available."}
            </Typography>
        )}

      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5, mt: (!showAddButton && jds?.length > 0) ? 0 : 1 }}>
        {jds?.map(jd => (
          <JdCard
            key={jd.id}
            jd={jd}
            onDelete={showAddButton ? handleDeleteJd : undefined}
            onSelect={handleToggleSelection}
            isSelected={selectedJdIds.includes(jd.id)}
            showDeleteButton={showAddButton}
            onViewDetails={handleViewDetails} // Pass the handler down
          />
        ))}
      </Box>

      {/* Add Modal */}
      {showAddButton && (
        <AddJdModal
            isOpen={isAddModalOpen}
            onClose={() => { setIsAddModalOpen(false); setError(''); }}
            onAdd={handleAddJd}
            isAdding={isLoading}
            addError={error}
        />
      )}

       {/* View Details Dialog */}
       <ViewJdDialog
           open={isViewDialogOpen}
           onClose={handleCloseViewDialog}
           jd={jdToView}
        />

    </Box>
  );
};

// Need to import VisibilityIcon if using it in the helper text
import VisibilityIcon from '@mui/icons-material/Visibility';

export default JdList;