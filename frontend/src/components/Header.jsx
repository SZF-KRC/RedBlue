// frontend/src/components/Header.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import logoImage from "../pictures/redbluelogo.png";
import { useAuth } from "../components/AuthContext";

function Header() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-sm fixed-top">
      <nav className="container d-flex justify-content-between align-items-center py-3">
        <img src={logoImage} alt="RedBlue Academy" className="logo img-fluid" />
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon">&#9776;</span>
        </button>
        <ul className={`nav ${isOpen ? "d-block" : "d-none d-lg-flex"}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-link">Services</Link>
          </li>
          <li className="nav-item">
            <Link to="/price-list" className="nav-link">Price list</Link>
          </li>
          <li className="nav-item">
            <Link to="/custom-solutions" className="nav-link">Custom solutions</Link>
          </li>
          <li className="nav-item">
            <Link to="/faq" className="nav-link">FAQ</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/calendar" className="calendar">Calendar</Link>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
              </li>
              <li className="nav-item">
                <span className="hello-gradient">Hello, </span>
                <span className="username-gradient">{username}</span>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;

