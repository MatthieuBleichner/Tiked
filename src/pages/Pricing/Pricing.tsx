import React from 'react';
import Box from '@mui/material/Box';
import useSelectedData from 'contexts/market/useSelectedData';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { usePricingsQuery } from 'api/pricings/hooks';
import RootContainer from '../RootContainer';

const Pricing: React.FC = () => {
  const { currentMarket } = useSelectedData();

  const { data: pricings = [] } = usePricingsQuery(currentMarket);

  if (!currentMarket) {
    return null;
  }
  return (
    <RootContainer title={'Tarifs'}>
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
                  <TableCell>Nom</TableCell>
                  <TableCell align="right">Tarif</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pricings?.map(pricing => (
                  <TableRow
                    key={pricing.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="client">
                      {pricing.name}
                    </TableCell>
                    <TableCell align="right">{pricing.price} €</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </RootContainer>
  );
};

export default Pricing;
