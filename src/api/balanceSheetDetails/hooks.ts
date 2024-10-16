import { useQuery, useMutation } from '@tanstack/react-query';
import { config } from 'config';
import { formatResponse, formatQueryData } from '../utils';

import { IBalanceSheet, IBalanceSheetDetails } from 'types/types';
import { getBalanceSheetInvoicesQuery } from './helpers';

export const useBalanceSheetDetailsQuery = (balanceSheet: IBalanceSheet) => {
  return useQuery<IBalanceSheetDetails[]>({
    ...getBalanceSheetInvoicesQuery(balanceSheet)
  });
};

interface useBalanceSheetDetailsMutationParams {
  onSuccess?: (arg0: IBalanceSheetDetails[]) => void;
  onError?: (arg0: Error) => void;
}
export const useBalanceSheetDetailsMutation = ({
  onSuccess,
  onError
}: useBalanceSheetDetailsMutationParams) => {
  return useMutation({
    mutationFn: (newBalanceSheetDetail: IBalanceSheetDetails) => {
      console.log('mutationFn', newBalanceSheetDetail);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatQueryData(newBalanceSheetDetail))
      };
      return fetch(`${config.API_URL}invoice?`, requestOptions)
        .then(response => response.json())
        .then(response => formatResponse(response));
    },
    onSuccess: data => {
      onSuccess?.(data as IBalanceSheetDetails[]);
    },
    onError: error => {
      onError?.(error);
    }
  });
};
