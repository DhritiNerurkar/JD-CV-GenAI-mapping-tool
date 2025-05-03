import React from 'react';
import { Card, CardActionArea, CardContent, Typography, IconButton, Box, Tooltip } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // Different Icon

// Added showDeleteButton prop
const JdCard = ({ jd, onDelete, onSelect, isSelected, showDeleteButton }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && window.confirm(`Are you sure you want to delete JD: "${jd.title}"?`)) {
      onDelete(jd.id);
    }
  };

  // No need for separate handler, CardActionArea handles click
  // const handleSelect = () => {
  //   onSelect(jd.id);
  // };

  return (
    // Card provides the border/background defined in theme
    <Card
       variant="outlined" // Use theme's default variant
       sx={{
        mb: 1.5,
        borderColor: isSelected ? 'primary.main' : undefined, // Highlight border if selected
        backgroundColor: isSelected ? 'action.selected' : undefined, // Highlight background if selected
        // Hover effects managed by CardActionArea and theme overrides
       }}
    >
      {/* CardActionArea makes the whole card clickable with ripple */}
      <CardActionArea onClick={() => onSelect(jd.id)} sx={{ p: 1.5 }}> {/* Padding inside ActionArea */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Text Content */}
          <Box sx={{ overflow: 'hidden', mr: 1 }}> {/* Prevent text overflow */}
            <Tooltip title={jd.title} placement="top-start">
                 <Typography variant="subtitle1" noWrap fontWeight="medium">
                    {jd.title}
                 </Typography>
             </Tooltip>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {jd.description}
            </Typography>
          </Box>

          {/* Delete Button (Conditional) */}
          {showDeleteButton && (
            <Tooltip title="Delete JD">
                <IconButton
                    size="small"
                    color="error"
                    onClick={handleDelete}
                    aria-label={`Delete JD ${jd.title}`}
                    sx={{
                        ml: 1,
                        mt: -0.5, // Align better
                        color: 'error.light', // Lighter red
                         '&:hover': {
                            color: 'error.main', // Darker on hover
                            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
                         }
                    }}
                >
                    <DeleteForeverIcon fontSize="small" />
                </IconButton>
             </Tooltip>
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default JdCard;