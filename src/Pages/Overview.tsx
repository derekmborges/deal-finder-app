import React, { useEffect, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { secondaryListItems } from '../Components/Overview/listItems';
import { Alert, Button, CircularProgress, ListItemButton, ListItemIcon, ListItemText, Snackbar, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Title from '../Components/Overview/Title';
import HomeDepotSearchModal from '../Components/HomeDepotSearchModal/HomeDepotSearchModal';
import axios from 'axios';
import { SavedSearch } from '../models/search';
import DeleteIcon from '@mui/icons-material/Delete';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://derekborges.com/">
        Derek Borges
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function OverviewContent() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [searches, setSavedSearches] = useState<SavedSearch[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [addingHomeDepot, setAddingHomeDepot] = useState(false);
  const [addSuccess, setAddSuccess] = useState<boolean | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null);

  const getSavedSearches = async () => {
    setLoading(true)
    const response = await axios.get('https://homedepotdealfinder.derekmborges.repl.co/api/searches');
    if (response.status === 200) {
      setSavedSearches(response.data.map((r: any) => {
        return {
          id: r.id,
          searchPhrase: r.phrase,
          categories: r.categories
        } as SavedSearch
      }))
    }
    setLoading(false);
  }

  useEffect(() => {
    getSavedSearches();
  }, []);


  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const onModalClosed = (saved: boolean) => {
    setAddingHomeDepot(false);
    if (saved) {
      setAddSuccess(true);
      getSavedSearches();
    }
  }

  const openHomeDepotModal = () => {
    setAddingHomeDepot(true);
  }

  const deleteSearch = async (searchId: string) => {
    console.log('deleting', searchId);
    const response = await axios.delete(`https://homedepotdealfinder.derekmborges.repl.co/api/searches/${searchId}`)
    if (response.status == 200 && response.data.ok) {
      setDeleteSuccess(true);
      getSavedSearches();
    }
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={drawerOpen}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(drawerOpen && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Deal Finder
            </Typography>
            {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={drawerOpen}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItemButton selected>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Overview" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Deals" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Searches" />
            </ListItemButton>
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Title>Add Deal Search</Title>
                  <Box sx={{ pt: 2 }}>
                    <Button
                      variant='contained'
                      color='warning'
                      onClick={openHomeDepotModal}>
                      Home Depot
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Title>Saved Searches</Title>
                  {searches === null && loading ? (
                    <CircularProgress />
                  ) : !loading && searches ? (

                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Phrase</TableCell>
                          <TableCell>Categories</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {searches.map(search => (
                          <TableRow key={search.id}>
                            <TableCell>{search.searchPhrase}</TableCell>
                            <TableCell>{search.categories.join(", ")}</TableCell>
                            <TableCell>
                              <IconButton size='small' onClick={() => deleteSearch(search.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                  ) : null}
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>

      <HomeDepotSearchModal open={addingHomeDepot} onClose={onModalClosed} />

      {addSuccess !== null && addSuccess && (
        <Snackbar open autoHideDuration={4000} onClose={() => setAddSuccess(null)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Successfully added search term.
          </Alert>
        </Snackbar>
      )}

      {deleteSuccess !== null && deleteSuccess && (
        <Snackbar open autoHideDuration={4000} onClose={() => setDeleteSuccess(null)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Successfully deleted search term.
          </Alert>
        </Snackbar>
      )}
    </ThemeProvider>
  );
}

export default function Overview() {
  return <OverviewContent />;
}
