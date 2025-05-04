import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, CssBaseline, ThemeProvider, createTheme, Alert, alpha
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import EqualizerIcon from '@mui/icons-material/Equalizer'; // Icon for title
import MappingPage from './pages/MappingPage';
import JdAdminPage from './pages/JdAdminPage';
import { fetchJds } from './services/jdService';
import LoadingSpinner from './components/common/LoadingSpinner';

const drawerWidth = 240; // Width of the vertical navigation drawer

// --- Enhanced Theme ---
const theme = createTheme({
  palette: {
    mode: 'light', // Explicitly light mode
    primary: { main: '#007bff' }, // Professional blue
    secondary: { main: '#6c757d' }, // Greyish secondary
    success: { main: '#28a745' }, // Green
    warning: { main: '#ffc107' }, // Yellow/Orange
    error: { main: '#dc3545' }, // Red
    info: { main: '#17a2b8' }, // Teal/Info
    background: {
      default: '#f8f9fa', // Very light grey background
      paper: '#ffffff',
    },
    text: {
        primary: '#212529', // Darker text
        secondary: '#6c757d', // Grey text
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', // Modern font stack
    h4: { fontWeight: 600, fontSize: '1.6rem', marginBottom: '0.6em', color: '#343a40' },
    h5: { fontWeight: 500, fontSize: '1.3rem', marginBottom: '0.5em', color: '#343a40' },
    h6: { fontWeight: 500, fontSize: '1.15rem', marginBottom: '0.4em', color: '#495057' },
    subtitle1: { fontWeight: 500, color: '#495057' },
    body1: { fontSize: '0.95rem' },
    body2: { fontSize: '0.875rem', color: '#6c757d' },
    caption: { fontSize: '0.75rem', color: '#6c757d' },
  },
  shape: {
    borderRadius: 8, // Consistent border radius
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0, // Less reliance on heavy shadows
        variant: "outlined", // Use outlines more
      },
      styleOverrides: {
        root: ({ theme }) => ({
             border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`, // Subtle border
             // boxShadow: '0 1px 3px rgba(0,0,0,0.05)', // Optional subtle shadow
             backgroundColor: theme.palette.background.paper,
        })
      }
    },
    MuiCard: { // Style cards used for JDs
         defaultProps: {
            elevation: 0,
            variant: "outlined",
         },
         styleOverrides: {
            root: ({ theme }) => ({
                 border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
                 transition: 'box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
                '&:hover': {
                     boxShadow: `0 4px 12px ${alpha(theme.palette.grey[500], 0.1)}`, // Softer hover shadow
                     borderColor: theme.palette.primary.light,
                 }
            })
         }
    },
    MuiButton: {
        defaultProps: {
            disableElevation: true, // Flatter buttons
        },
        styleOverrides: {
            root: {
                textTransform: 'none', // No ALL CAPS
                borderRadius: 6,
            },
             containedPrimary: ({theme}) => ({ // Example: Slightly lighter hover for primary
                '&:hover': {
                     backgroundColor: alpha(theme.palette.primary.main, 0.9),
                }
            })
        }
    },
     MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`
        })
      }
    },
    MuiListItemButton: { // Style sidebar buttons
        styleOverrides: {
            root: ({ theme }) => ({
                 borderRadius: 6, // Rounded corners
                 margin: theme.spacing(0.5, 1), // Add some margin
                 paddingLeft: theme.spacing(2),
                 '&.Mui-selected': { // Style selected item
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                           backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      },
                 },
                 '&:hover': {
                      backgroundColor: alpha(theme.palette.action.hover, 0.04),
                 }
            })
        }
    },
     MuiAccordion: { // Style accordions used for results
      defaultProps: {
          disableGutters: true,
          elevation: 0,
      },
      styleOverrides: {
          root: ({ theme }) => ({
               border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
               '&:not(:last-child)': { borderBottom: 0, },
               '&:before': { display: 'none', },
               '&.Mui-expanded': { margin: 0, },
          }),
      }
    },
    MuiAccordionSummary: {
        styleOverrides: {
            root: ({ theme }) => ({
                 backgroundColor: alpha(theme.palette.grey[500], 0.03),
                 minHeight: 56,
                 '&.Mui-expanded': { minHeight: 56, },
            }),
            content: ({ theme }) => ({
                 margin: `${theme.spacing(1.5)} 0`,
                 '&.Mui-expanded': { margin: `${theme.spacing(1.5)} 0`, },
            })
        }
    },
     MuiChip: {
        styleOverrides: {
            root: ({ theme }) => ({
                 fontWeight: 500,
            })
        }
    }
  }
});
// --- End Enhanced Theme ---

