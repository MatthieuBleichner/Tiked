import { config } from 'config';
import { formatResponse } from '../utils';

import { IBalanceSheet, IBalanceSheetDetails } from 'types/types';

const fetchBalanceSheetInvoices: (
  arg0: IBalanceSheet | undefined | null
) => Promise<Response> = async balanceSheet => {
  if (balanceSheet) {
    return fetch(`${config.API_URL}invoices?balanceSheetId=${balanceSheet?.id}`);
  } else {
    return Promise.resolve(new Response());
  }
};

export const getBalanceSheetInvoicesQuery = (balanceSheet: IBalanceSheet) => {
  return {
    queryKey: ['details', balanceSheet?.id || ''],
    queryFn: () =>
      fetchBalanceSheetInvoices(balanceSheet)
        .then(res => res.json())
        .then(res => {
          return formatResponse(res) as IBalanceSheetDetails[];
        })
  };
};
