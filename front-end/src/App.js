import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Header from "./components/Header";
import Profile from "./pages/Profile";

function AppWrapper(){
  const location = useLocation();
  const isAuth = !!localStorage.getItem("token");

  return (
    <>
      {location.pathname !== "/login" && <Header />}

      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" />} />
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
