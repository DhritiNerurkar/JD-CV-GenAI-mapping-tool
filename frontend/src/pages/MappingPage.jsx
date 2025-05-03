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

const MappingPage = ({ jds }) => {
  const [selectedJdIds, setSelectedJdIds] = useState([]);
  const [uploadedCvFiles, setUploadedCvFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const handleJdSelectionChange = useCallback((newSelectedIds) => {
    setSelectedJdIds(newSelectedIds);
  }, []);

  const handleFilesAccepted = useCallback((files) => {
    setUploadedCvFiles(files);
    setAnalysisResults(null);
    setAnalysisError('');
  }, []);

  const handleAnalyze = async () => {
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
      const results = await analyzeCvs(uploadedCvFiles, selectedJdIds);
      setAnalysisResults(results);
    } catch (err) {
      console.error("[MappingPage] Analysis failed:", err);
      setAnalysisError(err?.error || err?.message || 'Analysis failed.');
    } finally {
      setIsLoading(false);
    }
  };

   const primaryJdIdForCharts = selectedJdIds.length > 0 ? selectedJdIds[0] : (analysisResults ? Object.keys(analysisResults)[0] : null);
   const resultsForCharts = primaryJdIdForCharts ? analysisResults?.[primaryJdIdForCharts] : [];
   const primaryJdTitle = jds.find(jd => jd.id === primaryJdIdForCharts)?.title || '';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>JD - CV Mapping</Typography>

      {/* Top Section: JD Selection & CV Upload (Split Screen) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Left Side: JD List */}
        <Grid item xs={12} md={5} lg={4}> {/* Adjusted grid size */}
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Select Job Description(s)</Typography>
            <JdList
              jds={jds}
              selectedJdIds={selectedJdIds}
              onSelectionChange={handleJdSelectionChange}
              showAddButton={false}
              setJds={() => {}}
            />
          </Paper>
        </Grid>

        {/* Right Side: CV Upload & Analyze Button */}
        <Grid item xs={12} md={7} lg={8}> {/* Adjusted grid size */}
           <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
             {/* Show loading/error related to analysis here */}
             {isLoading && <Box sx={{mt: 1}}><LoadingSpinner message="Analyzing..." /></Box>}
             {analysisError && <Alert severity="error" sx={{ mt: 1 }}>{analysisError}</Alert>}
           </Paper>
        </Grid>
      </Grid>

      {/* Middle Section: Analysis Overview Charts (Moved Below Inputs) */}
      {/* Show only if analysis is done and successful */}
       {analysisResults && !isLoading && !analysisError && (
          <Paper elevation={2} sx={{ p: {xs: 1, sm: 2}, mb: 3 }}>
             <Typography variant="h6" gutterBottom sx={{ mb: 2, px:1 }}>
                 Analysis Overview {primaryJdTitle && `for "${primaryJdTitle}"`}
             </Typography>
            <Grid container spacing={3}>
               <Grid item xs={12} md={6} lg={4}> {/* Adjusted grid size for 3 charts */}
                   <ScoreOverviewChart results={resultsForCharts} />
               </Grid>
               <Grid item xs={12} md={6} lg={4}>
                   <ScoreDistributionChart results={resultsForCharts} />
               </Grid>
               <Grid item xs={12} md={12} lg={4}> {/* Allow breakdown to take full on medium */}
                   <AverageBreakdownChart results={resultsForCharts} />
               </Grid>
            </Grid>
           </Paper>
        )}


      {/* Bottom Section: Analysis Results List */}
      {/* Show only if analysis is done and successful */}
      {!isLoading && analysisResults && !analysisError && (
        <AnalysisResults analysisData={analysisResults} jds={jds} />
      )}

      {/* Placeholder if no analysis run yet OR if analysis failed */}
      {!isLoading && !analysisResults && !analysisError && (
         <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 3 }}>
            <Typography color="text.secondary">
                Select a JD, upload CVs, and click "Analyze CVs" to see results.
            </Typography>
         </Paper>
      )}
      {/* Display error prominently if analysis failed */}
       {!isLoading && analysisError && !analysisResults && (
          <Alert severity="error" sx={{ mt: 3 }}>
              Analysis failed: {analysisError}
          </Alert>
        )}

    </Box>
  );
};

export default MappingPage;