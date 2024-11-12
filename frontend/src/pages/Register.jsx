// frontend/src/pages/Register.jsx

import React from "react";
import Form from "../components/Form";

function Register() {
  return (
    <div className="container py-5"> 
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4"> 
          <Form route="/api/user/register/" method="register" />
        </div>
      </div>
    </div>
  );
}

export default Register;



