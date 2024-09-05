import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { CitiesAndMarketsHorizontalPanel, VerticalDrawer, TopMenu } from 'components';
import { MockedMarkets, MockedCities } from 'MockedDatas';
import { grey } from '@mui/material/colors';

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
  return (
    <Box sx={{ display: 'flex', bgcolor: grey[200], width: '100%', height: '100vh' }}>
      <BrowserRouter>
        <CssBaseline />
        <TopMenu />
        <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
          <VerticalDrawer />
          <Box
            sx={{
              padding: 2,
              flexDirection: 'column',
              height: '100%',
              displayMode: 'flex',
              flex: 1
            }}>
            <DrawerHeader />
            <Box
              sx={{
                height: '10%',
                width: '100%'
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
