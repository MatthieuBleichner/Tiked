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
import { IBalanceSheetInvoices, IBalanceSheet, PaiementMethod } from 'types/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useSelectedData from 'contexts/market/useSelectedData';
import BalanceSheetPDF from '../../PDF/BalanceSheetPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BalanceSheetInvoicesModal from '../BalanceSheetInvoicesModal/BalanceSheetInvoicesModal';
import { useClientsQuery } from 'api/clients/hooks';
import { getBalanceSheetInvoicesQuery } from 'api/balanceSheetInvoices/helpers';

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

  const { data: clients = [] } = useClientsQuery(currentCity);

  const queryClient = useQueryClient();
  const queryMetadata = getBalanceSheetInvoicesQuery(balanceSheet);
  const { data: invoices = [] } = useQuery({ ...queryMetadata });

  const onAddDetail = (detail: IBalanceSheetInvoices[]) => {
    queryClient.setQueryData(queryMetadata.queryKey, [...invoices, ...detail]);
  };

  const [inEditMode, setInEditMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const onEditButtonPress = () => setInEditMode(!inEditMode);

  const totalRevenues = invoices?.reduce(
    (acc, invoice) => {
      acc.total = acc.total + invoice.total;
      if (invoice.paiementType === PaiementMethod.CASH) {
        acc.cash = acc.cash + invoice.total;
      } else if (invoice.paiementType === PaiementMethod.CB) {
        acc.cb = acc.cb + invoice.total;
      } else if (invoice.paiementType === PaiementMethod.CHECK) {
        acc.check = acc.check + invoice.total;
      }

      return acc;
    },
    { total: 0, cash: 0, check: 0, cb: 0 }
  );
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

            {currentMarket && balanceSheet && currentCity && invoices?.length > 0 ? (
              <PDFDownloadLink
                document={
                  <BalanceSheetPDF
                    currentMarket={currentMarket}
                    currentCity={currentCity}
                    balanceSheet={balanceSheet}
                    invoices={invoices}
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
                  <TableCell align="left" sx={{ width: '25%' }}>
                    Client
                  </TableCell>
                  <TableCell align="center" sx={{ width: '25%' }}>
                    Moyen de paiement
                  </TableCell>
                  <TableCell align="center" sx={{ width: '25%' }}>
                    Facture
                  </TableCell>
                  <TableCell align="center">A payé</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices?.map(invoice => {
                  const client = clients.find(client => client.id === invoice.clientId);
                  return (
                    <TableRow
                      key={invoice.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell id={client?.id} component="th" scope="client" align="left">
                        {`${client?.firstName} ${client?.lastName}`}
                      </TableCell>
                      <TableCell id={invoice.id} component="th" scope="client" align="center">
                        {`${invoice?.paiementType}`}
                      </TableCell>
                      <TableCell id={invoice.id} component="th" scope="client" align="center">
                        {`${invoice?.invoiceId}`}
                      </TableCell>
                      <TableCell id={invoice.id} component="th" scope="client" align="center">
                        {`${invoice?.total} €`}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper} sx={{ width: '25%', marginTop: 2 }}>
            <Table aria-label="simple table" size="small">
              <TableBody>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="client" align="left" sx={{ width: '75%' }}>
                    Total Cash
                  </TableCell>
                  <TableCell component="th" scope="client" align="center">
                    {`${totalRevenues.cash} €`}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="client" align="left" sx={{ width: '75%' }}>
                    Total CB
                  </TableCell>
                  <TableCell component="th" scope="client" align="center">
                    {`${totalRevenues.cb} €`}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="client" align="left" sx={{ width: '75%' }}>
                    Total Cheque
                  </TableCell>
                  <TableCell component="th" scope="client" align="center">
                    {`${totalRevenues.check} €`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" sx={{ width: '75%' }}>
                    Total
                  </TableCell>
                  <TableCell align="center">{`${totalRevenues.total} €`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Dialog>
      {currentCity && currentMarket && (
        <BalanceSheetInvoicesModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          balanceSheet={balanceSheet}
          onAddDetail={onAddDetail}
          invoiceId={invoices?.length + 1}
          currentCity={currentCity}
          currentMarket={currentMarket}
        />
      )}
    </React.Fragment>
  );
};
