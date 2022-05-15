import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./containers/clients/Dashboard/Dashboard";
import Configuration from "./containers/configuration/all/Configuration";

function App() {
  const loading = useSelector(state => state.ui.loading);

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
      { loading && <div
        style={{
          background: '#00000088',
          position: 'absolute', left: 0, top: 0,
          height: '100%', width: '100%',
          zIndex: 9999,
        }}></div> }
    </>
  );
}

export default App;
