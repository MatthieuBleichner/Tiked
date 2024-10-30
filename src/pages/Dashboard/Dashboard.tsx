import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import CssBaseline from '@mui/material/CssBaseline';
import { CitiesAndMarketsHorizontalPanel, TopMenu } from 'components';
import useMediaQuery from '@mui/material/useMediaQuery';
import Clients from '../../components/Clients/Clients';
import Pricing from '../../components/Pricing/Pricing';
import BalanceSheets from '../../components/Edition/BalanceSheets';
import Invoice from '../../components/Invoice/Invoice';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import { styles } from './styles';

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

  const navigate = useNavigate();
  const token = Cookies.get('token');
  useEffect(() => {
    if (!token) {
      navigate('/');
    }

    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        navigate('/');
      }
    }
  }, [token]);

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
      <CssBaseline />
      {!isMobile && <TopMenu />}
      <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
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
              height: '76%'
              //display: 'flex',
              //flexGrow: 1
            }}>
            <Grid container spacing={2} sx={{ height: '100%', width: '100%', bgColor: 'red' }}>
              <Grid size={{ xs: 12, md: 6 }} sx={{ height: { xs: '70%', md: '50%' } }}>
                <Box sx={styles.card}>
                  <BalanceSheets />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ height: '50%' }}>
                <Box sx={styles.card}>
                  <Pricing />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ height: { xs: '70%', md: '50%' } }}>
                <Box sx={styles.card}>
                  <Clients />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ height: '50%' }}>
                <Box sx={styles.card}>
                  <Invoice />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
