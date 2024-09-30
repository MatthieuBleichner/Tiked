import Dialog from '@mui/material//Dialog';
import DialogContent from '@mui/material//DialogContent';
import { grey } from '@mui/material//colors';
import { createStyles, makeStyles } from '@mui/styles';
import { v6 as uuid } from 'uuid';
import { Button, Grid, Typography, IconButton } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';

import { IBalanceSheet } from 'types/types';
import { config } from 'config';
import { useMutation } from '@tanstack/react-query';
import useSelectedData from 'contexts/market/useSelectedData';
import { formatResponse, formatQueryData } from 'api/utils';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1
    },
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

interface IBalanceSheetResponse {
  id: string;
  marketId: string;
  date: string;
}
const buildBalanceSheet: (arg0: string, arg1: string, arg2: string) => IBalanceSheet = (
  id,
  marketId,
  date
) => {
  return {
    id: id,
    date: new Date(date),
    marketId: marketId
  };
};

interface BalanceSheetCreationModalProps {
  open: boolean;
  onClose: () => void;
  onAddSheeet: (arg0: IBalanceSheet[]) => void;
}

const BalanceSheetCreationModal: React.FC<BalanceSheetCreationModalProps> = ({
  open,
  onClose,
  onAddSheeet
}) => {
  const classes = useStyles();
  const { currentMarket } = useSelectedData();
  const [date, setDate] = useState<Dayjs>();
  const mutation = useMutation({
    mutationFn: (newSheet: IBalanceSheet) => {
      const formatedSheet = formatQueryData(newSheet);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatQueryData(formatedSheet))
      };
      return fetch(`${config.API_URL}balanceSheet?`, requestOptions)
        .then(response => response.json())
        .then(response => {
          return (formatResponse(response) as IBalanceSheetResponse[]).map(
            (sheet: { id: string; marketId: string; date: string }) =>
              buildBalanceSheet(sheet.id, sheet.marketId, sheet.date)
          ) as IBalanceSheet[];
        });
    },
    onSuccess: data => {
      onAddSheeet(data as IBalanceSheet[]);
    },
    onError: error => {
      console.error('Error adding sheet:', error);
    }
  });

  const handleAddDetail = () => {
    currentMarket &&
      mutation.mutate({
        id: uuid(),
        date: new Date(date?.toString() ?? ''),
        marketId: currentMarket?.id
      });
    onClose();
  };

  return (
    <Dialog className={classes.root} open={open} onClose={() => onClose()}>
      <DialogContent className={classes.padding}>
        <Grid container>
          <Grid item xs={12}>
            <Grid container direction="row" className={classes.mainHeader}>
              <Grid item xs={11}>
                <Typography variant="h5" color={'#263dad'}>
                  Ajouter un nouveau bilan
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={'Nouveau bilan'}
                    closeOnSelect={false}
                    slotProps={{
                      actionBar: {
                        sx: {
                          //color: '#263dad',
                          backgroundColor: '#263dad',
                          borderRadius: '2px',
                          borderColor: '#2196f3',
                          border: '1px solid',
                          flex: 1,
                          display: 'flex'
                        },
                        actions: ['accept']
                      }
                    }}
                    onAccept={value => value && setDate(value)}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item container sx={{ marginTop: 2 }}>
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

export default BalanceSheetCreationModal;
