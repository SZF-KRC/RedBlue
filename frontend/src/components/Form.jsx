// frontend/src/components/Form.jsx

/*
Form component for user login and registration with enhanced functionality:
1. Handles both login and registration processes dynamically based on the specified method (login or register).
2. On successful registration, automatically logs in the user and redirects to the calendar page. 
   If auto-login fails, redirects to the login page.
3. During login, retrieves access and refresh tokens, sets authentication state, and navigates to the calendar page.
4. Provides feedback for loading state and displays appropriate error messages for failed login or registration.
5. Centralizes form handling for authentication-related actions with a clean user experience.

This component ensures seamless authentication and user onboarding for the application.
*/


import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../styles/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState(""); // State for username input
  const [password, setPassword] = useState(""); // State for password input
  const [loading, setLoading] = useState(false); // Loading state to provide feedback during API calls
  const navigate = useNavigate(); // Navigation utility to programmatically redirect the user
  const { login } = useAuth(); // Authentication context for login functionality

  const name = method === "login" ? "Login" : "Register";

  // Handles form submission for both login and registration
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });

      if (method === "login") {
        // Handle login
        const accessToken = res.data.access;
        const refreshToken = res.data.refresh;
        login(username, accessToken, refreshToken);
        navigate("/calendar");
      } else {
        // Handle registration and auto-login
        try {
          const loginRes = await api.post("/api/token/", { username, password });
          const accessToken = loginRes.data.access;
          const refreshToken = loginRes.data.refresh;
          login(username, accessToken, refreshToken);
          navigate("/calendar"); // Redirect to calendar after successful login
        } catch (loginError) {
          alert("Registration succeeded, but automatic login failed. Please log in manually.");
          navigate("/login"); // Redirect to login page if auto-login fails
        }
      }
    } catch (error) {
      alert(method === "login" ? "Login failed. Please try again." : "Registration failed. Please try again.");
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
      {loading && <p>Loading...</p>}
      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
}

export default Form;

