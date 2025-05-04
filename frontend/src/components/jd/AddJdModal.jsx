import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Alert, Box
} from '@mui/material';

// Added isEditMode and initialData props
const AddJdModal = ({
  isOpen, onClose, onSave, // Renamed onAdd to onSave for clarity
  isSaving, // Renamed isAdding to isSaving
  saveError, // Renamed addError to saveError
  isEditMode = false, // Default to Add mode
  initialData = null // Data to pre-fill for editing
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [internalError, setInternalError] = useState('');

  // Effect to pre-fill form when opening in Edit mode
  useEffect(() => {
      if (isOpen && isEditMode && initialData) {
          setTitle(initialData.title || '');
          setDescription(initialData.description || '');
          setInternalError(''); // Clear previous errors
          console.log("Modal opened in Edit mode with data:", initialData);
      } else if (isOpen && !isEditMode) {
          // Clear form for Add mode
          setTitle('');
          setDescription('');
          setInternalError('');
          console.log("Modal opened in Add mode");
      }
  }, [isOpen, isEditMode, initialData]); // Re-run if these change while open (or on open)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInternalError('');
    if (!title || !description) {
        setInternalError('Title and Description are required.');
        return;
    }
    // Call the generic onSave handler passed from parent
    // Parent (JdList) will know whether to call addJd or updateJd
    await onSave({ title, description });
    // Parent will close modal on success
  };

  // Clear local error when modal is closed externally
   useEffect(() => {
      if (!isOpen) {
          setInternalError('');
      }
   }, [isOpen]);

  const modalTitle = isEditMode ? 'Edit Job Description' : 'Add New Job Description';
  const saveButtonText = isEditMode ? 'Save Changes' : 'Add JD';

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{modalTitle}</DialogTitle>
      <DialogContent>
        {(saveError || internalError) && <Alert severity="error" sx={{ mb: 2 }}>{saveError || internalError}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          id="jd-title"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSaving}
          sx={{ mb: 2 }} // Add margin bottom
        />
        <TextField
          margin="dense"
          id="jd-description"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={8} // Increased rows slightly
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isSaving}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSaving} color="inherit">
          Cancel
        </Button>
        <Box sx={{ position: 'relative' }}>
            <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={isSaving}
                >
                {isSaving ? 'Saving...' : saveButtonText}
            </Button>
            {isSaving && (
            <CircularProgress
                size={24}
                sx={{
                    color: 'primary.main',
                    position: 'absolute', top: '50%', left: '50%',
                    marginTop: '-12px', marginLeft: '-12px',
                }}
            />
            )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddJdModal;