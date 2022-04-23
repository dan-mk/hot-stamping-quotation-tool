import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./containers/clients/Dashboard/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='*' element={'404 Not found'} />
          <Route path="/" element={<Navigate to="/clients" replace />} />
          <Route path="/clients/*" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
