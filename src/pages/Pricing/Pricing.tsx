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
import RootContainer from '../RootContainer/RootContainer';
import styles from './styles';
import { useTranslation } from 'react-i18next';

const Pricing: React.FC = () => {
  const { currentMarket } = useSelectedData();
  const { t } = useTranslation();

  const { data: pricings = [] } = usePricingsQuery(currentMarket);

  if (!currentMarket) {
    return null;
  }
  return (
    <RootContainer title={t('page.pricings.title')}>
      <Box sx={styles.container}>
        <Box sx={styles.tableContainer}>
          <TableContainer component={Paper} sx={{ height: '60%' }}>
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
