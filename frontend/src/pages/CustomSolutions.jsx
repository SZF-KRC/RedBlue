// frontend/src/pages/CustomSolutions.jsx

import React from "react";
import "../styles/CustomSolutions.css";
import hourlyServiceImage from "../pictures/solution1.jpg"; 
import longTermCooperationImage from "../pictures/solution2.jpg";

function CustomSolutions() {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Dynamic Solutions for Your Digital Success</h1>
      <p className="text-center mb-4">
        Looking for dependable, innovative solutions to bring your project to life? At 
        <strong> RedBlue Academy</strong>, we excel in delivering professional, tailor-made programming 
        services in <strong>Python</strong>, <strong>Java</strong>, and <strong>C#</strong>. Whether you need custom software development, 
        system optimization, or a brand-new application, our expertise ensures solutions crafted 
        precisely to your needs.
      </p>

      <p className="text-center mb-4">
        <strong>Why Choose Us?</strong>
        <ul className="list-unstyled">
          <li>✅ Expertise Across Technologies</li>
          <li>✅ Custom Solutions Tailored to Your Goals</li>
          <li>✅ Speed, Quality, and a Personalized Approach</li>
        </ul>
      </p>

      <p className="text-center mb-5">
        Let’s transform your ideas into impactful, functional results. 
        <strong> Contact us today</strong> and start building your digital future with confidence!
      </p>

      <p className="text-center mb-5">
        📧 <strong>project@redblueacademy.com</strong>
      </p>

      <div className="row text-center">
        {/* Hourly Service Section */}
        <div className="col-md-6 mb-4">
          <img src={hourlyServiceImage} alt="Hourly Service" className="img-fluid solution-image mb-3" />
          <h3>Hourly Service</h3>
          <p className="price">150 € / hour</p>
          <p className="service-description">Flexible solutions designed to address your immediate needs, with rapid delivery and precision.</p>
        </div>

        {/* Long-term Cooperation Section */}
        <div className="col-md-6 mb-4">
          <img src={longTermCooperationImage} alt="Long-term Cooperation" className="img-fluid solution-image mb-3" />
          <h3>Long-term Cooperation</h3>
          <p className="price">Price by Agreement</p>
          <p className="service-description">Tailored partnerships for sustained success, ensuring seamless development and optimization.</p>
        </div>
      </div>
    </div>
  );
}

export default CustomSolutions;


