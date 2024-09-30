import { useQuery, useMutation } from '@tanstack/react-query';
import { config } from 'config';
import { formatResponse, formatQueryData } from '../utils';

import { IBalanceSheet, IMarket } from 'types/types';

interface IBalanceSheetResponse {
  id: string;
  marketId: string;
  date: string;
}
const buildBalanceSheet: (arg0: string, arg1: string, arg2: string) => IBalanceSheet = (
  id,
  marketId,
  date
) => {
  return {
    id: id,
    date: new Date(date),
    marketId: marketId
  };
};

const fetchBalanceSheets: (
  arg0: IMarket | undefined
) => Promise<Response> = async currentMarket => {
  return fetch(`${config.API_URL}balanceSheets?marketId=${currentMarket?.id}`);
};

export const useBalanceSheetsDetailsQuery = (
  currentMarket: IMarket | undefined,
  queryKey: string[]
) => {
  return useQuery<IBalanceSheet[]>({
    queryKey: queryKey,
    queryFn: () =>
      fetchBalanceSheets(currentMarket)
        .then(res => res.json())
        .then(res => {
          return (formatResponse(res) as IBalanceSheetResponse[]).map(
            (sheet: { id: string; marketId: string; date: string }) =>
              buildBalanceSheet(sheet.id, sheet.marketId, sheet.date)
          ) as IBalanceSheet[];
        }),
    enabled: !!currentMarket?.id
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
