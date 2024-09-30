import React from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SelectedDataProvider from 'contexts/market/SelectedDataProvider';

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: '#263dad'
    }
  },
  typography: {
    h4: {
      fontWeight: 600,
      color: '#263dad'
    }
  }
});
function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SelectedDataProvider>
          <Dashboard />
        </SelectedDataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
export default App;
