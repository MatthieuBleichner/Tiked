import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
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
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { formatResponse, formatQueryData } from 'api/utils';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import useSelectedData from 'contexts/market/useSelectedData';
import { v6 as uuid } from 'uuid';

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
  //   const [open, setOpen] = React.useState(false);

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  //   const handleClose = () => {
  //     setOpen(false);
  //   };

  const [selectedClientId, setSelectedClientId] = useState<string>();
  const [total, setTotal] = useState<number>(0);

  const { currentCity, currentMarket } = useSelectedData();

  const handleClientChange = (event: SelectChangeEvent) => {
    setSelectedClientId(event.target.value);
  };

  const handleTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTotal(Number(event.target.value));
  };

  const { data: clients = [] } = useQuery<IClient[]>({
    queryKey: ['clients', currentCity?.id],
    queryFn: () =>
      fetchClients(currentCity)
        .then(res => res.json())
        .then(res => {
          res.length && setSelectedClientId(res[0].id);
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

  const mutation = useMutation({
    mutationFn: (newBalanceSheetDetail: IBalanceSheetDetails) => {
      console.log('mutationFn', newBalanceSheetDetail);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatQueryData(newBalanceSheetDetail))
      };
      return fetch(`${config.API_URL}balanceSheetDetail?`, requestOptions)
        .then(response => response.json())
        .then(response => formatResponse(response));
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ['details', balanceSheet?.id],
        [...details, ...(data as IBalanceSheetDetails[])]
      );
      console.log('Dans le onSuccess, data :', data, 'variables :', variables);
    },
    onError: error => {
      console.error('Error adding balance sheet details:', error);
    }
  });

  const handleAddDetail = () => {
    selectedClientId &&
      total &&
      balanceSheet?.id &&
      mutation.mutate({
        id: uuid(),
        clientId: selectedClientId,
        total: total,
        balanceSheetId: balanceSheet?.id
      });
  };

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
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
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
            <FormControl>
              <InputLabel
                id="ville-select-label"
                sx={{
                  color: '#2e2e2e',
                  '&.Mui-focused': {
                    color: '#000'
                  }
                }}>
                Client
              </InputLabel>
              <Select
                labelId="ville-select-label"
                id="ville-select"
                value={selectedClientId}
                label="Age"
                onChange={handleClientChange}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'darkgray'
                  },
                  '& .MuiInputLabel-outlined': {
                    color: '#2e2e2e',
                    fontWeight: 'red'
                  },
                  minWidth: 120
                }}>
                {clients !== undefined &&
                  clients?.map(client => (
                    <MenuItem key={client.id} value={client.id}>
                      {`${client.firstName} ${client.lastName}`}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              id="outlined-number"
              label="Prix €"
              type="number"
              variant="outlined"
              onChange={handleTotalChange}
            />
            <Button
              variant="contained"
              size="medium"
              style={{ marginTop: 5 }}
              onClick={handleAddDetail}>
              Ajouter
            </Button>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
        </Box>
      </Dialog>
    </React.Fragment>
  );
};
