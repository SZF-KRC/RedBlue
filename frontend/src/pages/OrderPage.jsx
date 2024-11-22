// frontend/src/pages/OrderPage.jsx

/*
OrderPage component for requesting additional study hours:
1. Collects user details and order quantity through a form.
2. Ensures users accept terms and conditions and GDPR before submission.
3. Sends the order to the API, validates inputs, and handles errors.
4. Redirects users to the order-pending page upon successful submission.

This component streamlines the process of placing study hour orders with built-in validations.
*/

import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// Initial form state for capturing user input
const INITIAL_FORM_DATA = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  hours: 1, // Default number of hours
  terms_accepted: false,
  gdpr_accepted: false,
};

// Page title and description displayed on the form
const PAGE_TITLE = "Order of study hours";
const PAGE_DESCRIPTION = "To continue, please fill in the following information and confirm the terms and conditions and GDPR.";

function OrderPage() { 
  const { fetchOrderStatus } = useAuth(); // Fetches and updates order status from context
  const navigate = useNavigate(); // Navigation utility for redirecting users
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  /**
   * Handles changes in form inputs, updating state dynamically.
   * @param {Event} e - The change event from the form input
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

   /**
   * Handles form submission by sending user data to the API and managing navigation.
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/order/create/", formData);
      if (response.status === 201) {
        alert("The order has been successfully sent.");
        await fetchOrderStatus(); // Updates order status after submission
        navigate("/order-pending"); // Redirects to the order-pending page
        setFormData(INITIAL_FORM_DATA); // Resets the form after submission
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = Object.entries(error.response.data)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");

        alert(errors || "Invalid request data.");
      } else {
        console.error("Failed to send order:", error);
        alert("An error occurred while sending the order. Please try again.");
      }
    }
  };

  /**
   * Renders a reusable input field for the form.
   * @param {string} label - The label for the input field
   * @param {string} name - The name of the input field
   * @param {string} type - The type of the input field (default: "text")
   * @param {Object} extraProps - Additional props for the input field
   * @returns {JSX.Element} The input field component
   */
  const renderInput = (label, name, type = "text", extraProps = {}) => (
    <div className="form-group mb-3">
      <label>{label}:</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="form-control"
        required
        {...extraProps}
      />
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center mb-4">{PAGE_TITLE}</h1>
          <p className="text-center mb-4">{PAGE_DESCRIPTION}</p>
          <form onSubmit={handleSubmit} className="order-form">
            {renderInput("Name", "first_name")}
            {renderInput("Surname", "last_name")}
            {renderInput("Email", "email", "email")}
            {renderInput("Phone number", "phone", "tel")}
            {renderInput("Address", "address")}
            {renderInput("Number of hours", "hours", "number", { min: 1 })}
            <div className="form-check mb-2">
              <input
                type="checkbox"
                name="terms_accepted"
                checked={formData.terms_accepted}
                onChange={handleChange}
                className="form-check-input"
                required
              />
              <label className="form-check-label">
                I accept the <Link to="/terms">terms and conditions</Link>
              </label>
            </div>
            <div className="form-check mb-4">
              <input
                type="checkbox"
                name="gdpr_accepted"
                checked={formData.gdpr_accepted}
                onChange={handleChange}
                className="form-check-input"
                required
              />
              <label className="form-check-label">
                I agree to the <Link to="/privacy-policy">Privacy Policy (GDPR)</Link>
              </label>
            </div>
            <button type="submit" className="btn btn-primary w-100">Send the order</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default OrderPage;
