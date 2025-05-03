import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Alert, Box
} from '@mui/material';

// Receive isAdding and addError as props from JdList
const AddJdModal = ({ isOpen, onClose, onAdd, isAdding, addError }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [internalError, setInternalError] = useState('');

  // Clear form when modal opens or closes
  useEffect(() => {
      if (!isOpen) {
          setTitle('');
          setDescription('');
          setInternalError('');
      }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInternalError(''); // Clear local validation error
    if (!title || !description) {
        setInternalError('Title and Description are required.');
        return;
    }
    // onAdd function now handles API call and its loading/error state
    await onAdd({ title, description });
    // If onAdd is successful, the parent (JdList) will close the modal.
    // If it fails, JdList keeps the modal open and passes the error via addError.
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Job Description</DialogTitle>
      <DialogContent>
        {(addError || internalError) && <Alert severity="error" sx={{ mb: 2 }}>{addError || internalError}</Alert>}
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
          disabled={isAdding}
        />
        <TextField
          margin="dense"
          id="jd-description"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isAdding}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isAdding} color="inherit">
          Cancel
        </Button>
        <Box sx={{ position: 'relative' }}> {/* Wrapper for spinner */}
            <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={isAdding}
                >
                Add JD
            </Button>
            {isAdding && (
            <CircularProgress
                size={24}
                sx={{
                color: 'primary.main',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
                }}
            />
            )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddJdModal;