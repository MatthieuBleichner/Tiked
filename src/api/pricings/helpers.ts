import { formatResponse } from 'api/utils';
import { config } from 'config';

import { IMarket, IPricing } from 'types/types';

const fetchPricings: (arg0: IMarket | undefined) => Promise<Response> = async currentMarket => {
  return fetch(`${config.API_URL}pricings?marketId=${currentMarket?.id}`);
};

export const getPricingsQuery = (currentMarket: IMarket | undefined) => ({
  queryKey: ['pricings', currentMarket?.id],
  queryFn: () =>
    fetchPricings(currentMarket)
      .then(res => res.json())
      .then(data => formatResponse(data) as IPricing[])
});
