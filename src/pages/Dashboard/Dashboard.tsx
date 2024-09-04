import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreIcon from '@mui/icons-material/MoreVert';
import { CitiesAndMarketsHorizontalPanel, VerticalDrawer, TopMenu } from 'components';
import { MockedMarkets, MockedCities } from 'MockedDatas';
import { grey } from '@mui/material/colors';

const drawerWidth = 240;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        })
      }
    }
  ]
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

interface PageProps {
  title: string;
}
const Page: React.FC<PageProps> = ({ title }) => {
  return (
    <Box
      sx={{
        flex: 1,
        borderRadius: 5,
        marginTop: 2,
        height: '80%',
        backgroundColor: grey[50],
        padding: 2,
        paddingLeft: 5
      }}>
      <Typography variant="h4" noWrap component="div" sx={{ color: '#263dad', fontWeight: 600 }}>
        {title}
      </Typography>
    </Box>
  );
};
export default function Dashboard() {
  const isMobile = useMediaQuery(`(max-width: 760px)`);
  const open = !isMobile;
  return (
    <Box sx={{ display: 'flex', bgcolor: grey[200], flex: 1, width: '100%', height: '100vh' }}>
      <BrowserRouter>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                width: '100%',
                justifyContent: 'center'
              }}>
              <Typography variant="h6" noWrap component="div">
                TIKED
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', display: 'flex', flex: 1, width: '97%' }}>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <IconButton size="large" aria-label="settings" color="inherit">
                  <SettingsIcon />
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit">
                  <AccountCircle />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" aria-label="show more" aria-haspopup="true" color="inherit">
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <VerticalDrawer />
          <Box
            sx={{
              flexGrow: 1,
              padding: 2,
              flexDirection: 'column'
            }}>
            <DrawerHeader />
            <AppBar />
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                height: '10%'
              }}>
              <CitiesAndMarketsHorizontalPanel
                cities={MockedCities}
                markets={MockedMarkets}
                setCurrentMarket={() => {}}
              />
            </Box>
            <Routes>
              <Route path="/CLIENTS" element={<Page title={'Clients'} />} />
              <Route path="/TARIFS" element={<Page title={'Tarifs'} />} />
              <Route path="/FACTURATION" element={<Page title={'Facturations'} />} />
              <Route path="/EDITION" element={<Page title={'Edition'} />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </Box>
  );
}
