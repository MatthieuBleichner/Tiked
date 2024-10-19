import React, { useState } from 'react';
import Box from '@mui/material/Box';
import useSelectedData from 'contexts/market/useSelectedData';
import RootContainer from '../RootContainer/RootContainer';

import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';

import BalanceSheetInvoicesModal from '../Modals/BalanceSheetInvoicesModal/BalanceSheetInvoicesModal';

const Invoice: React.FC = () => {
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);
  const { currentCity, currentMarket } = useSelectedData();

  return (
    <RootContainer title={t('page.invoice.title')}>
      <Box
        style={{
          width: '100%',
          height: '70%',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex'
        }}>
        <Button
          variant="contained"
          onClick={() => {
            setOpenModal(true);
          }}>
          {t('page.invoice.newInvoice')}
        </Button>
      </Box>
      {currentCity && currentMarket && (
        <BalanceSheetInvoicesModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          currentCity={currentCity}
          currentMarket={currentMarket}
        />
      )}
    </RootContainer>
  );
};

export default Invoice;
