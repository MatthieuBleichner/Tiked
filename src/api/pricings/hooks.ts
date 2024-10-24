import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { config } from 'config';
import { formatResponse, formatQueryData } from 'api/utils';

import { IMarket, IPricing } from 'types/types';
import { getPricingsQuery } from './helpers';

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
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatQueryData(newPricing))
      };
      return fetch(`${config.API_URL}pricing?`, requestOptions)
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
