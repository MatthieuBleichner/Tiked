import { useQuery } from '@tanstack/react-query';
import { formatResponse } from 'api/utils';
import { config } from 'config';

import { ICity } from 'types/types';

export const fetchCities: () => Promise<Response> = () => {
  return fetch(`${config.API_URL}cities`);
};

export const useCitiesQuery = () => {
  return useQuery<ICity[]>({
    queryKey: ['cities'],
    queryFn: () =>
      fetchCities()
        .then(res => res.json())
        .then(data => formatResponse(data) as ICity[])
  });
};
