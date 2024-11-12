// frontend/src/components/AuthContext.jsx

/*
Manages user authentication and order status:
1. AuthProvider: Tracks authentication status, username, and order status (completed/pending) using context.
2. Login & Logout: Handles token storage, user login tracking, and session management.
3. Token Handling: Validates and refreshes access tokens, with an auto-refresh every 5 minutes.

This component centralizes user authentication and order state for use across the app.
*/

import React, { createContext, useState, useContext, useEffect } from "react";
import * as jwtDecode from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";  

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("USERNAME"));
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderPending, setOrderPending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    if (token && isTokenValid(token)) {
      setIsAuthenticated(true);
      setUsername(localStorage.getItem("USERNAME"));
      fetchOrderStatus();
    } else if (refreshToken) {
      refreshAccessToken();
    }
  }, []);

  const fetchOrderStatus = async () => {
    try {
      const res = await api.get("/api/user/profile/"); 
      setOrderCompleted(res.data.order_completed);
      setOrderPending(res.data.order_pending);
    } catch (error) {
      console.error("Failed to fetch order status:", error);
      setOrderCompleted(false);
      setOrderPending(false);
    }
  };
  
  

  const login = async (username, accessToken, refreshToken) => {
    setIsAuthenticated(true);
    setUsername(username);
    localStorage.setItem("USERNAME", username);
    localStorage.setItem(ACCESS_TOKEN, accessToken);  
    localStorage.setItem(REFRESH_TOKEN, refreshToken);  
    await fetchOrderStatus();

    try {
      const res = await api.post("/api/user/login/track/");
      console.log("Track login response:", res.data);
      fetchOrderStatus();
    } catch (error) {
      console.error("Failed to track login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem("USERNAME");
    setIsAuthenticated(false);
    setUsername(null);
    setOrderCompleted(false);
    setOrderPending(false);
  };

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode.default(token);
      return decoded.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
      if (res.status === 200 && res.data.access) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthenticated(true);
        setUsername(localStorage.getItem("USERNAME"));
        fetchOrderStatus();
      } else {
        logout();
      }
    } catch (error) {
      console.log("Error during token refresh:", error);
      logout();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token && !isTokenValid(token)) {
        refreshAccessToken();
      }
    }, 5 * 60 * 1000);  

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, orderCompleted, orderPending, login, logout, fetchOrderStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


