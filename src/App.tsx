import React from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[100]
    }
  }
});
function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard />
    </ThemeProvider>
  );
}
export default App;
