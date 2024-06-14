import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '../../components/Card';

interface ICity {
  url: string;
  title: string;
}

const cities: ICity[] = [
  {
    url: 'https://lekiosque.bzh/wp-content/uploads/2021/11/logo-Lorient.jpg',
    title: 'Lorient'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWihINjq4L4Myw7fY5mgC_1kh2tKc8AoeOUjFvKXq4Q2BosM1or0hF46xL2SfKkicEW-E&usqp=CAU',
    title: 'Quiberon'
  },
  {
    url: 'https://ville-pontivy.bzh/wp-content/uploads/2024/01/PONTIVY-Logo_N-scaled.jpg',
    title: 'Pontivy'
  }
];

function Cities(): JSX.Element {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={{ xs: 2, sm: 8, md: 12 }}>
        {cities.map(city => (
          <Grid item xs={2} sm={4} md={4} key={city.title} style={{ textAlign: 'center' }}>
            <Card title={city.title} url={city.url} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Cities;
