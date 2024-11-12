// frontend/src/components/Form.jsx

/*
Form component for user login and registration:
1. Displays a form based on the specified method (login or register).
2. On submit, sends username and password to the API for authentication or registration.
3. Handles loading state, redirects to the calendar on successful login, or to the login page after registration.

This component centralizes form handling for authentication-related actions.
*/

import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../styles/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        const accessToken = res.data.access; 
        const refreshToken = res.data.refresh; 
        login(username, accessToken, refreshToken); 
        navigate("/calendar");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {loading }
      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
}

export default Form;
