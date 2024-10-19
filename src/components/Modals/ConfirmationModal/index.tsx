import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onValidate: () => void;
  title: string;
  body: string;
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  title,
  body,
  onValidate
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{body}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" size="medium" onClick={onClose}>
            {t('button.cancel')}
          </Button>
          <Button variant="contained" size="medium" onClick={onValidate} autoFocus>
            {t('button.validate')}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ConfirmationModal;
