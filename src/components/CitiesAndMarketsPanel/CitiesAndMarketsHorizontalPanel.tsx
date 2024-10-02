import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ICity, IMarket } from 'types/types';
import useSelectedData from 'contexts/market/useSelectedData';
import { useCitiesQuery } from 'api/cities/hooks';
import { useMarketsQuery } from 'api/markets/hooks';
import styles from './styles';

function CitiesAndMarketsHorizontalPanel(): JSX.Element {
  const { setCurrentMarket, setCurrentCity } = useSelectedData();

  const { data: cities } = useCitiesQuery();

  const [selectedCity, setSelectedCity] = useState<ICity>();
  useEffect(() => {
    if (cities?.length) {
      setSelectedCity(cities[0]);
      setCurrentCity(cities[0]);
    }
  }, [cities]);

  const { data: markets } = useMarketsQuery(selectedCity);

  const [selectedMarket, setSelectedMarket] = useState<IMarket>();
  useEffect(() => {
    if (markets?.length) {
      setCurrentMarket(markets[0]);
      setSelectedMarket(markets[0]);
    }
  }, [markets]);

  const handleChange = (event: SelectChangeEvent) => {
    const targetedcity = cities?.find(city => city.id === event.target.value);
    if (targetedcity) {
      setSelectedCity(targetedcity);
      setCurrentCity(targetedcity);
    }
  };

  const handleMarketChange = (event: SelectChangeEvent) => {
    const currentMarket = markets?.find(market => market.id === event?.target.value);
    if (currentMarket) {
      setCurrentMarket(currentMarket);
      setSelectedMarket(currentMarket);
    }
  };

  return (
    <Box sx={styles.container}>
      <FormControl size="small">
        <InputLabel id="ville-select-label">Ville</InputLabel>
        <Select
          labelId="ville-select-label"
          id="ville-select"
          value={selectedCity?.id || ''}
          label="City"
          onChange={handleChange}
          sx={{
            minWidth: 120
          }}>
          {cities !== undefined &&
            cities?.map(city => (
              <MenuItem key={city.id} value={city.id}>
                {city.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <Box
        sx={{
          paddingLeft: { xs: 0, md: 2 },
          paddingTop: { xs: 2, md: 0 },
          maxWidth: { xs: '200px', md: '550px' }
        }}>
        <FormControl size="small">
          <InputLabel id="market-select-label">Marché</InputLabel>
          <Select
            labelId="market-select-label"
            id="market-select"
            value={selectedMarket?.id || ''}
            label="Age"
            onChange={handleMarketChange}
            sx={{
              minWidth: 120
            }}>
            {markets?.map(market => (
              <MenuItem key={market.id} value={market.id} sx={{ textAlign: 'center' }}>
                {market.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default CitiesAndMarketsHorizontalPanel;
