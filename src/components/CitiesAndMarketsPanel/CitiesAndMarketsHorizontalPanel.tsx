import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ICity, IMarket } from 'types/types';

interface CitiesAndMarketsHorizontalPanelProps {
  cities: ICity[];
  markets: Record<string, IMarket[]>;
  setCurrentMarket: (arg0: IMarket) => void;
}

function CitiesAndMarketsHorizontalPanel(props: CitiesAndMarketsHorizontalPanelProps): JSX.Element {
  const { cities, markets, setCurrentMarket } = props;
  const [currentCity, setCurrentCity] = useState(cities[0].title);
  const [focusedMarketId, setfocusedMarketId] = useState<string>(markets[currentCity][0].id);

  const handleChange = (event: SelectChangeEvent) => {
    setCurrentCity(event.target.value as string);
  };

  const handleMarketChange = (event: SelectChangeEvent) => {
    const currentMarket = markets[currentCity].find(market => market.id === event?.target.value);
    if (currentMarket) {
      setCurrentMarket(currentMarket);
      setfocusedMarketId(currentMarket.id);
    }
  };

  useEffect(() => {
    const currentMarket = markets[currentCity][0];
    if (currentMarket) {
      setfocusedMarketId(currentMarket.id);
      setCurrentMarket(currentMarket);
    }
  }, [currentCity]);

  return (
    <Box
      sx={{
        bgcolor: grey[50],
        //width: '100%',
        //paddingTop: 2,
        //paddingBottom: 2,
        paddingLeft: 2,
        // margin: 5,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 5,
        zIndex: 10,
        height: '100%'
      }}>
      <FormControl size="small" >
        <InputLabel
          id="ville-select-label"
          sx={{
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
            },
            minWidth: 120,
          }}>
          {cities.map(city => (
            <MenuItem key={city.id} value={city.title}>
              {city.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ paddingLeft: 1, maxWidth: { xs: '200px', md: '550px' } }} size="small">
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
          value={focusedMarketId}
          label="Age"
          onChange={handleMarketChange}
          sx={{
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'darkgray'
            },
            '& .MuiInputLabel-outlined': {
              color: '#2e2e2e',
              fontWeight: 'red'
            },
            minWidth: 120
          }}>
          {markets[currentCity].map(market => (
            <MenuItem key={market.id} value={market.id} sx={{ textAlign: 'center' }}>
              {market.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default CitiesAndMarketsHorizontalPanel;
