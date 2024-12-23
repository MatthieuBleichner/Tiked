import Dialog from '@mui/material//Dialog';
import DialogContent from '@mui/material//DialogContent';
import { FormControl, InputLabel, MenuItem, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import React, { useState, useMemo } from 'react';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IBalanceSheetInvoices, IBalanceSheet, PaiementMethod, IMarket, ICity } from 'types/types';
import { useClientsQuery } from 'api/clients/hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePricingsQuery } from 'api/pricings/hooks';
import { useBalanceSheetInvoicesMutation } from 'api/balanceSheetInvoices/hooks';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import ConfirmationModal from '../ConfirmationModal';
import PricingsSelector from './PricingsSelector';
import { getBalanceSheetQuery } from 'api/balanceSheets/helpers';
import { useBalanceSheetMutation } from 'api/balanceSheets/hooks';
import { usePaiementMethodTranslation } from 'hooks/usePaiementMethodTranslation';

interface BalanceSheetInvoicesModalProps {
  open: boolean;
  onClose: () => void;
  balanceSheet?: IBalanceSheet; // balance sheet can be undefined when creating invoices on the fly
  onAddDetail?: (arg0: IBalanceSheetInvoices[]) => void;
  currentMarket: IMarket;
  currentCity: ICity;
}

enum fieldError {
  EMPTY = 0,
  ALREADY_EXISTS = 1,
  MALFORMED = 2
}

type errorfield = 'client' | 'total' | 'paiementType';

interface BalanceSheetInvoicesModalSuspenseProps {
  onClose: () => void;
  balanceSheet?: IBalanceSheet; // balance sheet can be undefined when creating invoices on the fly
  onAddDetail?: (arg0: IBalanceSheetInvoices[]) => void;
  currentMarket: IMarket;
  currentCity: ICity;
}

