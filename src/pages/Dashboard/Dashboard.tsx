import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MockedMarkets, MockedCities } from 'MockedDatas';
import { grey } from '@mui/material/colors';
import { CitiesAndMarketsHorizontalPanel, CitiesAndMarketsVerticalPanel } from 'components';
import { IMarket } from 'types/types';

function Dashboard(): JSX.Element {
  const currentCity = MockedCities[0].title;
  const markets = MockedMarkets;
  const [focusedMarket, setFocusedMarket] = useState<IMarket>(markets[currentCity][0]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        flex: 1,
        height: '100vh'
      }}>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '25%' }}>
        <CitiesAndMarketsVerticalPanel
          cities={MockedCities}
          markets={MockedMarkets}
          setCurrentMarket={setFocusedMarket}
        />
      </Box>
      <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%', alignItems: 'center' }}>
        <CitiesAndMarketsHorizontalPanel
          cities={MockedCities}
          markets={MockedMarkets}
          setCurrentMarket={setFocusedMarket}
        />
      </Box>
      <Box
        sx={{
          bgcolor: grey[50],
          width: { xs: '100%', md: '75%' },
          flexDirection: 'column',
          alignItems: 'center',
          display: 'flex',
          paddingTop: 2
        }}>
        <Typography variant={'h4'} fontWeight={'bold'} sx={{ marginRight: 1 }}>
          {focusedMarket.title}
        </Typography>
      </Box>
    </Box>
  );
}

export default Dashboard;
