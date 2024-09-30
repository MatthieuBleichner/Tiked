import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IClient } from 'types/types';
import useSelectedData from 'contexts/market/useSelectedData';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ClientModal from 'components/Modals/ClientModal';
import Button from '@mui/material/Button';
import { formatResponse, formatQueryData } from 'api/utils';
import { config } from 'config';
import { useClientsQuery } from 'api/clients/hooks';
import RootContainer from '../RootContainer';
import { createStyles, makeStyles } from '@mui/styles';

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

const Clients: React.FC = () => {
  const classes = useStyles();

  const queryClient = useQueryClient();
  const { currentCity } = useSelectedData();

  const { data: clients = [] } = useClientsQuery(currentCity);

  const mutation = useMutation({
    mutationFn: (newClient: IClient) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatQueryData(newClient))
      };
      return fetch(`${config.API_URL}client?`, requestOptions)
        .then(response => response.json())
        .then(response => formatResponse(response));
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['clients', currentCity?.id], [...clients, ...(data as IClient[])]);
      console.log('Dans le onSuccess, data :', data, 'variables :', variables);
    },
    onError: error => {
      console.error('Error adding client:', error);
    }
  });

  const handleAddClient = (client: IClient) => {
    mutation.mutate(client);
  };

  const [open, setIsOpened] = useState(false);

  if (!currentCity) {
    return null;
  }
  return (
    <RootContainer title={'Clients'}>
      <Box className={classes.buttonWrapper}>
        <Button variant="contained" onClick={() => setIsOpened(true)}>
          Nouveau client
        </Button>
      </Box>
      <Box className={classes.body}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Prénom</TableCell>
                  <TableCell align="center">Nom</TableCell>
                  <TableCell align="center">Siren</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients?.map(client => (
                  <TableRow
                    key={client.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center" component="th" scope="client">
                      {client.firstName}
                    </TableCell>
                    <TableCell align="center">{client.lastName}</TableCell>
                    <TableCell align="center">{client.siren}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <ClientModal
          open={open}
          onClose={() => setIsOpened(false)}
          onClientCreated={handleAddClient}
          city={currentCity}
        />
      </Box>
    </RootContainer>
  );
};

export default Clients;
