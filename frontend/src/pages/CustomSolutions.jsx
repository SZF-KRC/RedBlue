// frontend/src/pages/CustomSolutions.jsx

import React from "react";
import "../styles/CustomSolutions.css";
import hourlyServiceImage from "../pictures/solution1.jpg"; 
import longTermCooperationImage from "../pictures/solution2.jpg";

function CustomSolutions() {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Innovative Solutions for Your Digital World</h1>
      <p className="text-center mb-4">
        Are you looking for reliable and creative solutions for your project? Our company
        offers professional custom programming services in Python, Java, and C#. We
        specialize in custom software development, system optimization, and the creation of
        new applications. With our experience in various programming languages, we can
        design and implement effective solutions tailored to your specific needs.
      </p>

      <p className="text-center mb-5">
        With us, you will receive quality, speed, and a personalized approach. Contact us, and
        together we will turn your ideas into successful solutions!
      </p>

      <p className="text-center mb-5">
        <strong>project@redblueacademy.com</strong>
      </p>

      <div className="row text-center">
        {/* Hourly Service Section */}
        <div className="col-md-6 mb-4">
          <img src={hourlyServiceImage} alt="Hourly Service" className="img-fluid solution-image mb-3" />
          <h3>Hourly Service</h3>
          <p className="price">150 € / hour</p>
        </div>

        {/* Long-term Cooperation Section */}
        <div className="col-md-6 mb-4">
          <img src={longTermCooperationImage} alt="Long-term Cooperation" className="img-fluid solution-image mb-3" />
          <h3>Long-term Cooperation</h3>
          <p className="price">Price by Agreement</p>
        </div>
      </div>
    </div>
  );
}

export default CustomSolutions;

