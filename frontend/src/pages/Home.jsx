// frontend/src/pages/Home.jsx

import React from "react";
import "../styles/Home.css";
import javaImage from "../pictures/java.jpg";
import pythonImage from "../pictures/python.jpg";
import csharpImage from "../pictures/csharp.jpg";
import backgroundVideo from "../pictures/intro4.mp4";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      {/* Section 1 */}
      <section className="hero-section text-center py-5">
        <video autoPlay loop muted className="background-video">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="hero-content">
          <h1 className="display-4">Discover Your Potential</h1>
          <ul className="list-unstyled">
            <li>Education from absolute beginners</li>
            <li>Personalized Approach</li>
            <li>Unbeatable Prices</li>
          </ul>
          <Link to="/price-list" className="btn btn-primary mt-3">Join us!</Link>
        </div>
      </section>

      {/* Section 2 */}
      <section className="community-section text-center py-5">
        <div className="row">
          <div className="col-md-4">
            <h2>Professional Instructor</h2>
            <p>Gain knowledge from industry professionals.</p>
          </div>
          <div className="col-md-4">
            <h2>Interactive Learning</h2>
            <p>One of our greatest advantages is that we teach with the "learning through play" method.</p>
          </div>
          <div className="col-md-4">
            <h2>Motivating Environment</h2>
            <p>Join a community that will support you.</p>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="programming-languages-section text-center py-5">
        <h2>Learn the most popular programming languages with us</h2>
        <div className="row justify-content-center">
          <div className="col-md-3">
            <img src={javaImage} alt="Java" className="img-fluid mb-3" />
            <p>Java</p>
          </div>
          <div className="col-md-3">
            <img src={pythonImage} alt="Python" className="img-fluid mb-3" />
            <p>Python</p>
          </div>
          <div className="col-md-3">
            <img src={csharpImage} alt="C#" className="img-fluid mb-3" />
            <p>C#</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
