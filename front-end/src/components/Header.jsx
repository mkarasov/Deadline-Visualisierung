import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuth = !!localStorage.getItem("token");
  const email = localStorage.getItem("email"); 

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  if (!isAuth) return null;

  return (
    <header className="header">
      <h1 className="logo">Deadline Dashboard</h1>

      <div className="userArea">
        <div className="avatar" onClick={() => setMenuOpen(!menuOpen)}>
          {email ? email[0].toUpperCase() : "U"}
        </div>

        {menuOpen && (
          <div className="dropdown">
            <div className="dropdownEmail">{email}</div>
            <button className="dropdownBtn" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
