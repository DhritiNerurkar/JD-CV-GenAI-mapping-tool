import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const JdCard = ({ jd, onDelete, onSelect, isSelected }) => {
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card selection when clicking delete
    if (window.confirm(`Are you sure you want to delete JD: "${jd.title}"?`)) {
      onDelete(jd.id);
    }
  };

  const handleSelect = () => {
    onSelect(jd.id);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1.5, // Margin bottom
        cursor: 'pointer',
        backgroundColor: isSelected ? 'action.selected' : 'background.paper',
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderWidth: isSelected ? 1.5 : 1, // Thicker border when selected
        '&:hover': {
          boxShadow: 2, // Add slight shadow on hover
          borderColor: isSelected ? 'primary.dark' : 'grey.400',
        }
      }}
      onClick={handleSelect}
    >
      <CardContent sx={{ pt: 1.5, pb: '12px !important' }}> {/* Adjust padding */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle1" component="div" fontWeight="medium">
              {jd.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {jd.description}
            </Typography>
          </Box>
          <IconButton
            size="small"
            color="error"
            onClick={handleDelete}
            aria-label={`Delete JD ${jd.title}`}
            sx={{ ml: 1, mt: -0.5 }} // Adjust positioning
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JdCard;