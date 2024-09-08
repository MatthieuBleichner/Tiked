import React, { useRef } from 'react';
import Dialog from '@mui/material//Dialog';
import DialogContent from '@mui/material//DialogContent';
import Grid from '@mui/material//Grid';
import IconButton from '@mui/material//IconButton';
import Button from '@mui/material//Button';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material//Typography';
import TextField from '@mui/material//TextField';
// import Icon from '@mui/material//Icon';
import { grey } from '@mui/material//colors';
import { createStyles, makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { ICity } from 'types/types';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1
    },
    primaryColor: {
      color: '#3333FF'
    },
    secondaryColor: {
      color: grey[700]
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

interface CityModalProps {
  open: boolean;
  onClose: () => void;
  onCityCreated: (city: ICity) => void;
}

function CityModal(props: CityModalProps) {
  const classes = useStyles();
  const { open, onClose, onCityCreated } = props;

  const theme = useTheme();

  const cityRef = useRef<HTMLInputElement>(null);
  const postalCodeRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const onValidate = () => {
    console.log('city', cityRef?.current?.value, urlRef?.current?.value);
    if (
      cityRef?.current?.value === null ||
      cityRef?.current?.value === undefined ||
      // urlRef?.current?.value === null ||
      // urlRef?.current?.value === undefined ||
      postalCodeRef?.current?.value === null ||
      postalCodeRef?.current?.value === undefined
    )
      return;
    onCityCreated({
      id: cityRef.current.value,
      name: cityRef?.current?.value
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
                <Typography variant="h5" color={theme.palette.primary.main}>
                  Ajouter une nouvelle ville
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  edge="end"
                  //align="right"
                  color="inherit"
                  aria-label="Close"
                  //style={{ padding: 8 }}
                  //className={classes.padding}
                  onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid container direction="row" className={classes.mainContent} spacing={1}>
              <Grid item xs={7}>
                <TextField
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  label="Ville"
                  id="city"
                  inputRef={cityRef}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  //fullWidth
                  margin="dense"
                  variant="outlined"
                  label="Code Postal"
                  id="postal-code"
                  inputRef={postalCodeRef}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  //fullWidth
                  margin="dense"
                  variant="outlined"
                  label="Image url"
                  id="image-url"
                  inputRef={urlRef}
                />
              </Grid>
              <Grid item container /*ju*/>
                <Grid item xs={7} sm={3} md={3}>
                  <Button
                    variant="contained"
                    size="medium"
                    style={{ marginTop: 5 }}
                    onClick={onValidate}>
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
}

export default CityModal;
