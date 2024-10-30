import { config } from 'config';
import Cookies from 'js-cookie';

export const fetchCities: () => Promise<Response> = () => {
  return fetch(`${config.API_URL}api/cities`);
};
