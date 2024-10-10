import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { IBalanceSheetDetails, IBalanceSheet } from 'types/types';
import { useQueryClient } from '@tanstack/react-query';
import useSelectedData from 'contexts/market/useSelectedData';
import BalanceSheetDetailsPDF from '../../PDF/BalanceSheetDetailsPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BalanceSheetDetailsModal from '../BalanceSheetDetailsModal/BalanceSheetDetailsModal';
import { useClientsQuery } from 'api/clients/hooks';
import { useBalanceSheetDetailsQuery } from 'api/balanceSheetDetails/hooks';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface BalanceSheetModalProps {
  open: boolean;
  handleClose: () => void;
  balanceSheet: IBalanceSheet;
}
export const BalanceSheetModal = ({ open, handleClose, balanceSheet }: BalanceSheetModalProps) => {
  const { currentCity, currentMarket } = useSelectedData();

  const { data: clients = [] } = useClientsQuery(currentCity, ['clients', currentCity?.id || '']);

  const queryClient = useQueryClient();
  const { data: details = [] } = useBalanceSheetDetailsQuery(balanceSheet, [
    'details',
    balanceSheet?.id || ''
  ]);

  const onAddDetail = (detail: IBalanceSheetDetails[]) => {
    queryClient.setQueryData(['details', balanceSheet?.id], [...details, ...detail]);
  };

  const [inEditMode, setInEditMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const onEditButtonPress = () => setInEditMode(!inEditMode);

  return (
    <React.Fragment>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}>
              <Typography variant="h4" noWrap component="div">
                {currentMarket?.name + ' - ' + currentCity?.name}
              </Typography>
            </Box>

            <IconButton edge="start" color="inherit" onClick={onEditButtonPress} aria-label="edit">
              <EditIcon />
            </IconButton>

            {currentMarket && balanceSheet && currentCity && details?.length > 0 ? (
              <PDFDownloadLink
                document={
                  <BalanceSheetDetailsPDF
                    currentMarket={currentMarket}
                    currentCity={currentCity}
                    balanceSheet={balanceSheet}
                    balanceSheetDetails={details}
                    clients={clients}
                  />
                }
                fileName={`${currentCity.name}-${currentMarket.name}-${balanceSheet?.date.toLocaleDateString(
                  'fr-FR',
                  {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                  }
                )}`}>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={onEditButtonPress}
                  aria-label="edit"
                  sx={{ color: '#FFFFFF' }}>
                  <DownloadIcon />
                </IconButton>
              </PDFDownloadLink>
            ) : (
              <></>
            )}
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            display: 'flex',
            //flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            height: '15%'
          }}>
          <Typography variant="h4" noWrap component="div">
            {'Bilan du ' +
              balanceSheet?.date.toLocaleString('fr-FR', { weekday: 'long' }) +
              ' ' +
              balanceSheet?.date.getDate() +
              ' ' +
              balanceSheet?.date.toLocaleString('fr-FR', { month: 'long' }) +
              ' ' +
              balanceSheet?.date.getFullYear()}
          </Typography>
        </Box>
        {!!clients && inEditMode && (
          <Box
            sx={{
              margin: 2,
              //width: '50%',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row'
            }}>
            <Button variant="contained" onClick={() => setOpenModal(true)}>
              Nouvelle entrée
            </Button>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <TableContainer component={Paper} sx={{ width: '50%' }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ width: '50%' }}>
                    Client
                  </TableCell>
                  <TableCell align="center">A payé</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details?.map(detail => {
                  const client = clients.find(client => client.id === detail.clientId);
                  return (
                    <TableRow
                      key={detail.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell id={client?.id} component="th" scope="client" align="left">
                        {`${client?.firstName} ${client?.lastName}`}
                      </TableCell>
                      <TableCell id={detail.id} component="th" scope="client" align="center">
                        {`${detail?.total} €`}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper} sx={{ width: '50%', marginTop: 2 }}>
            <Table aria-label="simple table">
              <TableBody>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="client" align="left" sx={{ width: '50%' }}>
                    Total
                  </TableCell>
                  <TableCell component="th" scope="client" align="center">
                    {`${details?.reduce((acc, detail) => acc + detail.total, 0)} €`}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Dialog>
      <BalanceSheetDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        balanceSheet={balanceSheet}
        onAddDetail={onAddDetail}
      />
    </React.Fragment>
  );
};
