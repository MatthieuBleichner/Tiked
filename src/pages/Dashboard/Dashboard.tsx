import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import EuroIcon from '@mui/icons-material/Euro';
import BarChart from '@mui/icons-material/BarChart';
import AccountBalance from '@mui/icons-material/AccountBalance';
import EditNote from '@mui/icons-material/EditNote';
import { Routes, Route, Link, BrowserRouter, useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreIcon from '@mui/icons-material/MoreVert';
import { CitiesAndMarketsHorizontalPanel } from 'components';
import { MockedMarkets, MockedCities } from 'MockedDatas';
import { grey } from '@mui/material/colors';

interface SectionIconsProps {
  title: string;
}

const SectionIcon = (props: SectionIconsProps) => {
  const { title } = props;
  if (title === 'CLIENTS') {
    return <PeopleIcon />;
  } else if (title === 'TARIFS') {
    return <EuroIcon />;
  } else if (title === 'HISTORIQUE') {
    return <BarChart />;
  } else if (title === 'FACTURATION') {
    return <EditNote />;
  } else if (title === 'EDITION') {
    return <AccountBalance />;
  } else {
    return <StorefrontIcon />;
  }
};
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden',
  backgroundColor: '#263dad'
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  },
  backgroundColor: '#263dad'
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

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

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme)
      }
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme)
      }
    }
  ]
}));

const DrawerUI = () => {
  const { pathname } = useLocation();
  const currentrouteName = pathname.substring(1);
  const isMobile = useMediaQuery(`(max-width: 760px)`);
  const open = !isMobile;

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader />
      <Divider />
      <List>
        {['CLIENTS', 'TARIFS', 'FACTURATION', 'EDITION'].map(text => (
          <ListItem key={text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={Link}
              to={'/' + text}
              selected={text === currentrouteName}
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                  color: '#ffffff',
                  opacity: text === currentrouteName ? 1 : 0.6
                },
                open
                  ? {
                      justifyContent: 'initial'
                    }
                  : {
                      justifyContent: 'center'
                    }
              ]}>
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: 'center',
                    color: '#ffffff'
                  },
                  open
                    ? {
                        mr: 3
                      }
                    : {
                        mr: 'auto'
                      }
                ]}>
                <SectionIcon title={text} />
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={[
                  open
                    ? {
                        opacity: 1
                      }
                    : {
                        opacity: 0
                      }
                ]}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
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
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'center' }}>
              TIKED
            </Typography>
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
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" aria-label="show more" aria-haspopup="true" color="inherit">
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <DrawerUI />
        <Box
          sx={{
            flexGrow: 1,
            flexdirection: 'column'
          }}>
          <DrawerHeader />
          <AppBar />
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flex: 1,
              height: '300',
              width: '100%'
            }}>
            <CitiesAndMarketsHorizontalPanel
              cities={MockedCities}
              markets={MockedMarkets}
              setCurrentMarket={() => {}}
            />
          </Box>
          <Routes>
            <Route path="/CLIENTS" element={<div> Page CLIENTS</div>} />
            <Route path="/TARIFS" element={<div>Page TARIFS</div>} />
            <Route path="/FACTURATION" element={<div> Page FACTURATION</div>} />
            <Route path="/EDITION" element={<div>Page EDITION</div>} />
          </Routes>
        </Box>
      </BrowserRouter>
    </Box>
  );
}
