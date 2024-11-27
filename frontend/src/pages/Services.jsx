// // frontend/src/pages/Services.jsx

import React from "react";
import "../styles/Services.css";

import javaImage from "../pictures/java.jpg"; 
import pythonImage from "../pictures/python.jpg";
import csharpImage from "../pictures/csharp.jpg";

function Services() {
  return (
    <div className="service-list-container"> 
      <h1 className="text-center mb-5 mt-5 page-title">Start Your Programming Journey with the Most Popular Languages</h1>

      {/* Java Section */}
      <div className="row mb-5">
        <div className="col-md-4">
          <img src={javaImage} alt="Java" className="img-fluid rounded" />
        </div>
        <div className="col-md-8">
          <h2>
            <span className="highlight-java">Java</span> - Your Gateway to Versatile Development
          </h2>
          <p>
            Are you ready to create apps that run everywhere? <span className="highlight-java">Java</span> is a powerful, beginner-friendly programming language used for developing everything from mobile apps to enterprise solutions. Its famous "write once, run anywhere" philosophy makes it one of the most versatile tools in the programming world. Whether you're dreaming of building the next blockbuster game or a cutting-edge Android app, <span className="highlight-java">Java</span> is your ticket to success.
          </p>
        </div>
      </div>

      {/* Python Section */}
      <div className="row mb-5">
        <div className="col-md-4">
          <img src={pythonImage} alt="Python" className="img-fluid rounded" />
        </div>
        <div className="col-md-8">
          <h2>
            <span className="highlight-python">Python</span> - The Language of the Future
          </h2>
          <p>
            Looking for simplicity and power? <span className="highlight-python">Python</span> is the perfect starting point. Its clean, beginner-friendly syntax lets you focus on problem-solving instead of wrestling with complex code. From web development to artificial intelligence and machine learning, <span className="highlight-python">Python</span> powers the technologies shaping tomorrow. If you're curious about data science, automation, or AI, <span className="highlight-python">Python</span> is the place to begin.
          </p>
        </div>
      </div>

      {/* C# Section */}
      <div className="row mb-5">
        <div className="col-md-4">
          <img src={csharpImage} alt="C#" className="img-fluid rounded" />
        </div>
        <div className="col-md-8">
          <h2>
            <span className="highlight-csharp">C#</span> - Power Your Creativity with Microsoft's Best
          </h2>
          <p>
            Want to create sleek, professional applications? <span className="highlight-csharp">C#</span> is a modern, versatile language perfect for building anything from dynamic websites to immersive games. As the backbone of Microsoft's .NET framework, <span className="highlight-csharp">C#</span> opens doors to app development for Windows, mobile platforms, and even virtual reality.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Services;

