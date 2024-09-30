import { useQuery } from '@tanstack/react-query';
import { formatResponse } from 'api/utils';
import { config } from 'config';

import { IMarket, ICity } from 'types/types';

const fetchMarkets: (arg0: string | undefined) => Promise<Response> = async cityId => {
  return fetch(`${config.API_URL}markets?cityId=${cityId}`);
};

export const useMarketsQuery = (selectedCity: ICity | undefined) => {
  return useQuery<IMarket[]>({
    queryKey: ['markets', selectedCity?.id],
    queryFn: () =>
      fetchMarkets(selectedCity?.id).then(res =>
        res.json().then(data => formatResponse(data) as IMarket[])
      ),
    enabled: !!selectedCity?.id
  });
};
