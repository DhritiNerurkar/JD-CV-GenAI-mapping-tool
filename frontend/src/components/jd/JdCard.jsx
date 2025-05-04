import React from 'react';
import {
    Card, CardActionArea, CardContent, Typography, IconButton, Box, Tooltip, Button, alpha // Added Button
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Icon for view button

// Added showDeleteButton and onViewDetails props
const JdCard = ({ jd, onDelete, onSelect, isSelected, showDeleteButton, onViewDetails }) => {

  const descriptionText = jd?.description || 'No description available.';

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card selection
    if (onDelete && window.confirm(`Are you sure you want to delete JD: "${jd.title}"?`)) {
      onDelete(jd.id);
    }
  };

   const handleViewClick = (e) => {
    e.stopPropagation(); // Prevent card selection
    onViewDetails(jd); // Pass the full JD object up
  };

  return (
    <Card
       variant="outlined"
       sx={{
        mb: 1.5,
        borderColor: isSelected ? 'primary.main' : undefined,
        backgroundColor: isSelected ? (theme) => alpha(theme.palette.primary.main, 0.08) : undefined,
        borderWidth: isSelected ? 1.5 : 1,
       }}
    >
      {/* --- REMOVED Tooltip Wrapper --- */}
      {/* Use CardActionArea primarily for selection highlighting/ripple */}
      <CardActionArea onClick={() => onSelect(jd.id)} sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Text Content */}
          <Box sx={{ overflow: 'hidden', mr: 1, flexGrow: 1 /* Allow text to take space */ }}>
            <Typography variant="subtitle1" noWrap fontWeight="medium" title={jd.title}>
                {jd.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {descriptionText}
            </Typography>
          </Box>

           {/* Action Buttons Area */}
           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 1, flexShrink: 0 /* Prevent shrinking */ }}>
                {/* View Details Button */}
                <Tooltip title="View Full Description">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={handleViewClick}
                        aria-label={`View details for JD ${jd.title}`}
                        sx={{ mb: showDeleteButton ? 0.5 : 0 /* Add margin if delete button exists */, '&:hover': { backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1)} }}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                {/* Delete Button (Conditional) */}
                {showDeleteButton && (
                    <Tooltip title="Delete JD">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={handleDelete}
                            aria-label={`Delete JD ${jd.title}`}
                            sx={{ color: 'error.light', '&:hover': { color: 'error.main', backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1)} }}
                        >
                            <DeleteForeverIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
           </Box> {/* End Action Buttons Area */}

        </Box>
      </CardActionArea>
    </Card>
  );
};

export default JdCard;