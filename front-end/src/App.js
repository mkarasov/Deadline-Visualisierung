import React from "react";
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
  const isAuth = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
