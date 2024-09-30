import { useQuery } from '@tanstack/react-query';
import { config } from 'config';
import { formatResponse } from '../utils';

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

export const useBalanceSheetsDetailsQuery = (currentMarket: IMarket | undefined) => {
  return useQuery<IBalanceSheet[]>({
    queryKey: ['sheets', currentMarket?.id],
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
