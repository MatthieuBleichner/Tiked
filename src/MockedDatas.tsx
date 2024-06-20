import { ICity, IMarket } from 'types/types';

export const MockedCities: ICity[] = [
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

export const MockedMarkets: Record<string, IMarket[]> = {
  Lorient: [
    {
      id: 'GrandMarcheDelorient',
      title: 'Grand Marché de Lorient',
      city: MockedCities[0],
      dates: 'L/M/M/J/V/S/D',
      color: '#ef5350'
    },
    {
      id: 'MarchéDuLundi',
      title: 'Marché du Lundi',
      city: MockedCities[0],
      dates: 'L',
      color: '#64b5f6'
    },
    {
      id: 'BraderieDuWeekend',
      title: 'Braderie du weekend',
      city: MockedCities[0],
      dates: 'S/D',
      color: '#1de9b6'
    }
  ]
};
