import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { config } from 'config';
import { formatResponse, formatQueryData } from 'api/utils';

import { IMarket, IPricing } from 'types/types';
import { getPricingsQuery } from './helpers';
import Cookies from 'js-cookie';

export const usePricingsQuery = (currentMarket: IMarket | undefined) => {
  return useSuspenseQuery<IPricing[]>(getPricingsQuery(currentMarket));
};

interface usePricingMutationParams {
  onSuccess?: (arg0: IPricing[]) => void;
  onError?: (arg0: Error) => void;
}

export const usePricingMutation = ({ onSuccess, onError }: usePricingMutationParams) => {
  return useMutation({
    mutationFn: (newPricing: IPricing) => {
      const token = Cookies.get('token');
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formatQueryData(newPricing))
      };
      return fetch(`${config.API_URL}/api/pricing?`, requestOptions)
        .then(response => response.json())
        .then(response => formatResponse(response));
    },
    onSuccess: data => {
      onSuccess?.(data as IPricing[]);
    },
    onError: error => {
      onError?.(error);
    }
  });
};
