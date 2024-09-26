import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
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
import { Link, useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

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
  } else if (title === 'BILAN') {
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
    width: `calc(${theme.spacing(7)} + 1px)`
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

const VerticalDrawer = () => {
  const { pathname } = useLocation();
  const currentrouteName = pathname.substring(1);
  const isMobile = useMediaQuery(`(max-width: 760px)`);
  const open = !isMobile;

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader />
      <Divider />
      <List>
        {['CLIENTS', 'TARIFS' /*, 'FACTURATION'*/, 'BILAN'].map(text => (
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

export default React.memo(VerticalDrawer);
