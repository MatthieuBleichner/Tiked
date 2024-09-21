import React from 'react';
import Box from '@mui/material/Box';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IBalanceSheet, IMarket } from 'types/types';
import useSelectedData from 'contexts/market/useSelectedData';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { formatResponse, formatQueryData } from 'api/utils';
import { config } from 'config';
import { v4 as uuid } from 'uuid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

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

/**
 * Fetch clients from the API
 * @param currentCity - The current city
 * @returns The clients
 */
const fetchBalanceSheets: (
  arg0: IMarket | undefined
) => Promise<Response> = async currentMarket => {
  return fetch(`${config.API_URL}balanceSheets?marketId=${currentMarket?.id}`);
};

const BalanceSheets: React.FC = () => {
  const queryClient = useQueryClient();
  const { currentMarket } = useSelectedData();
  //const [clients, setClients] = useState<IClient[]>([]);

  const { data: sheets = [] } = useQuery<IBalanceSheet[]>({
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

  const mutation = useMutation({
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
      queryClient.setQueryData(
        ['sheets', currentMarket?.id],
        [...sheets, ...(data as IBalanceSheet[])]
      );
    },
    onError: error => {
      console.error('Error adding sheet:', error);
    }
  });

  const handleAddBalanceSheet = (balanceSheet: IBalanceSheet) => {
    mutation.mutate(balanceSheet);
  };

  if (!currentMarket) {
    return null;
  }
  return (
    <Box
      sx={{
        flex: 1,
        borderRadius: 5,
        //marginTop: 2,
        height: '80%',
        backgroundColor: grey[50],
        padding: 2
        //paddingLeft: 5
      }}>
      <Box sx={{ display: 'flex', direction: 'row', padding: 2 }}>
        <Box sx={{ display: 'flex', direction: 'row', flex: 1, justifyContent: 'flex-start' }}>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ color: '#263dad', fontWeight: 600 }}>
            Facturation
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', direction: 'row', flex: 1, justifyContent: 'flex-end' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={'Nouveau bilan'}
              closeOnSelect={false}
              slotProps={{
                actionBar: {
                  sx: {
                    //color: '#263dad',
                    backgroundColor: '#263dad',
                    borderRadius: '2px',
                    borderColor: '#2196f3',
                    border: '1px solid',
                    flex: 1,
                    display: 'flex'
                  },
                  actions: ['accept']
                }
              }}
              onAccept={(val: Dayjs | null) => {
                handleAddBalanceSheet({
                  id: uuid(),
                  date: new Date(val?.toString() ?? ''),
                  marketId: currentMarket?.id
                });
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          borderRadius: 5,
          //marginTop: 2,
          height: '80%',
          padding: 2
          //paddingLeft: 5
        }}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sheets?.map(balanceSheet => (
                <TableRow
                  key={balanceSheet.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="client">
                    {balanceSheet.date.toLocaleString('fr-FR', { weekday: 'long' }) +
                      ' ' +
                      balanceSheet.date.getDate() +
                      ' ' +
                      balanceSheet.date.toLocaleString('fr-FR', { month: 'long' }) +
                      ' ' +
                      balanceSheet.date.getFullYear()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default BalanceSheets;
