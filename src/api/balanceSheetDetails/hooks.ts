import { useQuery } from '@tanstack/react-query';
import { config } from 'config';
import { formatResponse } from '../utils';

import { IBalanceSheet, IBalanceSheetDetails } from 'types/types';

const fetchBalanceSheetDetails: (
  arg0: IBalanceSheet | undefined | null
) => Promise<Response> = async balanceSheet => {
  if (balanceSheet) {
    return fetch(`${config.API_URL}balanceSheetDetails?balanceSheetId=${balanceSheet?.id}`);
  } else {
    return Promise.resolve(new Response());
  }
};

export const useBalanceSheetDetailsQuery = (balanceSheet: IBalanceSheet | undefined) => {
  return useQuery<IBalanceSheetDetails[]>({
    queryKey: ['details', balanceSheet?.id],
    queryFn: () =>
      fetchBalanceSheetDetails(balanceSheet)
        .then(res => res.json())
        .then(res => {
          return formatResponse(res) as IBalanceSheetDetails[];
        }),
    enabled: !!balanceSheet
  });
};
