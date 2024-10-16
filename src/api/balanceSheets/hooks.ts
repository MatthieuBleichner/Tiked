import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { config } from 'config';
import { formatResponse, formatQueryData } from '../utils';

import { IBalanceSheet, IMarket } from 'types/types';
import { getBalanceSheetQuery, buildBalanceSheet, IBalanceSheetResponse } from './helpers';

export const useBalanceSheetsQuery = (currentMarket: IMarket) => {
  return useSuspenseQuery<IBalanceSheet[]>({
    ...getBalanceSheetQuery(currentMarket)
  });
};

interface useBalanceSheetMutationParams {
  onSuccess?: (arg0: IBalanceSheet[]) => void;
  onError?: (arg0: Error) => void;
}

export const useBalanceSheetMutation = ({ onSuccess, onError }: useBalanceSheetMutationParams) => {
  return useMutation({
    mutationFn: (newSheet: IBalanceSheet) => {
      const formatedSheet = formatQueryData(newSheet);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatQueryData(formatedSheet))
      };
      return fetch(`${config.API_URL}balanceSheet?`, requestOptions)
        .then(response => response.json())
        .then(response => {
          return (formatResponse(response) as IBalanceSheetResponse[]).map(
            (sheet: { id: string; marketId: string; date: string }) =>
              buildBalanceSheet(sheet.id, sheet.marketId, sheet.date)
          ) as IBalanceSheet[];
        });
    },
    onSuccess: data => {
      onSuccess?.(data as IBalanceSheet[]);
    },
    onError: error => {
      onError?.(error);
    }
  });
};
