import React from 'react';
import {
    Card, CardActionArea, CardContent, Typography, IconButton, Box, Tooltip, Button, alpha
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const JdCard = ({
    jd,
    onDelete,
    onSelect,
    isSelected,
    showDeleteButton,
    showEditButton,
    onViewDetails,
    onEdit
 }) => {

  const descriptionText = jd?.description || 'No description available.';

  // --- Handlers with event stopping ---
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent CardActionArea click
    if (onDelete && window.confirm(`Are you sure you want to delete JD: "${jd.title}"?`)) {
      console.log("JdCard: Calling onDelete for ID:", jd.id); // Debug Log
      onDelete(jd.id);
    }
  };

   const handleViewClick = (e) => {
    e.stopPropagation(); // Prevent CardActionArea click
    if (onViewDetails) {
        console.log("JdCard: Calling onViewDetails for JD:", jd); // Debug Log
        onViewDetails(jd);
    }
  };

   const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent CardActionArea click
    if (onEdit) {
        console.log("JdCard: Calling onEdit for JD:", jd); // Debug Log
        onEdit(jd);
    }
   };
   // --- End Handlers ---


  // Determine if the card itself should be interactive (for selection)
  const isCardSelectable = typeof onSelect === 'function';

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
      {/* CardActionArea is only really needed if the card is selectable */}
      {/* We can conditionally wrap or just use a Box and handle clicks separately */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 1.5 }}>

          {/* Text Content */}
          {/* Make text area clickable for selection if enabled */}
          <Box
             sx={{
                 overflow: 'hidden', mr: 1, flexGrow: 1,
                 cursor: isCardSelectable ? 'pointer' : 'default', // Change cursor if selectable
                 '&:hover': isCardSelectable ? { opacity: 0.9 } : {}, // Slight hover effect if selectable
             }}
             onClick={isCardSelectable ? () => onSelect(jd.id) : undefined} // Selection click on text area
            >
            <Typography variant="subtitle1" noWrap fontWeight="medium" title={jd.title}>
                {jd.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {descriptionText}
            </Typography>
          </Box>

           {/* Action Buttons Area */}
           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 1, flexShrink: 0 }}>
                {/* View Details Button */}
                {onViewDetails && (
                    <Tooltip title="View Full Description">
                        {/* Ensure onClick is correctly passed and called */}
                        <IconButton size="small" color="primary" onClick={handleViewClick} aria-label={`View details for JD ${jd.title}`} sx={{ mb: (showEditButton || showDeleteButton) ? 0.5 : 0, '&:hover': { backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1)} }}>
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

                {/* Edit Button (Conditional) */}
                {showEditButton && onEdit && (
                    <Tooltip title="Edit JD">
                         {/* Ensure onClick is correctly passed and called */}
                         <IconButton size="small" color="secondary" onClick={handleEditClick} aria-label={`Edit JD ${jd.title}`} sx={{ mb: showDeleteButton ? 0.5 : 0, '&:hover': { backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.1)} }}>
                            <EditIcon fontSize="small" />
                         </IconButton>
                     </Tooltip>
                )}

                {/* Delete Button (Conditional) */}
                {showDeleteButton && onDelete && (
                    <Tooltip title="Delete JD">
                        {/* Ensure onClick is correctly passed and called */}
                        <IconButton size="small" color="error" onClick={handleDelete} aria-label={`Delete JD ${jd.title}`} sx={{ color: 'error.light', '&:hover': { color: 'error.main', backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1)} }}>
                            <DeleteForeverIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
           </Box> {/* End Action Buttons Area */}

      </Box> {/* End Main Flex Box */}
    </Card>
  );
};

export default JdCard;