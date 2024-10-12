import Dialog from '@mui/material//Dialog';
import DialogContent from '@mui/material//DialogContent';
import { v6 as uuid } from 'uuid';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Button,
  TextField,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';

import React, { useState } from 'react';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IBalanceSheetDetails, IBalanceSheet, PaiementMethod } from 'types/types';
import useSelectedData from 'contexts/market/useSelectedData';
import { useClientsQuery } from 'api/clients/hooks';
import { usePricingsQuery } from 'api/pricings/hooks';
import { useBalanceSheetDetailsMutation } from 'api/balanceSheetDetails/hooks';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

interface BalanceSheetDetailsModalProps {
  open: boolean;
  onClose: () => void;
  balanceSheet: IBalanceSheet;
  onAddDetail: (arg0: IBalanceSheetDetails[]) => void;
  invoiceId: number;
}

enum fieldError {
  EMPTY = 0,
  ALREADY_EXISTS = 1,
  MALFORMED = 2
}

type errorfield = 'client' | 'total' | 'paiementType';

const BalanceSheetDetailsModal: React.FC<BalanceSheetDetailsModalProps> = ({
  open,
  onClose,
  balanceSheet,
  onAddDetail,
  invoiceId
}) => {
  const { t } = useTranslation();
  const [selectedClientId, setSelectedClientId] = useState<string>();
  const [selectedPaiementMethod, setSelectedPaiementMethod] = useState<string>(PaiementMethod.CASH);

  const { currentCity, currentMarket } = useSelectedData();
  const { data: pricings = [] } = usePricingsQuery(currentMarket);

  const [errorMap, setErrorMap] = useState<Record<errorfield, fieldError | null>>({
    client: null,
    total: null,
    paiementType: null
  });

  const handleClientChange = (event: SelectChangeEvent) => {
    setSelectedClientId(event.target.value);
  };

  const { data: clients = [] } = useClientsQuery(
    currentCity,
    ['clients', currentCity?.id || ''],
    res => {
      res.length && setSelectedClientId(res[0].id);
    }
  );

  const [selectedPricingsIds, setSelectedPricingsIds] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedPricingsIds>) => {
    const {
      target: { value }
    } = event;
    console.log('value', value, 'id', event.target);
    setSelectedPricingsIds(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const total = selectedPricingsIds.reduce((acc, id) => {
    const pricing = pricings.find(pricing => pricing.id === id);
    return acc + (pricing?.price || 0);
  }, 0);

  const mutation = useBalanceSheetDetailsMutation({ onSuccess: data => onAddDetail(data) });

  const handleAddDetail = () => {
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
    const currentCityPrefix = ('00' + currentCity?.invoicePrefix).slice(-3);
    const currentMarketPrefix = ('00' + currentMarket?.invoicePrefix).slice(-3);
    const currentMonthPrefix = ('0' + balanceSheet.date.getMonth()).slice(-2);
    const currentDayPrefix = ('0' + balanceSheet.date.getDay()).slice(-2);
    const currentInvoiceId = ('00000' + invoiceId).slice(-7);
    const fullInvoiceId = `${currentCityPrefix}-${currentMarketPrefix}-${balanceSheet.date.getFullYear()}${currentMonthPrefix}${currentDayPrefix}-${currentInvoiceId}`;
    selectedClientId &&
      total &&
      balanceSheet?.id &&
      mutation.mutate({
        id: uuid(),
        clientId: selectedClientId,
        total: total,
        balanceSheetId: balanceSheet?.id,
        paiementType: selectedPaiementMethod as PaiementMethod,
        invoiceId: fullInvoiceId
      });
    onClose();
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogContent>
        <Grid container>
          <Grid direction="column">
            <Box sx={styles.header}>
              <Typography variant="h5" color={'primary.main'} textAlign={'center'}>
                {t('newDetailsModal.title')}
              </Typography>
            </Box>
            <Grid container direction="column" spacing={1} sx={{ marginTop: 1 }}>
              <Divider>{t('newDetailsModal.client')}</Divider>
              <FormControl>
                <InputLabel id="ville-select-label">Client</InputLabel>
                <Select
                  required
                  error={errorMap.client !== null}
                  labelId="ville-select-label"
                  id="ville-select"
                  value={selectedClientId}
                  label={t('newDetailsModal.input.city.label')}
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
              <Divider>{t('newDetailsModal.bill')}</Divider>
              <Grid direction="row" sx={{ marginTop: 2 }}>
                <FormControl sx={{ width: 300 }} error={errorMap.total !== null}>
                  <InputLabel id="pricings-multiple-checkbox-label">Tag</InputLabel>
                  <Select
                    required
                    labelId="pricings-multiple-checkbox-label"
                    id="pricings-multiple-checkbox"
                    multiple
                    value={selectedPricingsIds}
                    onChange={handleChange}
                    input={<OutlinedInput label={t('newDetailsModal.input.pricing.label')} />}
                    renderValue={selected =>
                      selected
                        .map(id => pricings.find(pricing => pricing.id === id)?.name || '')
                        .join(', ')
                    }
                    MenuProps={MenuProps}>
                    {pricings.map(pricing => (
                      <MenuItem key={pricing.id} value={pricing.id} id={pricing.id}>
                        <Checkbox checked={selectedPricingsIds.includes(pricing.id)} />
                        <ListItemText primary={pricing.name} />
                      </MenuItem>
                    ))}
                  </Select>
                  {errorMap.total !== null && <FormHelperText>Error</FormHelperText>}
                </FormControl>
                <TextField
                  disabled
                  id="outlined-number"
                  label={t('newDetailsModal.input.pricing.price')}
                  variant="outlined"
                  value={total}
                  sx={{
                    marginLeft: 2,
                    width: 100
                  }}
                />
              </Grid>
              <Grid direction="row" sx={{ marginTop: 2 }}>
                <FormControl>
                  <InputLabel id="paiement-select-label">Paiement method</InputLabel>
                  <Select
                    required
                    error={errorMap.paiementType !== null}
                    labelId="paiement-select-label"
                    id="paiement-select"
                    value={selectedPaiementMethod}
                    label={t('newDetailsModal.input.paiementMethod.label')}
                    onChange={event => setSelectedPaiementMethod(event.target.value)}
                    sx={{
                      minWidth: 120
                    }}>
                    {Object.values(PaiementMethod)?.map(paiementMethodValue => (
                      <MenuItem
                        key={paiementMethodValue}
                        value={paiementMethodValue}
                        id={paiementMethodValue}>
                        {paiementMethodValue}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Box sx={styles.buttonsContainer}>
                <Button
                  onClick={onClose}
                  variant="contained"
                  size="medium"
                  style={{ marginTop: 5 }}>
                  {t('button.cancel')}
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  style={{ marginTop: 5, marginLeft: 5 }}
                  onClick={handleAddDetail}>
                  {t('button.validate')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default BalanceSheetDetailsModal;
