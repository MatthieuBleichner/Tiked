import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { formatResponse, formatQueryData } from 'api/utils';
import { config } from 'config';

import { IClient, ICity } from 'types/types';
import { getClientsQuery } from './helpers';

export const useClientsQuery = (
  currentCity: ICity | undefined,
  onSuccess?: (res: IClient[]) => void
) => {
  return useSuspenseQuery<IClient[]>({
    ...getClientsQuery(currentCity, onSuccess)
  });
};

interface useClientMutationParams {
  onSuccess?: (arg0: IClient[]) => void;
  onError?: (arg0: Error) => void;
}
export const useClientMutation = ({ onSuccess, onError }: useClientMutationParams) => {
  return useMutation({
    mutationFn: (newClient: IClient) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatQueryData(newClient))
      };
      return fetch(`${config.API_URL}client?`, requestOptions)
        .then(response => response.json())
        .then(response => formatResponse(response));
    },
    onSuccess: data => {
      onSuccess?.(data as IClient[]);
    },
    onError: error => {
      onError?.(error);
    }
  });
};
