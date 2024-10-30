import { config } from 'config';
import { formatResponse } from '../utils';
import { IBalanceSheet, IBalanceSheetInvoices } from 'types/types';
import Cookies from 'js-cookie';

const fetchBalanceSheetInvoices: (
  arg0: IBalanceSheet | undefined | null
) => Promise<Response> = async balanceSheet => {
  if (balanceSheet) {
    const token = Cookies.get('token');
    const headers = { Authorization: `Bearer ${token}` };
    return fetch(`${config.API_URL}/api/invoices?balanceSheetId=${balanceSheet?.id}`, { headers });
  } else {
    return Promise.resolve(new Response());
  }
};

export const getBalanceSheetInvoicesQuery = (balanceSheet: IBalanceSheet) => {
  return {
    queryKey: ['invoices', balanceSheet?.id || ''],
    queryFn: () =>
      fetchBalanceSheetInvoices(balanceSheet)
        .then(res => res.json())
        .then(res => {
          return formatResponse(res) as IBalanceSheetInvoices[];
        })
  };
};
