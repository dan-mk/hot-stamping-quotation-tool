import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ClientList from './containers/clients/ClientList/ClientList';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='*' element={'404 Not found'} />
          <Route path="/" element={<Navigate to="/clients" replace />} />
          <Route path="/clients" element={<ClientList/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
