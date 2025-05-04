import React, { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { addJd, deleteJd, updateJd } from '../../services/jdService';
import JdCard from './JdCard';
import AddJdModal from './AddJdModal';
import ViewJdDialog from './ViewJdDialog';
import LoadingSpinner from '../common/LoadingSpinner';

const JdList = ({
    jds, setJds, selectedJdIds, onSelectionChange,
    showAddButton = true,
    allowSelection = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [jdToEdit, setJdToEdit] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [jdToView, setJdToView] = useState(null);

  const handleOpenAddModal = () => { /* ... */ setIsEditMode(false); setJdToEdit(null); setError(''); setIsModalOpen(true); };
  const handleOpenEditModal = (jd) => { /* ... */ setIsEditMode(true); setJdToEdit(jd); setError(''); setIsModalOpen(true); };
  const handleCloseModal = () => { /* ... */ setIsModalOpen(false); setJdToEdit(null); setError(''); };

  const handleSaveJd = async (formData) => {
    // ... Combined Add/Update logic ...
    setIsLoading(true); setError('');
    try {
        let savedJd;
        if (isEditMode && jdToEdit) {
            savedJd = await updateJd(jdToEdit.id, formData);
            setJds(prevJds => prevJds.map(jd => jd.id === savedJd.id ? savedJd : jd));
            console.log("JdList: JD Updated successfully"); // Debug Log
        } else {
            savedJd = await addJd(formData);
            setJds(prevJds => [...prevJds, savedJd]);
            console.log("JdList: JD Added successfully"); // Debug Log
        }
        handleCloseModal();
    } catch (err) {
        console.error(`JdList: Error ${isEditMode ? 'updating' : 'adding'} JD:`, err);
        setError(err.message || `Failed to ${isEditMode ? 'update' : 'add'} JD`);
    } finally { setIsLoading(false); }
  };

  const handleDeleteJd = async (id) => {
       // ... Delete logic ...
        if (!showAddButton) return;
        setError(''); setIsLoading(true);
        try {
            await deleteJd(id);
            setJds(prevJds => prevJds.filter(jd => jd.id !== id));
            if(allowSelection) { onSelectionChange(selectedJdIds.filter(selectedId => selectedId !== id)); }
            console.log("JdList: JD Deleted successfully"); // Debug Log
        } catch (err) {
            setError(`Failed to delete JD: ${err.message || 'Unknown error'}`);
            console.error(err);
        } finally { setIsLoading(false); }
  };

  const handleToggleSelection = (id) => {
     // ... Selection logic ...
     if (allowSelection && onSelectionChange) {
       const newSelection = selectedJdIds.includes(id) ? [] : [id];
       onSelectionChange(newSelection);
     }
  };

  // --- Handler for View Details ---
  const handleViewDetails = (jd) => {
      console.log("JdList: handleViewDetails called for:", jd.title); // Debug Log
      setJdToView(jd);
      setIsViewDialogOpen(true);
  };
  const handleCloseViewDialog = () => { setIsViewDialogOpen(false); setJdToView(null); };
  // --- End Handler ---

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: showAddButton ? 2 : 1 }}>
        {showAddButton && ( <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleOpenAddModal} disabled={isLoading} > Add New JD </Button> )}
      </Box>

      {/* Loading/Error */}
      {isLoading && showAddButton && <Box sx={{my:1}}><LoadingSpinner message="Processing..." /></Box>}
      {error && showAddButton && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Instructions / Empty State */}
      {allowSelection && jds?.length > 0 && ( <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}> Click a Job Description below to select it. Use the <VisibilityIcon sx={{fontSize: 'inherit', verticalAlign: 'bottom'}}/> icon to view details. </Typography> )}
      {(!jds || jds.length === 0) && ( <Typography color="text.secondary" align="center" sx={{ p: 2, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> {showAddButton ? "No Job Descriptions found. Add one!" : "No Job Descriptions available."} </Typography> )}

      {/* List Area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5, mt: (allowSelection && jds?.length > 0) ? 0 : 1 }}>
        {jds?.map(jd => (
          <JdCard
            key={jd.id}
            jd={jd}
            // --- Ensure correct handlers are passed ---
            onDelete={showAddButton ? handleDeleteJd : undefined}
            onEdit={showAddButton ? handleOpenEditModal : undefined}
            onSelect={allowSelection ? handleToggleSelection : undefined}
            onViewDetails={handleViewDetails} // Pass view handler
            // --- End Handlers ---
            isSelected={allowSelection && selectedJdIds.includes(jd.id)}
            showDeleteButton={showAddButton}
            showEditButton={showAddButton}
          />
        ))}
      </Box>

      {/* Modals */}
      {showAddButton && (
        <AddJdModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveJd} isSaving={isLoading} saveError={error} isEditMode={isEditMode} initialData={jdToEdit} />
      )}
       <ViewJdDialog open={isViewDialogOpen} onClose={handleCloseViewDialog} jd={jdToView} />
    </Box>
  );
};

export default JdList;