const BalanceSheetInvoicesModalSuspense: React.FC<BalanceSheetInvoicesModalSuspenseProps> = ({
  onClose,
  balanceSheet,
  onAddDetail,
  currentMarket,
  currentCity
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const translatePaiementMethod = usePaiementMethodTranslation();

  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedPaiementMethod, setSelectedPaiementMethod] = useState<string>(PaiementMethod.CASH);

  const { data: pricings = [] } = usePricingsQuery(currentMarket);

  const [errorMap, setErrorMap] = useState<Record<errorfield, fieldError | null>>({
    client: null,
    total: null,
    paiementType: null
  });

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const allBalanceSheetsQuery = getBalanceSheetQuery(currentMarket);

  // if no balance sheet defined - try to find an exisiting one corresponding to the date
  const { data: sheets = [] } = useQuery<IBalanceSheet[]>({
    ...getBalanceSheetQuery(currentMarket, new Date(selectedDate?.toString())),
    enabled: currentMarket && !balanceSheet
  });

  const currentSheet = useMemo(() => {
    return sheets?.length ? sheets[0] : balanceSheet;
  }, [sheets, balanceSheet]);

  const handleClientChange = (event: SelectChangeEvent) => {
    setSelectedClientId(event.target.value);
  };

  const { data: clients = [] } = useClientsQuery(currentCity, res => {
    res.length && setSelectedClientId(res[0].id);
  });

  const invoicesMutation = useBalanceSheetInvoicesMutation({
    onSuccess: data => onAddDetail?.(data)
  });

  const [total, setTotal] = useState(0);

  const newInvoicesMutation = (sheet: IBalanceSheet) => {
    if (selectedClientId === null || selectedClientId === undefined || selectedClientId === '')
      return;

    invoicesMutation.mutate({
      clientId: selectedClientId,
      total: total,
      balanceSheetId: sheet.id,
      paiementType: selectedPaiementMethod as PaiementMethod
    });
  };

  const sheetMutation = useBalanceSheetMutation({
    onSuccess: data => {
      if (!data.length) return;
      queryClient.invalidateQueries({ queryKey: allBalanceSheetsQuery.queryKey });
      newInvoicesMutation(data[0]);
    }
  });

  const handleAddDetail = () => {
    if (
      !currentSheet ||
      selectedClientId === null ||
      selectedClientId === undefined ||
      selectedClientId === '' ||
      !total ||
      selectedPaiementMethod === null ||
      selectedPaiementMethod === undefined ||
      selectedPaiementMethod === ''
    ) {
      setErrorMap({
        client: selectedClientId ? null : fieldError.EMPTY,
        total: total ? null : fieldError.EMPTY,
        paiementType: selectedPaiementMethod ? null : fieldError.EMPTY
      });
      return;
    }
    newInvoicesMutation(currentSheet);
    onClose();
  };

  const handleAddDetailAndBalanceSheet = () => {
    if (
      selectedClientId === null ||
      selectedClientId === undefined ||
      selectedClientId === '' ||
      !total ||
      selectedPaiementMethod === null ||
      selectedPaiementMethod === undefined ||
      selectedPaiementMethod === ''
    ) {
      setErrorMap({
        client: selectedClientId ? null : fieldError.EMPTY,
        total: total ? null : fieldError.EMPTY,
        paiementType: selectedPaiementMethod ? null : fieldError.EMPTY
      });
      return;
    }
    setConfirmationModalOpen(true);
  };

  const onValidateSheetAndInvoicesCreation = () => {
    sheetMutation.mutate({
      date: new Date(selectedDate.toString()),
      marketId: currentMarket.id,
      id: '0'
    });
    setConfirmationModalOpen(false);
    onClose();
  };

  const [isConfirmationOpened, setConfirmationModalOpen] = useState(false);

  return (
    <>
      <Grid direction="column">
        <Box sx={styles.header}>
          <Typography variant="h5" color={'primary.main'} textAlign={'center'}>
            {t('newInvoiceModal.title')}
          </Typography>
        </Box>
        <Grid container direction="column" spacing={1} sx={{ marginTop: 1 }}>
          {!balanceSheet && (
            <React.Fragment>
              <Divider>{t('newInvoiceModal.date')}</Divider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={'Date'}
                  closeOnSelect={false}
                  value={selectedDate}
                  onAccept={value => value && setSelectedDate(value)}
                />
              </LocalizationProvider>
            </React.Fragment>
          )}
          <Divider>{t('newInvoiceModal.client')}</Divider>
          {selectedClientId && (
            <FormControl>
              <InputLabel id="ville-select-label">Client</InputLabel>
              <Select
                required
                error={errorMap.client !== null}
                labelId="ville-select-label"
                id="ville-select"
                value={selectedClientId}
                label={t('newInvoiceModal.input.city.label')}
                onChange={handleClientChange}
                sx={{
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
          )}
          <Divider>{t('newInvoiceModal.bill')}</Divider>
          <PricingsSelector pricings={pricings} onUpdateTotal={setTotal} />
          <Grid direction="row" sx={{ marginTop: 2 }}>
            <FormControl>
              <InputLabel id="paiement-select-label">
                {t('newInvoiceModal.input.paiementMethod.label')}
              </InputLabel>
              <Select
                required
                error={errorMap.paiementType !== null}
                labelId="paiement-select-label"
                id="paiement-select"
                value={selectedPaiementMethod}
                label={t('newInvoiceModal.input.paiementMethod.label')}
                onChange={event => setSelectedPaiementMethod(event.target.value)}
                sx={{
                  minWidth: 120
                }}>
                {Object.values(PaiementMethod)?.map(paiementMethodValue => (
                  <MenuItem
                    key={paiementMethodValue}
                    value={paiementMethodValue}
                    id={paiementMethodValue}>
                    {translatePaiementMethod(paiementMethodValue)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Box sx={styles.buttonsContainer}>
            <Button onClick={onClose} variant="contained" size="medium" style={{ marginTop: 5 }}>
              {t('button.cancel')}
            </Button>
            <Button
              variant="contained"
              size="medium"
              style={{ marginTop: 5, marginLeft: 5 }}
              onClick={currentSheet ? handleAddDetail : handleAddDetailAndBalanceSheet}>
              {t('button.validate')}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <ConfirmationModal
        open={isConfirmationOpened}
        onValidate={onValidateSheetAndInvoicesCreation}
        onClose={() => setConfirmationModalOpen(false)}
        title={t('newInvoiceModal.confirmTitle')}
        body={t('newInvoiceModal.confirmBody')}
      />
    </>
  );
};

const BalanceSheetInvoicesModal: React.FC<BalanceSheetInvoicesModalProps> = ({
  open,
  onClose,
  balanceSheet,
  onAddDetail,
  currentMarket,
  currentCity
}) => {
  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogContent>
        <Grid container>
          {open && (
            <BalanceSheetInvoicesModalSuspense
              onClose={onClose}
              balanceSheet={balanceSheet}
              onAddDetail={onAddDetail}
              currentMarket={currentMarket}
              currentCity={currentCity}
            />
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
export default BalanceSheetInvoicesModal;
