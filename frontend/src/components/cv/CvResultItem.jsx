import React from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, Box, Chip, List, ListItem, ListItemIcon, ListItemText, Grid, Paper, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CircularScoreIndicator from '../common/CircularScoreIndicator'; // Import the updated component

const getScoreChipProps = (score) => {
    // Use Filled variant for overall score chip in header
    if (score >= 85) return { color: 'success', variant: 'filled' };
    if (score >= 65) return { color: 'warning', variant: 'filled' };
    return { color: 'error', variant: 'filled' };
};

const CvResultItem = ({ analysis, rank }) => {
  if (!analysis) return null;

  const overallScore = analysis.overall_score ?? 0;
  const chipProps = getScoreChipProps(overallScore);

  const breakdownScores = [
      { label: 'Skills', value: analysis.skills_match_score },
      { label: 'Experience', value: analysis.experience_relevance_score },
      { label: 'Education', value: analysis.education_fit_score },
      { label: 'Keywords', value: analysis.keyword_alignment_score },
  ];

  return (
    <Accordion sx={{ mb: 1.5, '&:before': { display: 'none' }, borderRadius: 2, overflow: 'hidden' }} elevation={1} defaultExpanded={rank === 1} /* Optionally expand the first item */ >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${rank}-content`}
        id={`panel${rank}-header`}
        sx={{
          '& .MuiAccordionSummary-content': { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', },
          bgcolor: 'action.hover', borderBottom: 1, borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', pr: 1 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mr: 1.5, minWidth: '30px', textAlign: 'right', fontWeight: 'medium' }}>
            #{rank}
          </Typography>
          <Typography variant="body1" noWrap sx={{ mr: 1, fontWeight: 'medium' }} title={analysis.cv_filename}>
            {analysis.cv_filename}
          </Typography>
        </Box>
        <Chip
          label={`${overallScore}/100`}
          color={chipProps.color}
          variant={chipProps.variant}
          size="medium" // Slightly larger chip
          sx={{ fontWeight: 'bold' }}
        />
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: 'background.paper', p: {xs: 1.5, sm: 2.5} }}> {/* Responsive padding */}

         <Grid container spacing={3} alignItems="center" sx={{mb: 2.5}}>
            {/* Left side: Overall score circle */}
            <Grid item xs={12} sm={4} md={3} sx={{display: 'flex', justifyContent: 'center'}}>
                 <CircularScoreIndicator
                    score={overallScore}
                    size={100} // Larger size for overall score
                    scoreVariant="h5" // Larger font for score
                    scoreWeight="medium"
                    label="Overall Match"
                    labelVariant="body2"
                 />
            </Grid>
             {/* Right side: Reasoning */}
             <Grid item xs={12} sm={8} md={9}>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }} color="text.secondary">
                    "{(analysis.reasoning && analysis.reasoning.trim() !== '') ? analysis.reasoning : 'No reasoning provided.'}"
                </Typography>
             </Grid>
         </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Circular Breakdown Scores */}
        <Typography variant="h6" sx={{ mb: 1.5, textAlign: 'center' }}>Score Breakdown</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', flexWrap: 'wrap', mb: 2.5 }}>
            {breakdownScores.map(item => (
                 <CircularScoreIndicator
                    key={item.label}
                    score={item.value ?? 0}
                    label={item.label}
                    size={65} // Smaller size for breakdown
                 />
            ))}
        </Box>

         <Divider sx={{ my: 2 }} />

        {/* Highlights & Gaps */}
        <Grid container spacing={3}>
            {/* Highlights Column */}
            <Grid item xs={12} md={6}>
                 <Typography variant="h6" gutterBottom sx={{ color: 'success.dark' }}>
                     Key Highlights
                 </Typography>
                {(analysis.key_highlights && analysis.key_highlights.length > 0) ? (
                    <List dense disablePadding>
                    {analysis.key_highlights.map((item, index) => (
                        <ListItem key={`hl-${index}`} disableGutters sx={{ py: 0.1, alignItems: 'flex-start' }}>
                            <ListItemIcon sx={{ minWidth: 28, color: 'success.main', mt: '4px' }}><CheckCircleOutlineIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItem>
                    ))}
                    </List>
                ) : (
                     <Typography variant="body2" color="text.secondary" sx={{pl: 3.5}}>None identified.</Typography> // Indent slightly
                )}
            </Grid>

             {/* Gaps Column */}
             <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ color: 'error.dark' }}>
                    Potential Gaps
                </Typography>
                 {(analysis.skill_gaps && analysis.skill_gaps.length > 0) ? (
                    <List dense disablePadding>
                    {analysis.skill_gaps.map((item, index) => (
                        <ListItem key={`gap-${index}`} disableGutters sx={{ py: 0.1, alignItems: 'flex-start' }}>
                            <ListItemIcon sx={{ minWidth: 28, color: 'error.main', mt: '4px' }}><ErrorOutlineIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItem>
                    ))}
                    </List>
                 ) : (
                      <Typography variant="body2" color="text.secondary" sx={{pl: 3.5}}>None identified.</Typography> // Indent slightly
                 )}
            </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default CvResultItem;