import React, { Suspense } from 'react';
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
import RootContainerLoading from '../RootContainer/RootContainerLoading';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from 'react-error-boundary';
import { DynamicUnit, IMarket } from 'types/types';

interface PricingProps {
  currentMarket: IMarket;
}

const PricingSuspense: React.FC<PricingProps> = ({ currentMarket }) => {
  const { t } = useTranslation();

  const { data: pricings = [] } = usePricingsQuery(currentMarket);

  if (!currentMarket) {
    return null;
  }
  return (
    <RootContainer title={t('page.pricings.title')}>
      <Box sx={styles.container}>
        <Box sx={styles.tableContainer}>
          <TableContainer component={Paper} sx={{ height: '100%' }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell size="small">Nom</TableCell>
                  <TableCell align="right" size="small">
                    Tarif
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pricings?.map(pricing => {
                  console.log('pricing', pricing);
                  return (
                    <TableRow
                      key={pricing.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="client" size="small">
                        {pricing.name}
                      </TableCell>
                      <TableCell align="right" size="small">
                        {pricing.price} €
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </RootContainer>
  );
};

const Pricing: React.FC = () => {
  const { currentMarket } = useSelectedData();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Suspense fallback={<RootContainerLoading title={t('page.balancesheet.title')} />}>
        <ErrorBoundary fallback={<div>Something went wrong!</div>}>
          {currentMarket && <PricingSuspense currentMarket={currentMarket} />}
        </ErrorBoundary>
      </Suspense>
    </React.Fragment>
  );
};

export default Pricing;
