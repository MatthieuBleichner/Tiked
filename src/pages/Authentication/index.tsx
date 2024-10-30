import React, { useEffect, useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import { useAuthenticateMutation } from 'api/authentication';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

enum fieldError {
  EMPTY = 0,
  ALREADY_EXISTS = 1,
  MALFORMED = 2
}

type errorfield = 'mail' | 'password';

export default function Authentication() {
  const { t } = useTranslation();
  const mailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const [errorMap, setErrorMap] = useState<Record<errorfield, fieldError | null>>({
    mail: null,
    password: null
  });

  const token = Cookies.get('token');
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp && decodedToken.exp * 1000 > Date.now()) {
        navigate('/Dashboard');
      }
    }
  }, [token]);

  const onAuthenticationSuccess: (arg0: string) => void = token => {
    document.cookie = 'token=' + token;
    navigate('/Dashboard');
  };

  const mutation = useAuthenticateMutation({ onSuccess: onAuthenticationSuccess });

  const onSubmit = () => {
    if (
      mailRef?.current?.value === null ||
      mailRef?.current?.value === undefined ||
      mailRef?.current?.value === '' ||
      passwordRef?.current?.value === null ||
      passwordRef?.current?.value === undefined ||
      passwordRef?.current?.value === ''
    ) {
      setErrorMap({
        mail: mailRef?.current?.value ? null : fieldError.EMPTY,
        password: passwordRef?.current?.value ? null : fieldError.EMPTY
      });
      return;
    }

    mutation.mutate({
      id: mailRef?.current?.value,
      password: passwordRef?.current?.value
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: { xs: '100%', md: '50%' },
          height: '50%'
        }}
        component={Paper}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: '80%', md: '50%' },
            height: '100%'
          }}>
          <Avatar sx={{ marginTop: 2, backgroundColor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ marginTop: 1 }}>
            TIKED
          </Typography>
          <TextField
            inputRef={mailRef}
            error={errorMap.mail !== null}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={t('authentication.textfield.id')}
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            inputRef={passwordRef}
            error={errorMap.password !== null}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('authentication.textfield.password')}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {mutation.isPending ? (
            <CircularProgress />
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={onSubmit}
              sx={{ marginTop: 2 }}>
              {t('authentication.button.signin')}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
