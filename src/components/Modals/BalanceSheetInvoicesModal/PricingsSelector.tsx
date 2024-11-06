import React, { useEffect, useMemo } from 'react';

import Grid from '@mui/material/Grid2';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';

import { useTranslation } from 'react-i18next';
import CheckBoxWithValue from './CheckBoxWithValue';

import { IPricing, DynamicUnit } from 'types/types';

interface PricingSelectorProps {
  pricings: IPricing[];
  onUpdateTotal: (arg0: number) => void;
}
const PricingSelector: React.FC<PricingSelectorProps> = ({ pricings, onUpdateTotal }) => {
  const { t } = useTranslation();
  const pricingsWithDynamicValue = useMemo(
    () => pricings.filter(pricing => pricing.dynamicUnit !== DynamicUnit.NONE),
    [pricings]
  );

  const standardPricings = useMemo(
    () => pricings.filter(pricing => pricing.dynamicUnit === DynamicUnit.NONE),
    [pricings]
  );

  const [checkedState, setCheckedState] = React.useState(
    standardPricings.reduce(
      (acc, current) => {
        acc[current.id] = false;
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedState({
      ...checkedState,
      [event.target.id]: event.target.checked
    });
  };

  const [dynamicValueState, setDynamicValueState] = React.useState(
    pricingsWithDynamicValue.reduce(
      (acc, current) => {
        acc[current.id] = 0;
        return acc;
      },
      {} as Record<string, number>
    )
  );

  const handleDynamicValueChange = ({ id, value }: { id: string; value: number }) => {
    setDynamicValueState({
      ...dynamicValueState,
      [id]: value
    });
  };

  const total = useMemo(() => {
    const totalStandardPricing = Object.keys(checkedState).reduce((acc, id) => {
      const pricing = checkedState[id] ? pricings.find(pricing => pricing.id === id) : null;
      return acc + (pricing?.price || 0);
    }, 0);

    const totalDynamicValues = Object.values(dynamicValueState).reduce((acc, val) => {
      acc = !isNaN(val) ? Math.round((acc + val) * 100) / 100 : acc;
      return acc;
    }, 0);

    return totalStandardPricing + totalDynamicValues;
  }, [checkedState, dynamicValueState]);

  useEffect(() => {
    onUpdateTotal(total);
  }, [total]);

  return (
    <>
      <FormGroup row>
        {standardPricings.map(pricing => (
          <FormControlLabel
            key={pricing.id}
            control={
              <Checkbox
                checked={checkedState[pricing.id]}
                onChange={handleChange}
                id={pricing.id}
              />
            }
            label={pricing.name}
          />
        ))}
      </FormGroup>
      <FormGroup>
        {pricingsWithDynamicValue.map(pricing => (
          <CheckBoxWithValue
            key={pricing.id}
            pricing={pricing}
            onChange={handleDynamicValueChange}
          />
        ))}
      </FormGroup>
      <Grid direction="row" sx={{ marginTop: 2 }}>
        <TextField
          disabled
          id="outlined-number"
          label={t('newInvoiceModal.input.pricing.price')}
          variant="outlined"
          value={total}
        />
      </Grid>
    </>
  );
};

export default PricingSelector;
