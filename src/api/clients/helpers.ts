import { formatResponse } from 'api/utils';
import { config } from 'config';

import { IClient, ICity } from 'types/types';

import Cookies from 'js-cookie';

const fetchClients: (arg0: ICity | undefined) => Promise<Response> = async currentCity => {
  const token = Cookies.get('token');
  const headers = { 'Content-type': 'application/json', Authorization: `Bearer ${token}` };
  return fetch(`${config.API_URL}/api/clients?cityId=${currentCity?.id}`, { headers });
};

export const getClientsQuery = (
  currentCity: ICity | undefined,
  onSuccess?: (res: IClient[]) => void
) => ({
  queryKey: ['clients', currentCity?.id || ''],
  queryFn: () =>
    fetchClients(currentCity)
      .then(res => res.json())
      .then(res => {
        res.length && onSuccess?.(res);
        return formatResponse(res) as IClient[];
      })
});
