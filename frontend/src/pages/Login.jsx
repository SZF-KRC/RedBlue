// frontend/src/pages/Login.jsx

import React from "react";
import { useNavigate } from "react-router-dom"; 
import Form from "../components/Form";

function Login() {
  const navigate = useNavigate(); 

  return (
    <div className="container py-5"> 
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4"> 
        
          <Form route="/api/token/" method="login" />
          <div className="text-center mt-4">
            <p>Don't have an account?</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/register')} 
            >
              Register Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

