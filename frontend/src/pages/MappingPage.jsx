import React, { useState, useCallback } from 'react';
import { Grid, Box, Typography, Button, Alert, Paper, Divider, Container } from '@mui/material';
import JdList from '../components/jd/JdList';
import CvDropzone from '../components/cv/CvDropzone';
import AnalysisResults from '../components/cv/AnalysisResults';
import ScoreDistributionChart from '../components/dashboard/ScoreDistributionChart';
import AverageBreakdownChart from '../components/dashboard/AverageBreakdownChart';
import ScoreOverviewChart from '../components/dashboard/ScoreOverviewChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { analyzeCvs } from '../services/analysisService';

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
    // Validation
    if (uploadedCvFiles.length === 0 || !uploadedCvFiles.every(f => f instanceof File)) {
      setAnalysisError('Please upload valid CV files.');
      return;
    }
    if (selectedJdIds.length === 0) {
      setAnalysisError('Please select at least one Job Description.');
      return;
    }
    setIsLoading(true);
    setAnalysisError('');
    setAnalysisResults(null);
    try {
      // Pass all selected JD IDs to the backend
      const results = await analyzeCvs(uploadedCvFiles, selectedJdIds);
      setAnalysisResults(results);
    } catch (err) {
      console.error("[MappingPage] Analysis failed:", err);
      setAnalysisError(err?.error || err?.message || 'Analysis failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which JD's results to show in the overview charts
  const primaryJdIdForCharts = selectedJdIds.length > 0 ? selectedJdIds[0] : (analysisResults ? Object.keys(analysisResults)[0] : null);
  const resultsForCharts = primaryJdIdForCharts ? analysisResults?.[primaryJdIdForCharts] : [];
  const primaryJdTitle = jds.find(jd => jd.id === primaryJdIdForCharts)?.title || '';

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>JD - CV Mapping Analysis</Typography>

      {/* Main Split Screen Layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        {/* Left: JD Selection */}
        <Box sx={{ 
          flex: 1, 
          width: { xs: '100%', md: '50%' },
          p: { xs: 2, sm: 3 }, 
          bgcolor: 'background.paper', 
          borderRadius: 1,
          boxShadow: 1,
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <Typography variant="h6" gutterBottom>1. Select Job Description(s)</Typography>
          <Box sx={{ flexGrow: 1, overflow: 'auto', minHeight: '300px' }}>
            <JdList
              jds={jds}
              selectedJdIds={selectedJdIds}
              onSelectionChange={handleJdSelectionChange}
              showAddButton={false}
              allowSelection={true}
              setJds={() => {}}
            />
          </Box>
        </Box>

        {/* Right: CV Upload */}
        <Box sx={{ 
          flex: 1, 
          width: { xs: '100%', md: '50%' },
          p: { xs: 2, sm: 3 }, 
          bgcolor: 'background.paper',
          borderRadius: 1, 
          boxShadow: 1,
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <Typography variant="h6" gutterBottom>2. Upload CVs (PDF)</Typography>
          <Box sx={{ flexGrow: 1, mb: 2, minHeight: '300px' }}>
            <CvDropzone onFilesAccepted={handleFilesAccepted} />
          </Box>
        </Box>
      </Box>

      {/* Analyze Button (Below the Split Screen) */}
      <Box sx={{ 
        p: 3, 
        mb: 3, 
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1 
      }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleAnalyze}
          disabled={isLoading || uploadedCvFiles.length === 0 || selectedJdIds.length === 0}
          fullWidth
          sx={{ py: 1.5 }}
        >
          {isLoading ? 'Analyzing...' : '3. Analyze Candidates'}
        </Button>
        {isLoading && <Box sx={{mt: 2, display: 'flex', justifyContent: 'center'}}><LoadingSpinner message="Processing CVs..." /></Box>}
        {analysisError && <Alert severity="error" sx={{ mt: 2 }}>{analysisError}</Alert>}
      </Box>

      
      {/* Analysis Results List */}
      {!isLoading && analysisResults && !analysisError && (
        <AnalysisResults analysisData={analysisResults} jds={jds} />
      )}

      {/* Placeholders / Initial State */}
      {!isLoading && !analysisResults && !analysisError && (
        <Paper variant='outlined' sx={{ p: 4, textAlign: 'center', mt: 3, borderStyle: 'dashed', bgcolor: 'action.hover' }}>
          <Typography color="text.secondary">
            Select a JD, upload CVs, and click "Analyze Candidates" to view detailed results.
          </Typography>
        </Paper>
      )}
      
      {/* Show analysis error only if it happened and there are no results */}
      {!isLoading && analysisError && !analysisResults && (
        <Alert severity="error" sx={{ mt: 3 }}>
          Analysis failed: {analysisError}
        </Alert>
      )}
    </Box>
  );
};

export default MappingPage;