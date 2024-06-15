import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from 'components/Card';
import CityModal from 'components/CityModal';
import { ICity } from 'types/types';

const cities: ICity[] = [
  {
    id: 'Lorient',
    url: 'https://lekiosque.bzh/wp-content/uploads/2021/11/logo-Lorient.jpg', //https://www.sbmarches.bzh/wp-content/uploads/2024/02/marches_hebdomadaires_sbmarches-3.jpg
    title: 'Lorient'
  },
  {
    id: 'Quiberon',
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWihINjq4L4Myw7fY5mgC_1kh2tKc8AoeOUjFvKXq4Q2BosM1or0hF46xL2SfKkicEW-E&usqp=CAU',
    title: 'Quiberon'
  },
  {
    id: 'Pontivy',
    url: 'https://ville-pontivy.bzh/wp-content/uploads/2024/01/PONTIVY-Logo_N-scaled.jpg',
    title: 'Pontivy'
  }
];

const newCityPlaceHolder = {
  id: 'newCityPlaceholder',
  url: '', //'https://ville-pontivy.bzh/wp-content/uploads/2024/01/PONTIVY-Logo_N-scaled.jpg',
  title: 'Ajouter une nouvelle ville'
};

function Cities(): JSX.Element {
  const [open, setIsOpened] = useState(false);
  const [allCities, setAllCities] = useState<ICity[]>(cities);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget.id === newCityPlaceHolder.id) {
      setIsOpened(true);
    }
  };

  const onCityCreated = (city: ICity) => {
    if (city !== null && city !== undefined) {
      const newCities = allCities.concat(city);
      setAllCities(newCities);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={{ xs: 2, sm: 8, md: 12 }}>
        {allCities.concat(newCityPlaceHolder).map(city => (
          <Grid item xs={2} sm={4} md={4} key={city.title} style={{ textAlign: 'center' }}>
            <Card id={city.id} title={city.title} url={city.url} onClick={onClick} />
          </Grid>
        ))}
      </Grid>
      <CityModal open={open} onClose={() => setIsOpened(false)} onCityCreated={onCityCreated} />
    </Box>
  );
}

export default Cities;
