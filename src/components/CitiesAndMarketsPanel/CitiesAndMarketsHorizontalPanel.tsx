import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ICity, IMarket } from 'types/types';
import { useQuery } from '@tanstack/react-query';
import useSelectedData from 'contexts/market/useSelectedData';
import { formatResponse } from 'api/utils';
import { config } from 'config';

const fetchMarkets: (arg0: string | undefined) => Promise<Response> = async cityId => {
  return fetch(`${config.API_URL}markets?cityId=${cityId}`);
};

const fetchCities: () => Promise<Response> = () => {
  return fetch(`${config.API_URL}cities`);
};

function CitiesAndMarketsHorizontalPanel(): JSX.Element {
  const { setCurrentMarket, setCurrentCity } = useSelectedData();

  const { data: cities } = useQuery<ICity[]>({
    queryKey: ['repoData'],
    queryFn: () =>
      fetchCities()
        .then(res => res.json())
        .then(data => formatResponse(data) as ICity[])
  });

  const [selectedCity, setSelectedCity] = useState<ICity>();
  useEffect(() => {
    if (cities?.length) {
      setSelectedCity(cities[0]);
      setCurrentCity(cities[0]);
    }
  }, [cities]);

  const { data: markets } = useQuery<IMarket[]>({
    queryKey: ['repoMarkets', selectedCity?.id],
    queryFn: () =>
      fetchMarkets(selectedCity?.id).then(res =>
        res.json().then(data => formatResponse(data) as IMarket[])
      ),
    enabled: !!selectedCity?.id
  });

  const [selectedMarket, setSelectedMarket] = useState<ICity>();
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
    <Box
      sx={{
        bgcolor: grey[50],
        paddingLeft: 2,
        display: 'flex',
        justifyContent: { xs: 'center', md: 'flex-start' },
        alignItems: { xs: 'flex-start', md: 'center' },
        borderRadius: 5,
        zIndex: 10,
        height: '100%',
        flexDirection: { xs: 'column', md: 'row' }
      }}>
      <FormControl size="small">
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
          value={selectedCity?.id || ''}
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
          <InputLabel
            id="market-select-label"
            sx={{
              //paddingLeft: 2,
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
            value={selectedMarket?.id || ''}
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
