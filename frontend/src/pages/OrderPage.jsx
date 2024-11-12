// frontend/src/pages/OrderPage.jsx

/*
OrderPage component for placing study hour orders:
1. Captures user details and number of hours for order submission.
2. Requires users to accept terms and GDPR policy before submitting.
3. On successful submission, redirects to the order pending page and updates order status.

This component allows users to request additional study hours with essential validations.
*/

import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function OrderPage() {
  const { fetchOrderStatus } = useAuth(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",  
    last_name: "",   
    email: "",
    phone: "",
    address: "",
    hours: 1,
    terms_accepted: false,  
    gdpr_accepted: false,    
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/order/create/", formData);
      if (response.status === 201) {
        alert("The order has been successfully sent.");
        await fetchOrderStatus(); 
        navigate("/order-pending"); 
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          address: "",
          hours: 1,
          terms_accepted: false,
          gdpr_accepted: false,
        });
      }
    } catch (error) {
      console.error("Failed to send order:", error);
      alert("An error occurred while sending the order. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center mb-4">Order of study hours</h1>
          <p className="text-center mb-4">
          To continue, please fill in the following information and confirm the terms and conditions and GDPR.
          </p>
          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-group mb-3">
              <label>Name:</label>
              <input
                type="text"
                name="first_name"  
                value={formData.first_name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Surname:</label>
              <input
                type="text"
                name="last_name"  
                value={formData.last_name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Phone number:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Number of hours:</label>
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="form-control"
                min="1"
                required
              />
            </div>
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
