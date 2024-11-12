// frontend/src/pages/Services.jsx

import React from "react";
import "../styles/Services.css";

import javaImage from "../pictures/java.jpg"; 
import pythonImage from "../pictures/python.jpg";
import csharpImage from "../pictures/csharp.jpg";

function Services() {
  return (
    <div className="container py-5"> 
      <h1 className="text-center mb-5">Most Popular Programming Languages</h1>

      {/* Java Section */}
      <div className="row mb-5">
        <div className="col-md-4">
          <img src={javaImage} alt="Java" className="img-fluid rounded" />
        </div>
        <div className="col-md-8">
          <h2>Java - Beginner</h2>
          <p>
            Java is a robust, object-oriented programming language known for its
            platform independence and wide range of uses. Writing once, running
            anywhere is the core philosophy of Java, meaning code written in the
            language can run on many different platforms thanks to the Java
            Virtual Machine (JVM). It's ideal for desktop and web applications,
            enterprise software, video games, and Android mobile apps. Java is
            characterized by its strong syntax, which emphasizes code
            readability and helps prevent common programming errors.
          </p>
        </div>
      </div>

      {/* Python Section */}
      <div className="row mb-5">
        <div className="col-md-4">
          <img src={pythonImage} alt="Python" className="img-fluid rounded" />
        </div>
        <div className="col-md-8">
          <h2>Python - Beginner</h2>
          <p>
            Python is an interpreted, high-level programming language with a
            focus on code readability and simplicity. It is widely used in fields
            such as machine learning, artificial intelligence, and web
            development. Its simple syntax has helped make Python a widely used
            language for both small scripts to large web services or algorithms
            in machine learning and analytics.
          </p>
        </div>
      </div>

      {/* C# Section */}
      <div className="row mb-5">
        <div className="col-md-4">
          <img src={csharpImage} alt="C#" className="img-fluid rounded" />
        </div>
        <div className="col-md-8">
          <h2>C# - Beginner</h2>
          <p>
            C# is a modern, object-oriented programming language developed by
            Microsoft, and it has become one of the most widely used languages
            for developing applications within the .NET framework. It is known
            for its efficiency and versatility, making it an excellent tool for
            developers who write a range of applications, from desktop to
            mobile and web solutions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Services;
