import React from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, Box, Chip,
  List, ListItem, ListItemIcon, ListItemText, Grid, Paper, Divider, alpha,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CircularScoreIndicator from '../common/CircularScoreIndicator';
// Ensure ScoreBreakdown is NOT imported if rendering circles directly here
// import ScoreBreakdown from './ScoreBreakdown';

const getScoreChipProps = (score) => {
  if (score >= 85) return { color: 'success', variant: 'filled' };
  if (score >= 65) return { color: 'warning', variant: 'filled' };
  return { color: 'error', variant: 'filled' };
};

// renderListItem helper
const renderListItem = (item, index, type, lastIndex) => (
  <ListItem
    key={`${type}-${index}-${item.substring(0, 10)}`}
    disableGutters
    sx={{
      py: 0.75,
      alignItems: 'flex-start',
      borderBottom: index < lastIndex ? '1px dashed' : 'none',
      borderColor: 'divider',
    }}
  >
    <ListItemIcon sx={{ minWidth: 32, color: `${type === 'hl' ? 'success' : 'error'}.main`, mt: '4px' }}>
      {type === 'hl' ?
        <CheckCircleOutlineIcon fontSize="small" /> :
        <ErrorOutlineIcon fontSize="small" />
      }
    </ListItemIcon>
    <ListItemText
      primary={item}
      primaryTypographyProps={{ variant: 'body2', sx: { wordBreak: 'break-word' } }}
    />
  </ListItem>
);


const CvResultItem = ({ analysis, rank }) => {
  const theme = useTheme();
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
    // Key added to Accordion for potential rendering improvements
    <Accordion key={`accordion-${rank}-${analysis.cv_filename}`} sx={{ mb: 2 }} defaultExpanded={rank === 1}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${rank}-content`}
        id={`panel${rank}-header`}
        sx={{ '& .MuiAccordionSummary-content': { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' } }}
      >
        {/* Header Content */}
        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', pr: 1 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mr: 1.5, minWidth: '30px', textAlign: 'right', fontWeight: 'medium' }}>
            #{rank}
          </Typography>
          <Typography variant="body1" noWrap sx={{ mr: 1, fontWeight: 'medium' }} title={analysis.cv_filename}>
            {analysis.cv_filename}
          </Typography>
        </Box>
        <Chip label={`${overallScore}/100`} color={chipProps.color} variant={chipProps.variant} size="medium" sx={{ fontWeight: 'bold' }} />
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0, bgcolor: 'background.paper' }}>

          {/* --- Section 1: Overall Score & Reasoning (Side-by-Side) --- */}
          <Box sx={{ p: { xs: 2, sm: 5 } }}>
            <Grid
            container
            spacing={8}
            alignItems="center"
            wrap="nowrap"
            sx={{ mb: 2.5 }}
            >
            {/* --- Score Indicator --- */}
            <Grid item sx={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                <CircularScoreIndicator
                key={`overall-score-${rank}`}
                score={overallScore}
                size={180}
                scoreVariant="h5"
                scoreWeight="medium"
                label="Overall Match"
                labelVariant="body5"
                />
            </Grid>

            {/* --- Reasoning Box --- */}
            <Grid item xs>
                <Box
                sx={{
                    p: 5,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                    borderRadius: (theme) => theme.shape.borderRadius,
                    border: 8,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                }}
                >
                <Typography
                    variant="body6"
                    color="text.secondary"
                    sx={{ fontStyle: 'italic' }}
                >
                    "{analysis.reasoning?.trim() ? analysis.reasoning : 'No reasoning provided.'}"
                </Typography>
                </Box>
            </Grid>
            </Grid>
        </Box>
          {/* --- End Section 1 --- */}

          <Divider />

          {/* --- Section 2: Score Breakdown (Circular Indicators) --- */}
          <Box sx={{ p: {xs: 2, sm: 2} }}>
            <Typography variant="h6" sx={{ mb: 0.5 /* Increased margin */, textAlign: 'center' }}>Score Breakdown</Typography>
            <Grid container spacing={1} justifyContent="center" alignItems="flex-start">
                {breakdownScores.map(item => (
                    <Grid item xs={6} sm={3} key={item.label} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularScoreIndicator
                            key={`breakdown-${item.label}-${rank}`} // Add key
                            score={item.value ?? 0}
                            label={item.label}
                            size={115}
                            scoreVariant="body1"
                         />
                    </Grid>
                ))}
            </Grid>
          </Box>
          {/* --- End Section 2 --- */}

          {/* --- Section 3: Highlights & Gaps (Flexbox Approach) --- */}
           <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, bgcolor: 'background.default', borderTop: 1, borderColor: 'divider' }}>
                {/* Highlights Column */}
                <Box sx={{ width: { xs: '100%', md: '50%' }, p: { xs: 2, sm: 3 }, borderBottom: { xs: 1, md: 0 }, borderRight: { xs: 0, md: 1 }, borderColor: 'divider', boxSizing: 'border-box' }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'success.dark', display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <CheckCircleOutlineIcon sx={{ mr: 1, fontSize: '1.2rem' }} /> Key Highlights
                    </Typography>
                    <Paper variant='outlined' sx={{ bgcolor: 'background.paper', p: 2, minHeight: 120 }}>
                         {(analysis.key_highlights && analysis.key_highlights.length > 0) ? ( <List dense disablePadding>{analysis.key_highlights.map((item, index) => ( renderListItem(item, index, 'hl', analysis.key_highlights.length - 1) ))}</List>) : ( <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>None identified.</Typography> )}
                    </Paper>
                </Box>
                {/* Gaps Column */}
                <Box sx={{ width: { xs: '100%', md: '50%' }, p: { xs: 2, sm: 3 }, boxSizing: 'border-box' }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'error.dark', display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <ErrorOutlineIcon sx={{ mr: 1, fontSize: '1.2rem' }}/> Potential Gaps
                    </Typography>
                    <Paper variant='outlined' sx={{ bgcolor: 'background.paper', p: 2, minHeight: 120 }}>
                        {(analysis.skill_gaps && analysis.skill_gaps.length > 0) ? ( <List dense disablePadding>{analysis.skill_gaps.map((item, index) => ( renderListItem(item, index, 'gap', analysis.skill_gaps.length - 1) ))}</List> ) : ( <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>None identified.</Typography> )}
                    </Paper>
                </Box>
           </Box>
           {/* --- End Section 3 --- */}

      </AccordionDetails>
    </Accordion>
  );
};

export default CvResultItem;