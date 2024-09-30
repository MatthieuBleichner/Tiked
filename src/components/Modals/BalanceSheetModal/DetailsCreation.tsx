import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextField,
  Button
} from '@mui/material';
import React, { useState } from 'react';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IBalanceSheetDetails, IBalanceSheet } from 'types/types';
import useSelectedData from 'contexts/market/useSelectedData';
import { v6 as uuid } from 'uuid';
import { usePricingsQuery } from 'api/pricings/hooks';
import { useClientsQuery } from 'api/clients/hooks';
import { useBalanceSheetDetailsMutation } from 'api/balanceSheetDetails/hooks';

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

interface DetailCreationProps {
  balanceSheet: IBalanceSheet | undefined | null;
  onAddDetail: (detail: IBalanceSheetDetails[]) => void;
}

const DetailsCreation = ({ balanceSheet, onAddDetail }: DetailCreationProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string>();

  const { currentCity, currentMarket } = useSelectedData();
  const { data: pricings = [] } = usePricingsQuery(currentMarket);

  const handleClientChange = (event: SelectChangeEvent) => {
    setSelectedClientId(event.target.value);
  };

  const { data: clients = [] } = useClientsQuery(currentCity, ['clients', currentCity?.id || '']);

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
    selectedClientId &&
      total &&
      balanceSheet?.id &&
      mutation.mutate({
        id: uuid(),
        clientId: selectedClientId,
        total: total,
        balanceSheetId: balanceSheet?.id
      });
  };
  return (
    <Box>
      <FormControl>
        <InputLabel
          id="ville-select-label"
          sx={{
            color: '#2e2e2e',
            '&.Mui-focused': {
              color: '#000'
            }
          }}>
          Client
        </InputLabel>
        <Select
          labelId="ville-select-label"
          id="ville-select"
          value={selectedClientId}
          label="Age"
          onChange={handleClientChange}
          sx={{
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'darkgray'
            },
            '& .MuiInputLabel-outlined': {
              color: '#2e2e2e',
              fontWeight: 'red'
            },
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
      <FormControl sx={{ width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedPricingsIds}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={selected =>
            selected.map(id => pricings.find(pricing => pricing.id === id)?.name || '').join(', ')
          }
          MenuProps={MenuProps}>
          {pricings.map(pricing => (
            <MenuItem key={pricing.id} value={pricing.id} id={pricing.id}>
              <Checkbox checked={selectedPricingsIds.includes(pricing.id)} />
              <ListItemText primary={pricing.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        disabled
        id="outlined-number"
        label="Prix €"
        //type="number"
        variant="outlined"
        value={total}
        sx={{
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: '#000000'
          }
        }}
      />
      <Button variant="contained" size="medium" onClick={handleAddDetail}>
        Ajouter
      </Button>
    </Box>
  );
};

export default DetailsCreation;
