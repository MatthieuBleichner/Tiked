import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IClient, ICity } from 'types/types';
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
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { formatResponse, formatQueryData } from 'api/utils';
import { config } from 'config';

/**
 * Fetch clients from the API
 * @param currentCity - The current city
 * @returns The clients
 */
const fetchClients: (arg0: ICity | undefined) => Promise<Response> = async currentCity => {
  return fetch(`${config.API_URL}clients?cityId=${currentCity?.id}`);
};

const Clients: React.FC = () => {
  const queryClient = useQueryClient();
  const { currentCity } = useSelectedData();
  //const [clients, setClients] = useState<IClient[]>([]);

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
            Clients
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
          onClick={() => setIsOpened(true)}>
          Nouveau client
        </Button>
      </Box>
      <Box
        sx={{
          flex: 1,
          borderRadius: 5,
          //marginTop: 2,
          height: '80%',
          padding: 2,
          display: 'flex'
          //paddingLeft: 5
        }}>
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
    </Box>
  );
};

export default Clients;
