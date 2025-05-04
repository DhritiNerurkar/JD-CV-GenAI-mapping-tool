import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ViewJdDialog = ({ open, onClose, jd }) => {
  if (!jd) return null; // Don't render if no JD data

  return (
    <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md" // Make dialog reasonably wide
        aria-labelledby="jd-dialog-title"
    >
      <DialogTitle sx={{ m: 0, p: 2, pr: 8 /* Space for close button */ }} id="jd-dialog-title">
        {jd.title || "Job Description Details"}
      </DialogTitle>
      {/* Absolute positioned close button */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers /* Add dividers for better separation */ >
         {/* Use Typography with pre-line to respect line breaks in the description */}
        <Typography gutterBottom sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
          {jd.description || "No description available."}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewJdDialog;