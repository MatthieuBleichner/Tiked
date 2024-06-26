import Dashboard from './pages/Dashboard/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopMenu from 'components/TopMenu';
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
      <TopMenu />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
export default App;
