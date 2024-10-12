import { useQuery, useMutation } from '@tanstack/react-query';
import { config } from 'config';
import { formatResponse, formatQueryData } from '../utils';

import { IBalanceSheet, IBalanceSheetDetails } from 'types/types';

const fetchBalanceSheetDetails: (
  arg0: IBalanceSheet | undefined | null
) => Promise<Response> = async balanceSheet => {
  if (balanceSheet) {
    return fetch(`${config.API_URL}invoices?balanceSheetId=${balanceSheet?.id}`);
  } else {
    return Promise.resolve(new Response());
  }
};

export const useBalanceSheetDetailsQuery = (
  balanceSheet: IBalanceSheet | undefined,
  queryKey: string[]
) => {
  return useQuery<IBalanceSheetDetails[]>({
    queryKey: queryKey,
    queryFn: () =>
      fetchBalanceSheetDetails(balanceSheet)
        .then(res => res.json())
        .then(res => {
          return formatResponse(res) as IBalanceSheetDetails[];
        }),
    enabled: !!balanceSheet
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
