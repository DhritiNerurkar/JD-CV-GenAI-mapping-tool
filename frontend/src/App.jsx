import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, CssBaseline, ThemeProvider, createTheme
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import MappingPage from './pages/MappingPage';
import JdAdminPage from './pages/JdAdminPage';
import { fetchJds } from './services/jdService';
import LoadingSpinner from './components/common/LoadingSpinner';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#007bff' },
    secondary: { main: '#6c757d' },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  }
});

function App() {
  const [selectedPage, setSelectedPage] = useState('mapping');
  const [jds, setJds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJds = async () => {
      try {
        const data = await fetchJds();
        setJds(data);
      } catch (err) {
        console.error('Failed to fetch JDs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadJds();
  }, []);

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner message="Loading job descriptions..." />;
    if (selectedPage === 'mapping') return <MappingPage jds={jds} />;
    if (selectedPage === 'admin') return <JdAdminPage jds={jds} setJds={setJds} />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar>
            <EqualizerIcon sx={{ mr: 1 }} />
            <Typography variant="h6">CV Mapper</Typography>
          </Toolbar>
          <List>
            <ListItem disablePadding>
              <ListItemButton selected={selectedPage === 'mapping'} onClick={() => setSelectedPage('mapping')}>
                <ListItemIcon><DocumentScannerIcon /></ListItemIcon>
                <ListItemText primary="Mapping" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton selected={selectedPage === 'admin'} onClick={() => setSelectedPage('admin')}>
                <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                <ListItemText primary="JD Admin" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* Fixed: Removed the ml margin and adjusted padding */}
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: 2,  // Reduced padding 
          width: `calc(100% - ${drawerWidth}px)` 
        }}>
          <Toolbar /> {/* This creates space for the app bar */}
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;