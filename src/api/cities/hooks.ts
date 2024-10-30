import { useQuery } from '@tanstack/react-query';
import { formatResponse } from 'api/utils';
import { config } from 'config';

import { ICity } from 'types/types';
import Cookies from 'js-cookie';

export const fetchCities: () => Promise<Response> = () => {
  const token = Cookies.get('token');
  const headers = { 'Content-type': 'application/json', Authorization: `Bearer ${token}` };
  return fetch(`${config.API_URL}/api/cities`, {
    headers
  });
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
