import { useSuspenseQuery } from '@tanstack/react-query';
import { config } from 'config';

import { IMarket, IPricing } from 'types/types';

const fetchPricings: (arg0: IMarket | undefined) => Promise<Response> = async currentMarket => {
  return fetch(`${config.API_URL}pricings?marketId=${currentMarket?.id}`);
};

export const usePricingsQuery = (currentMarket: IMarket | undefined) => {
  return useSuspenseQuery<IPricing[]>({
    queryKey: ['pricings', currentMarket?.id],
    queryFn: () => fetchPricings(currentMarket).then(res => res.json())
  });
};
