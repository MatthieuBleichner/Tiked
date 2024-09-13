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
import { ICity, IClient } from 'types/types';
import { v6 as uuid } from 'uuid';

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

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onClientCreated: (client: IClient) => void;
  city: ICity;
}

function ClientModal(props: ClientModalProps) {
  const classes = useStyles();
  const { open, onClose, onClientCreated, city } = props;

  const theme = useTheme();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const sirenRef = useRef<HTMLInputElement>(null);

  const onValidate = () => {
    console.log(
      'client',
      firstNameRef?.current?.value,
      lastNameRef?.current?.value,
      sirenRef?.current?.value
    );
    if (
      firstNameRef?.current?.value === null ||
      firstNameRef?.current?.value === undefined ||
      lastNameRef?.current?.value === null ||
      lastNameRef?.current?.value === undefined ||
      sirenRef?.current?.value === null ||
      sirenRef?.current?.value === undefined
    )
      return;
    onClientCreated({
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      siren: sirenRef.current.value,
      id: uuid(),
      cityId: city.id
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
                  label="Prénom"
                  id="prenom"
                  inputRef={firstNameRef}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  //fullWidth
                  margin="dense"
                  variant="outlined"
                  label="Nom de Famille"
                  id="nom-de-famille"
                  inputRef={lastNameRef}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  //fullWidth
                  margin="dense"
                  variant="outlined"
                  label="numéro de siren"
                  id="siren"
                  inputRef={sirenRef}
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

export default ClientModal;
