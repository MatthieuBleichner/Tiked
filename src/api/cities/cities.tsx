import { config } from 'config';

export const fetchCities: () => Promise<Response> = () => {
  return fetch(`${config.API_URL}cities`);
};
