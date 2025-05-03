import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, CssBaseline, ThemeProvider, createTheme, Alert
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import MappingPage from './pages/MappingPage';
import JdAdminPage from './pages/JdAdminPage';
import { fetchJds } from './services/jdService';
import LoadingSpinner from './components/common/LoadingSpinner';

const drawerWidth = 240; // Width of the vertical navigation drawer

// Define your theme (can be customized further)
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    success: { main: '#2e7d32' },
    warning: { main: '#ed6c02' },
    error: { main: '#d32f2f' },
    background: {
      default: '#f4f6f8', // Light grey background
      paper: '#ffffff',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, fontSize: '1.8rem', marginBottom: '0.5em' },
    h5: { fontWeight: 500, fontSize: '1.4rem', marginBottom: '0.4em' },
    h6: { fontWeight: 500, fontSize: '1.15rem', marginBottom: '0.3em' },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff', // Ensure drawer background is distinct
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        }
      }
    }
  }
});

function App() {
  const [activePage, setActivePage] = useState('mapping'); // 'mapping' or 'admin'
  const [jds, setJds] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const loadJds = async () => {
      setInitialLoading(true);
      setLoadError('');
      try {
        const data = await fetchJds();
        setJds(data || []);
      } catch (error) {
        console.error("Failed to load JDs:", error);
        setLoadError("Failed to load initial Job Descriptions.");
      } finally {
        setInitialLoading(false);
      }
    };
    loadJds();
  }, []);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const drawer = (
    <div>
      <Toolbar sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', p:1}}>
         <Typography variant="h6" noWrap component="div" color="primary">
           AI Mapper
         </Typography>
      </Toolbar>
      {/* <Divider /> */}
      <List>
        <ListItem key="mapping" disablePadding>
          <ListItemButton
            selected={activePage === 'mapping'}
            onClick={() => handlePageChange('mapping')}
            sx={{ borderRadius: 2, mx:1, my:0.5 }} // Add some styling
          >
            <ListItemIcon>
              <DocumentScannerIcon color={activePage === 'mapping' ? 'primary' : 'action'}/>
            </ListItemIcon>
            <ListItemText primary="JD-CV Mapping" />
          </ListItemButton>
        </ListItem>
        <ListItem key="admin" disablePadding>
          <ListItemButton
            selected={activePage === 'admin'}
            onClick={() => handlePageChange('admin')}
            sx={{ borderRadius: 2, mx:1, my:0.5 }}
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon color={activePage === 'admin' ? 'primary' : 'action'}/>
            </ListItemIcon>
            <ListItemText primary="JD Admin" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          {/* Toolbar spacer not needed with permanent drawer unless you add an AppBar */}
          {/* <Toolbar /> */}
          {initialLoading ? (
             <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <LoadingSpinner message="Loading initial data..." />
             </Box>
          ) : loadError ? (
             <Alert severity="error" sx={{ mt: 2 }}>{loadError}</Alert>
          ) : (
            // Render the active page component
            <>
              {activePage === 'mapping' && <MappingPage jds={jds} />}
              {activePage === 'admin' && <JdAdminPage initialJds={jds} setJds={setJds} />}
            </>
          )}
           {/* Footer can go here or be removed if drawer is enough */}
           <Box component="footer" sx={{ pt: 3, mt: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                    AI CV Screening Tool © {new Date().getFullYear()}
                </Typography>
           </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;