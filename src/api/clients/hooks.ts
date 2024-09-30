import { useQuery } from '@tanstack/react-query';
import { formatResponse } from 'api/utils';
import { config } from 'config';

import { IClient, ICity } from 'types/types';

const fetchClients: (arg0: ICity | undefined) => Promise<Response> = async currentCity => {
  return fetch(`${config.API_URL}clients?cityId=${currentCity?.id}`);
};

export const useClientsQuery = (
  currentCity: ICity | undefined,
  onSuccess?: (res: IClient[]) => void
) => {
  return useQuery<IClient[]>({
    queryKey: ['clients', currentCity?.id],
    queryFn: () =>
      fetchClients(currentCity)
        .then(res => res.json())
        .then(res => {
          res.length && onSuccess?.(res);
          return formatResponse(res) as IClient[];
        }),
    enabled: !!currentCity?.id
  });
};
