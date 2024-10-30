import { formatResponse } from 'api/utils';
import { config } from 'config';
import { IMarket, IPricing } from 'types/types';
import Cookies from 'js-cookie';

const fetchPricings: (arg0: IMarket | undefined) => Promise<Response> = async currentMarket => {
  const token = Cookies.get('token');
  const headers = { Authorization: `Bearer ${token}` };
  return fetch(`${config.API_URL}/api/pricings?marketId=${currentMarket?.id}`, { headers });
};

export const getPricingsQuery = (currentMarket: IMarket | undefined) => ({
  queryKey: ['pricings', currentMarket?.id],
  queryFn: () =>
    fetchPricings(currentMarket)
      .then(res => res.json())
      .then(data => formatResponse(data) as IPricing[])
});
