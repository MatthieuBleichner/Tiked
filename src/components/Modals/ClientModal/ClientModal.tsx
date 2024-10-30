import React, { useRef, useState } from 'react';
import Dialog from '@mui/material//Dialog';
import DialogContent from '@mui/material//DialogContent';
import Grid from '@mui/material//Grid2';
import Box from '@mui/material//Box';
import Button from '@mui/material//Button';
import Typography from '@mui/material//Typography';
import TextField from '@mui/material//TextField';
import Divider from '@mui/material/Divider';
import { ICity, IClient } from 'types/types';
import { v6 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onClientCreated: (client: IClient) => void;
  city: ICity;
}

enum fieldError {
  EMPTY = 0,
  ALREADY_EXISTS = 1,
  MALFORMED = 2
}

type errorfield = 'firstName' | 'lastName' | 'siret';

function ClientModal(props: ClientModalProps) {
  const { open, onClose, onClientCreated, city } = props;

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const sirenRef = useRef<HTMLInputElement>(null);
  const postalCodeRef = useRef<HTMLInputElement>(null);
  const cityAddressRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const mailRef = useRef<HTMLInputElement>(null);
  const jobRef = useRef<HTMLInputElement>(null);

  const [errorMap, setErrorMap] = useState<Record<errorfield, fieldError | null>>({
    firstName: null,
    lastName: null,
    siret: null
  });

  const { t } = useTranslation();

  const onValidate = () => {
    if (
      firstNameRef?.current?.value === null ||
      firstNameRef?.current?.value === undefined ||
      firstNameRef?.current?.value === '' ||
      lastNameRef?.current?.value === null ||
      lastNameRef?.current?.value === undefined ||
      lastNameRef?.current?.value === '' ||
      sirenRef?.current?.value === null ||
      sirenRef?.current?.value === undefined ||
      sirenRef?.current?.value === ''
    ) {
      setErrorMap({
        firstName: firstNameRef?.current?.value ? null : fieldError.EMPTY,
        lastName: lastNameRef?.current?.value ? null : fieldError.EMPTY,
        siret: sirenRef?.current?.value ? null : fieldError.EMPTY
      });
      return;
    }
    onClientCreated({
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      siren: sirenRef.current.value,
      id: uuid(),
      cityId: city.id,
      postalCode: postalCodeRef.current?.valueAsNumber,
      city: cityAddressRef.current?.value,
      address: addressRef.current?.value,
      mail: mailRef.current?.value,
      job: jobRef.current?.value
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
                {t('newClientModal.title')}
              </Typography>
            </Box>
            <Grid container direction="column" spacing={1} sx={{ marginTop: 1 }}>
              <Divider>{t('newClientModal.identity')}</Divider>
              <Box sx={styles.textFieldContainer}>
                <TextField
                  error={errorMap.firstName !== null}
                  margin="dense"
                  variant="outlined"
                  label={t('newClientModal.input.firstname.label')}
                  id="prenom"
                  inputRef={firstNameRef}
                  required
                  sx={{ paddingRight: 1 }}
                  helperText={errorMap.firstName === fieldError.EMPTY ? 'Incorrect entry.' : ''}
                />
                <TextField
                  error={errorMap.lastName !== null}
                  margin="dense"
                  variant="outlined"
                  label={t('newClientModal.input.lastname.label')}
                  id="nom-de-famille"
                  inputRef={lastNameRef}
                  required
                  sx={{ paddingLeft: 1 }}
                  helperText={errorMap.lastName === fieldError.EMPTY ? 'Incorrect entry.' : ''}
                />
              </Box>
              <Box sx={styles.textFieldContainer}>
                <TextField
                  margin="dense"
                  variant="outlined"
                  label={t('newClientModal.input.lastname.postalcode')}
                  id="codePostal"
                  inputRef={postalCodeRef}
                  type="number"
                  sx={{ paddingRight: 1 }}
                />
                <TextField
                  margin="dense"
                  variant="outlined"
                  label={t('newClientModal.input.lastname.city')}
                  id="ville"
                  inputRef={addressRef}
                  sx={{ paddingLeft: 1 }}
                />
              </Box>
              <Box sx={styles.textFieldContainer}>
                <TextField
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  label={t('newClientModal.input.lastname.address')}
                  id="address"
                  inputRef={addressRef}
                  sx={{ paddingRight: 1 }}
                />
              </Box>
              <Box sx={styles.textFieldContainer}>
                <TextField
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  label={t('newClientModal.input.lastname.mail')}
                  id="email"
                  inputRef={mailRef}
                  sx={{ paddingRight: 1 }}
                  type="email"
                />
              </Box>

              <Divider>{t('newClientModal.activity')}</Divider>
              <Box sx={styles.textFieldContainer}>
                <TextField
                  margin="dense"
                  variant="outlined"
                  label={t('newClientModal.input.lastname.activity')}
                  id="job"
                  inputRef={jobRef}
                  sx={{ paddingRight: 1 }}
                />
              </Box>
              <Grid>
                <TextField
                  required
                  margin="dense"
                  variant="outlined"
                  label={t('newClientModal.input.lastname.siret')}
                  id="siren"
                  inputRef={sirenRef}
                  error={errorMap.siret !== null}
                  helperText={errorMap.siret === fieldError.EMPTY ? 'Incorrect entry.' : ''}
                />
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
                  onClick={onValidate}>
                  {t('button.validate')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ClientModal;
