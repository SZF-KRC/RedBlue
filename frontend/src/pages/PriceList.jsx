// frontend/src/pages/PriceList.jsx

import React from "react";
import "../styles/PriceList.css";
import { Link } from "react-router-dom";
import hourlyAssistantImage from "../pictures/pay24.jpg"; 
import dedicatedStudentImage from "../pictures/pay12.jpg";
import professionalImage from "../pictures/pay9.jpg";

function PriceList() {
  return (
    <div className="price-list-container">
      <h1 className="text-center mb-4">"Learn more, pay less!"</h1>
      <p className="text-center mb-5">
        "We reward diligent students by allowing them to pay less as they learn more. 
        Currently, we offer individual online courses."
      </p>
      <div className="row text-center">
        
        {/* Hourly Assistant Section */}
        <div className="col-md-4 mb-4">
          <img src={hourlyAssistantImage} alt="Hourly Assistant" className="img-fluid price-image mb-3" />
          <h2>"Hourly Assistant"</h2>
          <p className="price">24 € / hour</p>
          <p>Ideal for those who need to learn something new in a short time or need help on their journey in information technology.</p>
        </div>

        {/* Dedicated Student Section */}
        <div className="col-md-4 mb-4">
          <img src={dedicatedStudentImage} alt="Dedicated Student" className="img-fluid price-image mb-3" />
          <h2>"Dedicated Student"</h2>
          <p className="price">12 € / hour</p>
          <p>A 30+ hour course is a great choice for those who want to join the IT community and need a solid start.</p>
        </div>

        {/* Professional Section */}
        <div className="col-md-4 mb-4">
          <img src={professionalImage} alt="Professional" className="img-fluid price-image mb-3" />
          <h2>"Be a Professional"</h2>
          <p className="price">9 € / hour</p>
          <p>A 160+ hour course offers comprehensive learning that will turn you into a professional, ready to succeed in the job market.</p>
        </div>
      </div>
      <div className="text-center mt-5">
        <Link to="/register" className="btn btn-success btn-lg">
          Start Your Journey Today – Register Now!
        </Link>
      </div>
    </div>
  );
}

export default PriceList;
