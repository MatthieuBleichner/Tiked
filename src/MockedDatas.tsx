import { ICity, IMarket } from 'types/types';

export const MockedCities: ICity[] = [
  {
    id: 'Lorient',
    //url: 'https://lekiosque.bzh/wp-content/uploads/2021/11/logo-Lorient.jpg', //https://www.sbmarches.bzh/wp-content/uploads/2024/02/marches_hebdomadaires_sbmarches-3.jpg
    name: 'Lorient'
  },
  {
    id: 'Quiberon',
    //url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWihINjq4L4Myw7fY5mgC_1kh2tKc8AoeOUjFvKXq4Q2BosM1or0hF46xL2SfKkicEW-E&usqp=CAU',
    name: 'Quiberon'
  },
  {
    id: 'Pontivy',
    //url: 'https://ville-pontivy.bzh/wp-content/uploads/2024/01/PONTIVY-Logo_N-scaled.jpg',
    name: 'Pontivy'
  }
];

export const MockedMarkets: Record<string, IMarket[]> = {
  Lorient: [
    {
      id: 'GrandMarcheDelorient',
      name: 'Grand Marché de Lorient',
      city: MockedCities[0],
      dates: 'L/M/M/J/V/S/D',
      color: '#ef5350'
    },
    {
      id: 'MarchéDuLundi',
      name: 'Marché du Lundi',
      city: MockedCities[0],
      dates: 'L',
      color: '#64b5f6'
    },
    {
      id: 'BraderieDuWeekend',
      name: 'Braderie du weekend',
      city: MockedCities[0],
      dates: 'S/D',
      color: '#1de9b6'
    }
  ],
  Quiberon: [
    {
      id: 'MarcheDuVarquez',
      name: 'Marché du Varquez',
      city: MockedCities[1],
      dates: 'S/D',
      color: '#651fff'
    },
    {
      id: 'MarchéPortHaliguen',
      name: 'Marché de Port Haliguen',
      city: MockedCities[1],
      dates: 'D',
      color: '#ef5350'
    }
  ],
  Pontivy: [
    {
      id: 'MarcheDeNoel',
      name: 'Marché de Noel',
      city: MockedCities[2],
      dates: 'J/V/S/D',
      color: '#64b5f6'
    }
  ]
};
