import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl, InputLabel, Slider, Paper, 
  ToggleButtonGroup, ToggleButton, Tabs, Tab, Button, Divider, Chip,
  useTheme, Card, IconButton, Grid
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import RefreshIcon from '@mui/icons-material/Refresh';
import TuneIcon from '@mui/icons-material/Tune';
import CvResultItem from './CvResultItem';

const sortOptions = [
    { value: 'overall_score', label: 'Overall' },
    { value: 'skills_match_score', label: 'Skills' },
    { value: 'experience_relevance_score', label: 'Experience' },
    { value: 'education_fit_score', label: 'Education' },
    { value: 'keyword_alignment_score', label: 'Keywords' },
];

const AnalysisResults = ({ analysisData, jds }) => {
  const theme = useTheme();
  const [selectedJdIdForView, setSelectedJdIdForView] = useState('');
  const [scoreFilter, setScoreFilter] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('overall_score'); // Default sort
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const analyzedJdIds = Object.keys(analysisData || {});
  const selectableJds = Array.isArray(jds) ? jds.filter(jd => analyzedJdIds.includes(jd.id)) : [];

  useEffect(() => {
    if (!selectedJdIdForView && selectableJds.length > 0) {
      setSelectedJdIdForView(selectableJds[0].id);
    } else if (selectedJdIdForView && !analyzedJdIds.includes(selectedJdIdForView)) {
      setSelectedJdIdForView(selectableJds.length > 0 ? selectableJds[0].id : '');
    }
  }, [analysisData, selectableJds, selectedJdIdForView, analyzedJdIds]);

  const resultsForSelectedJd = analysisData?.[selectedJdIdForView] || [];

  const handleSliderChange = (event, newValue) => {
    setScoreFilter(newValue);
  };

  const handleSortChange = (event, newSortBy) => {
    if (newSortBy !== null) { // Prevent unselecting all buttons
        setSortBy(newSortBy);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Here you would typically filter by score range based on tab
    if (newValue === 0) { // All
      setScoreFilter([0, 100]);
    } else if (newValue === 1) { // Strong matches
      setScoreFilter([80, 100]);
    } else if (newValue === 2) { // Average matches
      setScoreFilter([60, 79]);
    } else if (newValue === 3) { // Weak matches
      setScoreFilter([0, 59]);
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
    <Paper elevation={2} sx={{ 
      mt: 4, 
      clear: 'both', 
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        bgcolor: theme.palette.primary.main, 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h5">Ranked Candidates</Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            color="inherit" 
            size="small" 
            onClick={() => setShowFilters(!showFilters)}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
          >
            <TuneIcon />
          </IconButton>
          <IconButton 
            color="inherit" 
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* JD Selection Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#f8f9fa' }}>
        <FormControl fullWidth size="small" sx={{ p: 2 }}>
          <InputLabel id="jd-select-label-results">Job Description</InputLabel>
          <Select
            labelId="jd-select-label-results"
            id="jd-select-results"
            value={selectedJdIdForView}
            label="Job Description"
            onChange={(e) => setSelectedJdIdForView(e.target.value)}
            disabled={selectableJds.length === 0}
            sx={{ bgcolor: 'white' }}
          >
            <MenuItem value="" disabled><em>-- Select Job Description --</em></MenuItem>
            {selectableJds.map(jd => (
              <MenuItem key={jd.id} value={jd.id}>{jd.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Filter Toolbar */}
      {showFilters && (
        <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={2} alignItems="center">
            {/* Sort Control */}
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Sort by:</Typography>
              <ToggleButtonGroup
                value={sortBy}
                exclusive
                onChange={handleSortChange}
                aria-label="Sort results by"
                size="small"
                sx={{ bgcolor: 'white', width: '100%' }}
              >
                {sortOptions.map(opt => (
                  <ToggleButton 
                    key={opt.value} 
                    value={opt.value} 
                    aria-label={opt.label} 
                    sx={{ textTransform: 'none', flexGrow: 1 }}
                  >
                    {opt.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
            
            {/* Score Filter */}
            <Grid item xs={12} md={8}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Score Range: {scoreFilter[0]} - {scoreFilter[1]}
              </Typography>
              <Slider
                value={scoreFilter}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                sx={{
                  '& .MuiSlider-valueLabel': {
                    bgcolor: theme.palette.primary.main,
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )}
      
      {/* Quick Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">All</Typography>
              <Chip 
                label={resultsForSelectedJd.length} 
                size="small" 
                sx={{ ml: 1, height: 20, fontSize: '0.75rem' }} 
              />
            </Box>
          } />
          <Tab label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">Strong</Typography>
              <Chip 
                label={resultsForSelectedJd.filter(i => (i.overall_score ?? 0) >= 80).length} 
                size="small" 
                color="success"
                sx={{ ml: 1, height: 20, fontSize: '0.75rem' }} 
              />
            </Box>
          } />
          <Tab label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">Average</Typography>
              <Chip 
                label={resultsForSelectedJd.filter(i => (i.overall_score ?? 0) >= 60 && (i.overall_score ?? 0) < 80).length} 
                size="small" 
                color="warning"
                sx={{ ml: 1, height: 20, fontSize: '0.75rem' }} 
              />
            </Box>
          } />
          <Tab label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">Weak</Typography>
              <Chip 
                label={resultsForSelectedJd.filter(i => (i.overall_score ?? 0) < 60).length} 
                size="small" 
                color="error"
                sx={{ ml: 1, height: 20, fontSize: '0.75rem' }} 
              />
            </Box>
          } />
        </Tabs>
      </Box>

      {/* Results List */}
      {selectedJdIdForView && processedResults.length > 0 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 'medium', color: 'text.secondary' }}>
             Displaying {processedResults.length} candidate{processedResults.length !== 1 ? 's' : ''}
          </Typography>
          
          {processedResults.map((analysis, index) => (
            <CvResultItem
              key={`${analysis.cv_filename}-${sortBy}-${index}`}
              analysis={analysis}
              rank={index + 1} // Rank based on sorted position
            />
          ))}
        </Box>
      )}

      {/* No results messages */}
      {selectedJdIdForView && resultsForSelectedJd.length > 0 && processedResults.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No CVs match the current score filter for this Job Description.
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setScoreFilter([0, 100])}
            startIcon={<FilterListIcon />}
          >
            Clear Filters
          </Button>
        </Box>
      )}
      
      {selectedJdIdForView && resultsForSelectedJd.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No analysis results found for the selected Job Description.
          </Typography>
          <Button variant="outlined">Upload CVs</Button>
        </Box>
      )}
      
      {!selectedJdIdForView && selectableJds.length > 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Please select a Job Description above to view results.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default AnalysisResults;