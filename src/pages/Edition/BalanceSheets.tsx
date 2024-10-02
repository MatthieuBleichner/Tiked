import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useQueryClient } from '@tanstack/react-query';
import { IBalanceSheet } from 'types/types';
import useSelectedData from 'contexts/market/useSelectedData';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BalanceSheetModal } from 'components/Modals/BalanceSheetModal/BalanceSheetModal';
import Button from '@mui/material/Button';
import BalanceSheetCreationModal from 'components/Modals/BalanceSheetCreationModal';
import { useBalanceSheetsDetailsQuery } from 'api/balanceSheets/hooks';
import RootContainer from '../RootContainer';
import { createStyles, makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() =>
  createStyles({
    buttonWrapper: {
      paddingLeft: 2,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '50%'
    },
    body: {
      flex: 1,
      borderRadius: 5,
      height: '80%',
      padding: 2,
      display: 'flex'
    }
  })
);

const BalanceSheets: React.FC = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { currentMarket } = useSelectedData();
  const { t } = useTranslation();

  const { data: sheets = [] } = useBalanceSheetsDetailsQuery(currentMarket, [
    'sheets',
    currentMarket?.id || ''
  ]);

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
    <RootContainer title={t('page.bilan.title')}>
      <Box className={classes.buttonWrapper}>
        <Button variant="contained" onClick={() => setCreationModeIsOpened(true)}>
          {t('page.bilan.newBilan')}
        </Button>
      </Box>
      <Box className={classes.body}>
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
    </RootContainer>
  );
};

export default BalanceSheets;
