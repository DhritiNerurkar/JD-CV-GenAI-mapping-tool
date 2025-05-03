import React, { useState, useCallback } from 'react';
import { Grid, Box, Typography, Button, Alert, Paper } from '@mui/material';
import JdList from '../components/jd/JdList';
import CvDropzone from '../components/cv/CvDropzone';
import AnalysisResults from '../components/cv/AnalysisResults';
import ScoreDistributionChart from '../components/dashboard/ScoreDistributionChart';
import AverageBreakdownChart from '../components/dashboard/AverageBreakdownChart';
import ScoreOverviewChart from '../components/dashboard/ScoreOverviewChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { analyzeCvs } from '../services/analysisService';

// Receives JDs from App.jsx, manages its own state for mapping process
const MappingPage = ({ jds }) => {
  const [selectedJdIds, setSelectedJdIds] = useState([]);
  const [uploadedCvFiles, setUploadedCvFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null); // { jdId: [results...] }
  const [isLoading, setIsLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const handleJdSelectionChange = useCallback((newSelectedIds) => {
    setSelectedJdIds(newSelectedIds);
  }, []);

  const handleFilesAccepted = useCallback((files) => {
    setUploadedCvFiles(files);
    setAnalysisResults(null); // Clear results on new files
    setAnalysisError('');
  }, []);

  const handleAnalyze = async () => {
    // Basic validation
    if (uploadedCvFiles.length === 0 || !uploadedCvFiles.every(f => f instanceof File)) {
       setAnalysisError('Please upload valid CV files before analyzing.');
       return;
    }
    if (selectedJdIds.length === 0) {
      setAnalysisError('Please select at least one Job Description.');
      return;
    }

    setIsLoading(true);
    setAnalysisError('');
    setAnalysisResults(null); // Clear previous before new analysis

    console.log("[MappingPage] Attempting to call analyzeCvs service...");
    try {
      const results = await analyzeCvs(uploadedCvFiles, selectedJdIds);
      console.log("[MappingPage] Analysis successful, results:", results);
      setAnalysisResults(results);
    } catch (err) {
      console.error("[MappingPage] Analysis failed:", err);
      setAnalysisError(err?.error || err?.message || 'Analysis failed. See console.');
    } finally {
      setIsLoading(false);
    }
  };

   // Determine which JD's results to show in the overview charts
   const primaryJdIdForCharts = selectedJdIds.length > 0 ? selectedJdIds[0] : (analysisResults ? Object.keys(analysisResults)[0] : null);
   const resultsForCharts = primaryJdIdForCharts ? analysisResults?.[primaryJdIdForCharts] : [];
   const primaryJdTitle = jds.find(jd => jd.id === primaryJdIdForCharts)?.title || '';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Main Split Screen Layout */}
      <Box sx={{ display: 'flex', mb: 3, minHeight: '250px' }}>
        {/* Left Side: JD List */}
        <Paper 
          elevation={2} 
          sx={{ 
            width: '50%', 
            p: 2, 
            mr: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Typography variant="h6" gutterBottom>Select Job Description(s)</Typography>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <JdList
              jds={jds}
              selectedJdIds={selectedJdIds}
              onSelectionChange={handleJdSelectionChange}
              showAddButton={false}
              setJds={() => {}} // No-op function
            />
          </Box>
        </Paper>

        {/* Right Side: CV Upload & Analyze Button */}
        <Paper 
          elevation={2} 
          sx={{ 
            width: '50%', 
            p: 2, 
            ml: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h6" gutterBottom>Upload CVs (PDF)</Typography>
          <Box sx={{ flexGrow: 1, mb: 2 }}>
            <CvDropzone onFilesAccepted={handleFilesAccepted} />
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleAnalyze}
            disabled={isLoading || uploadedCvFiles.length === 0 || selectedJdIds.length === 0}
            fullWidth
          >
            {isLoading ? 'Analyzing...' : 'Analyze CVs'}
          </Button>
          {isLoading && <Box sx={{mt: 1}}><LoadingSpinner message="Analyzing..." /></Box>}
          {analysisError && <Alert severity="error" sx={{ mt: 1 }}>{analysisError}</Alert>}
        </Paper>
      </Box>

      {/* Bottom Section: Charts (only show if results exist) */}
      {analysisResults && !isLoading && (
        <Paper elevation={2} sx={{ p: 2, mb: 3, clear: 'both', mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Analysis Overview {primaryJdTitle && `for "${primaryJdTitle}"`}
          </Typography>
          <Grid container spacing={3}>
            {/* Score Overview Chart */}
            <Grid item xs={12} md={4}>
              <ScoreOverviewChart results={resultsForCharts} />
            </Grid>
            {/* Existing Charts */}
            <Grid item xs={12} md={4}>
              <ScoreDistributionChart results={resultsForCharts} />
            </Grid>
            <Grid item xs={12} md={4}>
              <AverageBreakdownChart results={resultsForCharts} />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Analysis Results List (only show if results exist) */}
      {!isLoading && analysisResults && (
        <AnalysisResults analysisData={analysisResults} jds={jds} />
      )}

      {/* Placeholder if no analysis run yet */}
      {!isLoading && !analysisResults && !analysisError && (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4, clear: 'both' }}>
          <Typography color="text.secondary">
            Select a JD, upload CVs, and click "Analyze CVs" to see results.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MappingPage;