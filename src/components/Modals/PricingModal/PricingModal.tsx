import Dialog from '@mui/material//Dialog';
import DialogContent from '@mui/material//DialogContent';
import { FormControl, InputLabel, MenuItem, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState } from 'react';
import Select from '@mui/material/Select';
import { IMarket, IPricing, DynamicUnit } from 'types/types';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  onPricingCreated: (pricing: IPricing) => void;
  currentMarket: IMarket;
}

interface PricingModalSuspenseProps {
  onClose: () => void;
  onPricingCreated: (pricing: IPricing) => void;
  currentMarket: IMarket;
}

const getTranslationKey = (unit: DynamicUnit) => {
  switch (unit) {
    case DynamicUnit.NONE:
      return 'pricing.dynamicValue.none.label';
    case DynamicUnit.METERS:
      return 'pricing.dynamicValue.meters.label';
    case DynamicUnit.HOURS:
      return 'pricing.dynamicValue.hours.label';
    default:
      return '';
  }
};

const PricingModalSuspense: React.FC<PricingModalSuspenseProps> = ({
  onClose,
  onPricingCreated,
  currentMarket
}) => {
  const { t } = useTranslation();

  const [selectedDynamicValue, setSelectedDynamicValue] = useState(DynamicUnit.NONE);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);

  const handleAddPricing = () => {
    onPricingCreated({
      id: '0',
      name: title,
      price: price ?? 0,
      marketId: currentMarket.id,
      dynamicUnit: selectedDynamicValue
    });
    onClose();
  };

  return (
    <>
      <Grid direction="column">
        <Box sx={styles.header}>
          <Typography variant="h5" color={'primary.main'} textAlign={'center'}>
            {t('newPricingModal.title')}
          </Typography>
        </Box>
        <TextField
          margin="dense"
          variant="outlined"
          label={t('newPricingModal.input.name')}
          id="name"
          sx={{ paddingRight: 1, marginTop: 2 }}
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
        <Box sx={{ display: 'flex', marginTop: 2 }}>
          <TextField
            margin="dense"
            variant="outlined"
            label={t('newPricingModal.input.price')}
            id="name"
            sx={{ paddingRight: 1 }}
            type="number"
            value={price}
            onChange={event => setPrice(parseFloat(event.target.value))}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">€</InputAdornment>
              }
            }}
          />
          <FormControl sx={{ marginTop: 1 }}>
            <InputLabel id="value-select-label">
              {t('newPricingModal.input.dynamicValue.name')}
            </InputLabel>
            <Select
              required
              labelId="value-select-label"
              id="paiement-select"
              value={selectedDynamicValue}
              label={t('newPricingModal.input.dynamicValue.name')}
              onChange={event => {
                setSelectedDynamicValue(event.target.value as DynamicUnit);
              }}
              sx={{
                minWidth: 120
              }}>
              {Object.values(DynamicUnit)?.map(dynamicValue => (
                <MenuItem key={dynamicValue} value={dynamicValue} id={dynamicValue}>
                  {t(getTranslationKey(dynamicValue))}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={styles.buttonsContainer}>
          <Button onClick={onClose} variant="contained" size="medium" style={{ marginTop: 5 }}>
            {t('button.cancel')}
          </Button>
          <Button
            variant="contained"
            size="medium"
            style={{ marginTop: 5, marginLeft: 5 }}
            disabled={!title || !price}
            onClick={handleAddPricing}>
            {t('button.validate')}
          </Button>
        </Box>
      </Grid>
    </>
  );
};

const PricingModal: React.FC<PricingModalProps> = ({
  open,
  onClose,
  onPricingCreated,
  currentMarket
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Grid container>
          {open && (
            <PricingModalSuspense
              onClose={onClose}
              onPricingCreated={onPricingCreated}
              currentMarket={currentMarket}
            />
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
export default PricingModal;
