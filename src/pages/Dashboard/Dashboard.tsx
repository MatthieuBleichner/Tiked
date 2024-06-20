import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MockedMarkets, MockedCities } from 'MockedDatas';
import { grey } from '@mui/material/colors';
import { MarketCard } from 'components';

function Dashboard(): JSX.Element {
  const currentCity = MockedCities[0].title;

  const markets = MockedMarkets;

  const [focusedMarketId, setfocusedMarketId] = useState<string>(markets[currentCity][0].id);
  const onMarketClick = (event: React.MouseEvent<HTMLElement>) => {
    setfocusedMarketId(event.currentTarget.id);
  };

  const currentMarket = useMemo(() => {
    return (
      markets[currentCity].find(market => market.id === focusedMarketId) || markets[currentCity][0]
    );
  }, [focusedMarketId]);

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', flex: 1, height: '100vh' }}>
      <Box sx={{ bgcolor: grey[200], width: '35%', flexDirection: 'column', paddingTop: 15 }}>
        {markets[currentCity].map(market => (
          <MarketCard
            key={market.id}
            market={market}
            isFocused={focusedMarketId === market.id}
            onClick={onMarketClick}
          />
        ))}
      </Box>
      <Box
        sx={{
          bgcolor: grey[50],
          width: '65%',
          flexDirection: 'column',
          alignItems: 'center',
          display: 'flex',
          paddingTop: 2
        }}>
        <Typography variant={'h4'} fontWeight={'bold'} sx={{ marginRight: 1 }}>
          {currentMarket.title}
        </Typography>
      </Box>
    </Box>
  );
}

export default Dashboard;
