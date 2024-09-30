import Dialog from '@mui/material//Dialog';
import DialogContent from '@mui/material//DialogContent';
// import Icon from '@mui/material//Icon';
import { grey } from '@mui/material//colors';
import { createStyles, makeStyles } from '@mui/styles';
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
  Grid,
  Typography,
  IconButton
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IBalanceSheetDetails, IBalanceSheet } from 'types/types';
import { config } from 'config';
import { useMutation } from '@tanstack/react-query';
import useSelectedData from 'contexts/market/useSelectedData';
import { formatResponse, formatQueryData } from 'api/utils';
import { useClientsQuery } from 'api/clients/hooks';
import { usePricingsQuery } from 'api/pricings/hooks';

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

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1
    },
    // primaryColor: {
    //   color: '#3333FF'
    // },
    // secondaryColor: {
    //   color: grey[700]
    // },

    padding: {
      padding: 0
    },
    mainHeader: {
      backgroundColor: grey[100],
      padding: 20,
      paddingLeft: 40,
      alignItems: 'center'
    },
    mainContent: {
      paddingLeft: 40,
      padding: 20
    },
    secondaryContainer: {
      padding: '20px 25px',
      backgroundColor: grey[200]
    }
  })
);

interface BalanceSheetDetailsModalProps {
  open: boolean;
  onClose: () => void;
  balanceSheet: IBalanceSheet;
  onAddDetail: (arg0: IBalanceSheetDetails[]) => void;
}

const BalanceSheetDetailsModal: React.FC<BalanceSheetDetailsModalProps> = ({
  open,
  onClose,
  balanceSheet,
  onAddDetail
}) => {
  const classes = useStyles();
  const [selectedClientId, setSelectedClientId] = useState<string>();

  const { currentCity, currentMarket } = useSelectedData();
  const { data: pricings = [] } = usePricingsQuery(currentMarket);

  const handleClientChange = (event: SelectChangeEvent) => {
    setSelectedClientId(event.target.value);
  };

  const { data: clients = [] } = useClientsQuery(currentCity, res => {
    res.length && setSelectedClientId(res[0].id);
  });

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

  const mutation = useMutation({
    mutationFn: (newBalanceSheetDetail: IBalanceSheetDetails) => {
      console.log('mutationFn', newBalanceSheetDetail);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatQueryData(newBalanceSheetDetail))
      };
      return fetch(`${config.API_URL}balanceSheetDetail?`, requestOptions)
        .then(response => response.json())
        .then(response => formatResponse(response));
    },
    onSuccess: (data, variables) => {
      onAddDetail(data as IBalanceSheetDetails[]);
      //   queryClient.setQueryData(
      //     ['details', balanceSheet?.id],
      //     [...details, ...(data as IBalanceSheetDetails[])]
      //   );
      console.log('Dans le onSuccess, data :', data, 'variables :', variables);
    },
    onError: error => {
      console.error('Error adding balance sheet details:', error);
    }
  });

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
    onClose();
  };

  return (
    <Dialog className={classes.root} /*maxWidth="md"*/ open={open} onClose={() => onClose()}>
      <DialogContent className={classes.padding}>
        <Grid container>
          <Grid item xs={12}>
            <Grid container direction="row" className={classes.mainHeader}>
              <Grid item xs={11}>
                <Typography variant="h5" color={'#263dad'}>
                  Ajouter un nouveau client
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  edge="end"
                  //align="right"
                  color="inherit"
                  aria-label="Close"
                  //style={{ padding: 8 }}
                  className={classes.padding}
                  onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid container direction="row" className={classes.mainContent}>
              <Grid item xs={7}>
                {/* <TextField
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  label="Prénom"
                  id="prenom"
                  //inputRef={firstNameRef}
                /> */}
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
              </Grid>
              <Grid direction="row" container xs={12} sx={{ marginTop: 2 }}>
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
                </FormControl>
                <TextField
                  disabled
                  id="outlined-number"
                  label="Prix €"
                  //type="number"
                  variant="outlined"
                  value={total}
                  sx={{
                    // '& .MuiInputBase-input.Mui-disabled': {
                    //   WebkitTextFillColor: '#000000'
                    // },
                    marginLeft: 2,
                    width: 100
                  }}
                />
              </Grid>
              <Grid item container /*ju*/ sx={{ marginTop: 2 }}>
                <Grid item xs={7} sm={3} md={3}>
                  <Button
                    variant="contained"
                    size="medium"
                    style={{ marginTop: 5 }}
                    onClick={handleAddDetail}>
                    Valider
                  </Button>
                </Grid>
                <Grid item xs={7} sm={3} md={3}>
                  <Button
                    onClick={onClose}
                    variant="contained"
                    size="medium"
                    style={{ marginTop: 5 }}>
                    Annuler
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default BalanceSheetDetailsModal;
