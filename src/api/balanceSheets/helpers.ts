import { config } from 'config';
import { formatResponse, formatQueryData } from '../utils';
import { IBalanceSheet, IMarket } from 'types/types';
import Cookies from 'js-cookie';

export interface IBalanceSheetResponse {
  id: string;
  marketId: string;
  date: string;
}

export const buildBalanceSheet: (arg0: string, arg1: string, arg2: string) => IBalanceSheet = (
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

const fetchBalanceSheets: (arg0: IMarket | undefined, arg1: string) => Promise<Response> = async (
  currentMarket,
  date
) => {
  const dateQuery = date ? `&date=${date}` : '';
  const token = Cookies.get('token');
  const headers = { Authorization: `Bearer ${token}` };
  return fetch(`${config.API_URL}/api/balanceSheets?marketId=${currentMarket?.id}${dateQuery}`, {
    headers
  });
};

export const getBalanceSheetQuery = (currentMarket: IMarket, date?: Date) => {
  const formatedDate = formatQueryData(date);
  return {
    queryKey: ['sheets', currentMarket.id || '', formatedDate ?? ''],
    queryFn: () =>
      fetchBalanceSheets(currentMarket, formatedDate as string)
        .then(res => res.json())
        .then(res => {
          return (formatResponse(res) as IBalanceSheetResponse[]).map(
            (sheet: { id: string; marketId: string; date: string }) =>
              buildBalanceSheet(sheet.id, sheet.marketId, sheet.date)
          ) as IBalanceSheet[];
        })
        .catch(() => {
          return [];
        })
  };
};
