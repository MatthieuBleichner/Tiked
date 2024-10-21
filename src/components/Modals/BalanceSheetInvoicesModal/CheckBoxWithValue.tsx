import React, { useState } from 'react';
import { IPricing } from 'types/types';

import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';

interface CheckBoxWithValueProps {
  pricing: IPricing;
  onChange?: ({ id, value }: { id: string; value: number }) => void;
}
const CheckBoxWithValue: React.FC<CheckBoxWithValueProps> = ({ pricing, onChange }) => {
  const [checkedState, setCheckedState] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedState(event.target.checked);
  };

  const handleTextfieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ id: pricing.id, value: event.target.valueAsNumber * pricing.price });
  };

  return (
    <Box key={pricing.id} sx={{ display: 'flex', flexDirection: 'row', alingItems: 'center' }}>
      <FormControlLabel
        control={<Checkbox id={pricing.id} onChange={handleChange} />}
        label={pricing.name}
      />
      {checkedState && (
        <TextField
          id={`TextField-${pricing.id}`}
          label={pricing.dynamicUnit}
          variant="outlined"
          //value={0}
          type={'number'}
          sx={{
            marginLeft: 2,
            width: 100
          }}
          onChange={handleTextfieldChange}
        />
      )}
    </Box>
  );
};

export default CheckBoxWithValue;