function App() {
  const [activePage, setActivePage] = useState('mapping');
  const [jds, setJds] = useState([]); // <<<---- SINGLE SOURCE OF TRUTH FOR JDs
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Fetch JDs on initial mount
  useEffect(() => {
    const loadJds = async () => {
        setInitialLoading(true);
        setLoadError('');
        console.log("App.jsx: Fetching initial JDs...");
        try {
            const data = await fetchJds();
            console.log("App.jsx: Fetched JDs data:", data);
            setJds(data || []); // Set the state
        } catch (error) {
            console.error("App.jsx: Failed to load JDs:", error);
            setLoadError("Failed to load initial Job Descriptions from server.");
        } finally {
            setInitialLoading(false);
        }
    };
    loadJds();
  }, []); // Empty dependency array means run only once on mount

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  // Define the drawer content
  const drawer = (
    <Box>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
         <EqualizerIcon color="primary" sx={{ mr: 1 }}/>
         <Typography variant="h6" noWrap component="div" color="primary.main" fontWeight="bold">
           AI Mapper
         </Typography>
      </Toolbar>
      <List sx={{ pt: 1}}>
        <ListItem key="mapping" disablePadding>
          <ListItemButton
            selected={activePage === 'mapping'}
            onClick={() => handlePageChange('mapping')}
          >
            <ListItemIcon sx={{minWidth: 40}}>
              <DocumentScannerIcon color={activePage === 'mapping' ? 'primary' : 'action'}/>
            </ListItemIcon>
            <ListItemText primary="JD-CV Mapping" primaryTypographyProps={{fontWeight: activePage === 'mapping' ? 'medium' : 'regular'}}/>
          </ListItemButton>
        </ListItem>
        <ListItem key="admin" disablePadding>
          <ListItemButton
            selected={activePage === 'admin'}
            onClick={() => handlePageChange('admin')}
          >
            <ListItemIcon sx={{minWidth: 40}}>
              <AdminPanelSettingsIcon color={activePage === 'admin' ? 'primary' : 'action'}/>
            </ListItemIcon>
            <ListItemText primary="JD Admin" primaryTypographyProps={{fontWeight: activePage === 'admin' ? 'medium' : 'regular'}}/>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  // Debug log to see when App re-renders and what jds state is
  console.log("App.jsx: Rendering. Current jds state:", jds);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: { xs: 2, sm: 3 },
            overflowX: 'hidden',
          }}
        >
          {initialLoading ? (
             <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <LoadingSpinner message="Loading..." />
             </Box>
          ) : loadError ? (
             <Alert severity="error" sx={{ mt: 2 }}>{loadError}</Alert>
          ) : (
            // Conditionally render pages based on activePage state
            // Pass the CURRENT 'jds' state and the 'setJds' function to the Admin page
            // Pass ONLY the CURRENT 'jds' state to the Mapping page
            <>
              {activePage === 'mapping' && <MappingPage jds={jds} />}
              {activePage === 'admin' && <JdAdminPage initialJds={jds} setJds={setJds} />}
            </>
          )}
           {/* Optional Footer */}
           {/* <Box component="footer" sx={{ pt: 3, mt: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}> ... </Box> */}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;