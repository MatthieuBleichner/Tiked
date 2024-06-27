import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import { MarketCard } from 'components';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ICity, IMarket } from 'types/types';

interface CitiesAndMarketsVerticalPanelProps {
  cities: ICity[];
  markets: Record<string, IMarket[]>;
  setCurrentMarket: (arg0: IMarket) => void;
}

function CitiesAndMarketsVerticalPanel(props: CitiesAndMarketsVerticalPanelProps): JSX.Element {
  const { cities, markets, setCurrentMarket } = props;
  const [currentCity, setCurrentCity] = React.useState(cities[0].title);
  const [focusedMarketId, setfocusedMarketId] = useState<string>(markets[currentCity][0].id);
  const onMarketClick = (event: React.MouseEvent<HTMLElement>) => {
    const currentMarket = markets[currentCity].find(market => market.id === event.currentTarget.id);
    if (currentMarket) {
      setfocusedMarketId(currentMarket.id);
      setCurrentMarket(currentMarket);
    }
  };

  useEffect(() => {
    const currentMarket = markets[currentCity][0];
    if (currentMarket) {
      setfocusedMarketId(currentMarket.id);
      setCurrentMarket(currentMarket);
    }
  }, [currentCity]);

  const handleChange = (event: SelectChangeEvent) => {
    setCurrentCity(event.target.value as string);
  };

  return (
    <Box sx={{ bgcolor: grey[200], width: '100%', flexDirection: 'column', paddingTop: 15 }}>
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
            },
            minWidth: 120
          }}>
          {cities.map(city => (
            <MenuItem key={city.id} value={city.title}>
              {city.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {markets[currentCity].map(market => (
          <MarketCard
            key={market.id}
            market={market}
            isFocused={focusedMarketId === market.id}
            onClick={onMarketClick}
          />
        ))}
      </Box>
    </Box>
  );
}

export default CitiesAndMarketsVerticalPanel;
