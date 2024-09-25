import React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
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
import { IBalanceSheetDetails, IBalanceSheet, ICity, IClient } from 'types/types';
import { config } from 'config';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { formatResponse } from 'api/utils';
import useSelectedData from 'contexts/market/useSelectedData';
import BalanceSheetDetailsPDF from '../../PDF/BalanceSheetDetailsPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DetailsCreation from './DetailsCreation';
const styles = {
  btn: {
    borderRadius: '3px',
    border: '1px solid gray',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    padding: '3px',
    fontSize: '11px',
    color: '#4f4f4f',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetchBalanceSheetDetails: (
  arg0: IBalanceSheet | undefined | null
) => Promise<Response> = async balanceSheet => {
  if (balanceSheet) {
    return fetch(`${config.API_URL}balanceSheetDetails?balanceSheetId=${balanceSheet?.id}`);
  } else {
    return Promise.resolve(new Response());
  }
};

const fetchClients: (arg0: ICity | undefined) => Promise<Response> = async currentCity => {
  return fetch(`${config.API_URL}clients?cityId=${currentCity?.id}`);
};

interface BalanceSheetModalProps {
  open: boolean;
  handleClose: () => void;
  balanceSheet: IBalanceSheet | undefined | null;
}
export const BalanceSheetModal = ({ open, handleClose, balanceSheet }: BalanceSheetModalProps) => {
  const { currentCity, currentMarket } = useSelectedData();

  const { data: clients = [] } = useQuery<IClient[]>({
    queryKey: ['clients', currentCity?.id],
    queryFn: () =>
      fetchClients(currentCity)
        .then(res => res.json())
        .then(res => {
          return formatResponse(res) as IClient[];
        }),
    enabled: !!currentCity?.id
  });

  const queryClient = useQueryClient();
  const { data: details = [] } = useQuery<IBalanceSheetDetails[]>({
    queryKey: ['details', balanceSheet?.id],
    queryFn: () =>
      fetchBalanceSheetDetails(balanceSheet)
        .then(res => res.json())
        .then(res => {
          return formatResponse(res) as IBalanceSheetDetails[];
        }),
    enabled: !!balanceSheet
  });

  const onAddDetail = (detail: IBalanceSheetDetails[]) => {
    console.log('detail', detail);
    queryClient.setQueryData(['details', balanceSheet?.id], [...details, ...detail]);
  };

  console.log('details', details);
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
              <Typography
                variant="h4"
                noWrap
                component="div"
                sx={{ color: '#263dad', fontWeight: 600 }}>
                {currentMarket?.name + ' - ' + currentCity?.name}
              </Typography>
            </Box>

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
                <div style={styles.btn}>
                  <DownloadIcon />
                  <span>PDF</span>
                </div>
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
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ color: '#263dad', fontWeight: 600 }}>
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
        {!!clients && (
          <Box
            sx={{
              margin: 2,
              //width: '50%',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row'
            }}>
            <DetailsCreation balanceSheet={balanceSheet} onAddDetail={onAddDetail} />
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
                  <TableCell>Client</TableCell>
                  <TableCell>A payé</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details?.map(detail => {
                  const client = clients.find(client => client.id === detail.clientId);
                  return (
                    <TableRow
                      key={detail.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell id={client?.id} component="th" scope="client">
                        {`${client?.firstName} ${client?.lastName}`}
                      </TableCell>
                      <TableCell id={detail.id} component="th" scope="client">
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
                  <TableCell component="th" scope="client">
                    Total
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="client"
                    sx={{ margin: 'auto', textAlign: 'center' }}>
                    {`${details?.reduce((acc, detail) => acc + detail.total, 0)} €`}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Dialog>
    </React.Fragment>
  );
};
