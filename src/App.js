import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./containers/clients/Dashboard/Dashboard";
import Configuration from "./containers/configuration/all/Configuration";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='*' element={'404 Not found'} />
          <Route path="/" element={<Navigate to="/clients" replace />} />
          <Route path="/clients/*" element={<Dashboard />} />
          <Route path="/clients/:id/quotations/:quotationId/configurations/:configurationId" element={<Configuration />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
