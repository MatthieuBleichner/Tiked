import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { CitiesAndMarketsHorizontalPanel, VerticalDrawer, TopMenu } from 'components';
import { grey } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery';
import Clients from '../Clients/Clients';
import Pricing from '../Pricing/Pricing';
import BalanceSheets from '../Edition/BalanceSheets';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

export default function Dashboard() {
  const isMobile = useMediaQuery(`(max-width: 760px)`);

  return (
    <Box sx={{ display: 'flex', bgcolor: grey[200], width: '100%', height: '100vh' }}>
      <BrowserRouter>
        <CssBaseline />
        {!isMobile && <TopMenu />}
        <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
          <VerticalDrawer />
          <Box
            sx={{
              //padding: 2,
              flexDirection: 'column',
              height: '100%',
              displayMode: 'flex',
              flex: 1
            }}>
            {!isMobile && <DrawerHeader />}
            <Box
              sx={{
                height: { xs: '20%', md: '13%' },
                width: '100%',
                padding: { xs: 1, md: 2 }
              }}>
              <CitiesAndMarketsHorizontalPanel />
            </Box>
            <Box
              sx={{
                width: '100%',
                padding: { xs: 1, md: 2 },
                display: 'flex',
                flexGrow: 1
              }}>
              <Routes>
                <Route path="/" element={<Navigate to="/CLIENTS" />} />
                <Route path="/CLIENTS" element={<Clients />} />
                <Route path="/TARIFS" element={<Pricing />} />
                <Route path="/BILAN" element={<BalanceSheets />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </BrowserRouter>
    </Box>
  );
}
