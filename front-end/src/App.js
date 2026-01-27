import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Header from "./components/Header";

function AppWrapper(){
  const location = useLocation();
  const isAuth = !!localStorage.getItem("token");

  return (
    <>
      {location.pathname !== "/logn" && <Header />}

      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </>
  )
}

function App() {
  const isAuth = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
        <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
