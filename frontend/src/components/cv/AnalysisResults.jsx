import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl, InputLabel, Slider, Paper, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort'; // Example Icon
import CvResultItem from './CvResultItem';

const sortOptions = [
    { value: 'overall_score', label: 'Overall' },
    { value: 'skills_match_score', label: 'Skills' },
    { value: 'experience_relevance_score', label: 'Experience' },
    { value: 'education_fit_score', label: 'Education' },
    { value: 'keyword_alignment_score', label: 'Keywords' },
];

const AnalysisResults = ({ analysisData, jds }) => {
  const [selectedJdIdForView, setSelectedJdIdForView] = useState('');
  const [scoreFilter, setScoreFilter] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('overall_score'); // Default sort

  const analyzedJdIds = Object.keys(analysisData || {});
  const selectableJds = Array.isArray(jds) ? jds.filter(jd => analyzedJdIds.includes(jd.id)) : [];

  useEffect(() => {
    if (!selectedJdIdForView && selectableJds.length > 0) {
      setSelectedJdIdForView(selectableJds[0].id);
    } else if (selectedJdIdForView && !analyzedJdIds.includes(selectedJdIdForView)) {
      setSelectedJdIdForView(selectableJds.length > 0 ? selectableJds[0].id : '');
    }
  }, [analysisData, selectableJds, selectedJdIdForView]);

  const resultsForSelectedJd = analysisData?.[selectedJdIdForView] || [];

  const handleSliderChange = (event, newValue) => {
    setScoreFilter(newValue);
  };

  const handleSortChange = (event, newSortBy) => {
    if (newSortBy !== null) { // Prevent unselecting all buttons
        setSortBy(newSortBy);
    }
  };

  // Memoize filtered and sorted results
  const processedResults = useMemo(() => {
    return resultsForSelectedJd
      .filter(item =>
        (item.overall_score ?? 0) >= scoreFilter[0] && (item.overall_score ?? 0) <= scoreFilter[1]
      )
      .sort((a, b) => {
          const scoreA = a[sortBy] ?? 0; // Handle missing scores
          const scoreB = b[sortBy] ?? 0;
          return scoreB - scoreA; // Descending sort
      });
  }, [resultsForSelectedJd, scoreFilter, sortBy]); // Recalculate only when these change


  if (!analyzedJdIds || analyzedJdIds.length === 0) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 4, clear: 'both' }}> {/* Added margin-top and clear:both */}
      <Typography variant="h5" gutterBottom>Ranked Candidates</Typography>

      {/* Controls Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center', borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        {/* JD Selector */}
        <FormControl sx={{ minWidth: 250 }} size="small">
          <InputLabel id="jd-select-label-results">View results for</InputLabel>
          <Select
            labelId="jd-select-label-results"
            id="jd-select-results"
            value={selectedJdIdForView}
            label="View results for"
            onChange={(e) => setSelectedJdIdForView(e.target.value)}
            disabled={selectableJds.length === 0}
          >
            <MenuItem value="" disabled><em>-- Select JD --</em></MenuItem>
            {selectableJds.map(jd => (
              <MenuItem key={jd.id} value={jd.id}>{jd.title}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort Control */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>Sort by:</Typography>
            <ToggleButtonGroup
                value={sortBy}
                exclusive
                onChange={handleSortChange}
                aria-label="Sort results by"
                size="small"
            >
                {sortOptions.map(opt => (
                     <ToggleButton key={opt.value} value={opt.value} aria-label={opt.label} sx={{ textTransform: 'none', px: 1.5 }}>
                       {opt.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Box>


        {/* Score Filter (only if results exist) */}
        {resultsForSelectedJd.length > 0 && (
          <Box sx={{ flexGrow: 1, minWidth: 200 }}>
            <Typography id="score-range-slider-label" gutterBottom variant="body2" sx={{mb: -0.5, color: 'text.secondary'}}>
              Overall Score Range:
            </Typography>
            <Slider
              value={scoreFilter}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              aria-labelledby="score-range-slider-label"
              min={0}
              max={100}
              size="small"
              sx={{ ml: 1, mr: 2, verticalAlign: 'middle' }}
            />
          </Box>
        )}
      </Box>


      {/* Results List */}
      {selectedJdIdForView && processedResults.length > 0 && (
        <Box mt={1}>
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}>
             Displaying {processedResults.length} candidate(s)
          </Typography>
          {processedResults.map((analysis, index) => (
            <CvResultItem
              key={`${analysis.cv_filename}-${sortBy}-${index}`} // Key needs to be stable but unique
              analysis={analysis}
              rank={index + 1} // Rank based on sorted position
            />
          ))}
        </Box>
      )}

      {/* No results messages */}
       {selectedJdIdForView && resultsForSelectedJd.length > 0 && processedResults.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ mt: 3, p: 2 }}>
            No CVs match the current score filter for this JD.
        </Typography>
      )}
       {selectedJdIdForView && resultsForSelectedJd.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ mt: 3, p: 2 }}>
            No analysis results found for the selected Job Description.
        </Typography>
      )}
        {!selectedJdIdForView && selectableJds.length > 0 && (
           <Typography color="text.secondary" align="center" sx={{ mt: 3, p: 2 }}>
                Please select a Job Description above to view results.
           </Typography>
       )}

    </Paper>
  );
};

export default AnalysisResults;