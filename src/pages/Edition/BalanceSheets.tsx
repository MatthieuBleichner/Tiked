import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { formatResponse } from 'api/utils';
import { config } from 'config';
import { BalanceSheetModal } from 'components/Modals/BalanceSheetModal/BalanceSheetModal';
import Button from '@mui/material/Button';
import BalanceSheetCreationModal from 'components/Modals/BalanceSheetCreationModal';

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

  const [selectedSheet, setSelectedSheet] = React.useState<IBalanceSheet | undefined | null>();
  const handleOpen = (e: React.MouseEvent<HTMLTableCellElement>) => {
    console.log(e.currentTarget.id);
    setSelectedSheet(sheets?.find(sheet => sheet.id === e.currentTarget.id));
  };
  const handleClose = () => setSelectedSheet(null);

  const [openCrationMode, setCreationModeIsOpened] = useState(false);

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
      </Box>
      <Box
        sx={{
          paddingLeft: 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          width: '50%'
        }}>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: '#263dad',
            //color: 'black',
            '&:hover': {
              backgroundColor: '#263dad',
              opacity: 0.8
            },
            '&:disabled': {
              backgroundColor: 'green'
            }
          }}
          onClick={() => setCreationModeIsOpened(true)}>
          Nouveau Bilan
        </Button>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
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
                    <TableCell
                      id={balanceSheet.id}
                      component="th"
                      scope="client"
                      onClick={handleOpen}>
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
      {selectedSheet && (
        <BalanceSheetModal
          open={!!selectedSheet}
          handleClose={handleClose}
          balanceSheet={selectedSheet}
        />
      )}
      <BalanceSheetCreationModal
        open={openCrationMode}
        onClose={() => setCreationModeIsOpened(false)}
        onAddSheeet={data => {
          queryClient.setQueryData(['sheets', currentMarket?.id], [...sheets, ...data]);
        }}
      />
    </Box>
  );
};

export default BalanceSheets;
