import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Alert } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const CvDropzone = ({ onFilesAccepted }) => {
  const [droppedFilePaths, setDroppedFilePaths] = useState([]); // Keep track of names for display
  const [rejectionError, setRejectionError] = useState('');

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      console.log("CvDropzone: onDrop triggered."); // Debug Log
      console.log("CvDropzone: Accepted Files:", acceptedFiles); // Debug Log - Should be array of File objects
      console.log("CvDropzone: File Rejections:", fileRejections); // Debug Log

      // Update display list (optional, only needed for UI)
      setDroppedFilePaths(acceptedFiles.map(f => ({ path: f.path, size: f.size })));

      // *** Crucial: Pass the actual File objects array up ***
      onFilesAccepted(acceptedFiles);

      // Handle display of rejections
      if (fileRejections.length > 0) {
        const errors = fileRejections.map(({ file, errors }) => `${file.path}: ${errors.map(e => e.message).join(', ')}`).join('; ');
        setRejectionError(`Some files rejected (Only PDFs allowed). ${errors}`);
      } else {
        setRejectionError('');
      }
    },
    [onFilesAccepted] // Dependency array
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  // Use droppedFilePaths for display only
  const acceptedFileItems = droppedFilePaths.map((fileInfo) => (
    <ListItem key={fileInfo.path} dense>
      <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: 'success.main' }}>
        <CheckCircleIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={fileInfo.path}
        secondary={`${(fileInfo.size / 1024).toFixed(2)} KB`}
        primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
      />
    </ListItem>
  ));

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.default',
          transition: 'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.light',
          }
        }}
      >
        <input {...getInputProps()} />
        <UploadFileIcon sx={{ fontSize: 40, color: 'grey.600', mb: 1 }} />
        <Typography variant="body1" color="text.secondary">
          {isDragActive
            ? "Drop the PDF files here..."
            : "Drag 'n' drop CV PDFs here, or click"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          (Multiple PDFs accepted)
        </Typography>
      </Box>

      {rejectionError && (
        <Alert severity="warning" sx={{ mt: 1 }} variant="outlined"> {/* Changed to warning */}
          {rejectionError}
        </Alert>
      )}

      {acceptedFileItems.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>Accepted files:</Typography>
          <List dense sx={{ maxHeight: 150, overflowY: 'auto', bgcolor: 'grey.50', borderRadius: 1, p: 1 }}>
             {acceptedFileItems}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default CvDropzone;