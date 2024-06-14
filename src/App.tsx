import Cities from './pages/Cities/Cities';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Cities />} />
      </Routes>
    </Router>
  );
}
export default App;
