import React from 'react';
import Box from '@mui/material/Box';
import { useQuery } from '@tanstack/react-query';
import { IClient, ICity } from 'types/types';
import useSelectedData from 'contexts/market/useSelectedData';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const API_URL = 'https://tiked-back.vercel.app/api/';

const fetchClients: (arg0: ICity | undefined) => Promise<Response> = async currentCity => {
  return fetch(`${API_URL}clients?cityId=${currentCity?.id}`);
};

const Clients: React.FC = () => {
  const { currentCity } = useSelectedData();

  const { data: clients } = useQuery<IClient[]>({
    queryKey: ['clients', currentCity?.id],
    queryFn: () => fetchClients(currentCity).then(res => res.json()),
    enabled: !!currentCity?.id
  });

  console.log('clients', clients);
  return (
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
              <TableCell>First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">Siren</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients?.map(client => (
              <TableRow key={client.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="client">
                  {client.firstname}
                </TableCell>
                <TableCell align="right">{client.lastname}</TableCell>
                <TableCell align="right">{client.siren}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Clients;
