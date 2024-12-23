import { useQuery, useMutation } from '@tanstack/react-query';
import { config } from 'config';
import { formatResponse, formatQueryData } from '../utils';

import { APIIBalanceSheetInvoices, IBalanceSheet, IBalanceSheetInvoices } from 'types/types';
import { getBalanceSheetInvoicesQuery } from './helpers';
import Cookies from 'js-cookie';

export const useBalanceSheetInvoicesQuery = (balanceSheet: IBalanceSheet) => {
  return useQuery<IBalanceSheetInvoices[]>({
    ...getBalanceSheetInvoicesQuery(balanceSheet)
  });
};

interface useBalanceSheetInvoicesMutationParams {
  onSuccess?: (arg0: IBalanceSheetInvoices[]) => void;
  onError?: (arg0: Error) => void;
}
export const useBalanceSheetInvoicesMutation = ({
  onSuccess,
  onError
}: useBalanceSheetInvoicesMutationParams) => {
  return useMutation({
    mutationFn: (newBalanceSheetDetail: APIIBalanceSheetInvoices) => {
      const token = Cookies.get('token');
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formatQueryData(newBalanceSheetDetail))
      };
      return fetch(`${config.API_URL}/api/invoice?`, requestOptions)
        .then(response => response.json())
        .then(response => formatResponse(response));
    },
    onSuccess: data => {
      onSuccess?.(data as IBalanceSheetInvoices[]);
    },
    onError: error => {
      onError?.(error);
    }
  });
};
