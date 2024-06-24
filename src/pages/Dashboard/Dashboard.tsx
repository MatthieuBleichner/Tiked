import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MockedMarkets, MockedCities } from 'MockedDatas';
import { grey } from '@mui/material/colors';
import { MarketCard } from 'components';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IMarket } from 'types/types';

function Dashboard(): JSX.Element {
  // const currentCity = MockedCities[0].title;

  const markets = MockedMarkets;

  const [currentCity, setCurrentCity] = React.useState(MockedCities[0].title);
  const [focusedMarketId, setfocusedMarketId] = useState<string>(markets[currentCity][0].id);
  const onMarketClick = (event: React.MouseEvent<HTMLElement>) => {
    setfocusedMarketId(event.currentTarget.id);
  };

  const currentMarket: IMarket = useMemo(() => {
    return (
      markets[currentCity].find(market => market.id === focusedMarketId) || markets[currentCity][0]
    );
  }, [focusedMarketId, currentCity]);

  const handleChange = (event: SelectChangeEvent) => {
    setCurrentCity(event.target.value as string);
  };

  const handleMarketChange = (event: SelectChangeEvent) => {
    setfocusedMarketId(event.target.value as string);
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', flex: 1, height: '100vh' }}>
      <Box sx={{ bgcolor: grey[200], width: '35%', flexDirection: 'column', paddingTop: 15 }}>
        <FormControl sx={{ width: '35%', paddingLeft: 2 }}>
          <InputLabel
            id="ville-select-label"
            sx={{
              paddingLeft: 2,
              color: '#2e2e2e',
              '&.Mui-focused': {
                color: '#000'
              }
            }}>
            Ville
          </InputLabel>
          <Select
            labelId="ville-select-label"
            id="ville-select"
            value={currentCity}
            label="Age"
            onChange={handleChange}
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'darkgray'
              },
              '& .MuiInputLabel-outlined': {
                color: '#2e2e2e',
                fontWeight: 'red'
              }
            }}>
            {MockedCities.map(city => (
              <MenuItem key={city.id} value={city.title}>
                {city.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column' }}>
          {markets[currentCity].map(market => (
            <MarketCard
              key={market.id}
              market={market}
              isFocused={focusedMarketId === market.id}
              onClick={onMarketClick}
            />
          ))}
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, paddingTop: 5 }}>
          <FormControl sx={{ width: '35%', paddingLeft: 2 }}>
            <InputLabel
              id="market-select-label"
              sx={{
                paddingLeft: 2,
                color: '#2e2e2e',
                '&.Mui-focused': {
                  color: '#000'
                }
              }}>
              Marché
            </InputLabel>
            <Select
              labelId="market-select-label"
              id="market-select"
              value={currentMarket.id}
              label="Age"
              onChange={handleMarketChange}
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'darkgray'
                },
                '& .MuiInputLabel-outlined': {
                  color: '#2e2e2e',
                  fontWeight: 'red'
                }
              }}>
              {markets[currentCity].map(market => (
                <MenuItem key={market.id} value={market.id}>
                  {market.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
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
