// frontend/src/components/Footer.jsx

import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer bg-light text-center d-flex align-items-center justify-content-center">
      <div>
        <p className="mb-1">&copy; 2024 RedBlue Academy. All Rights Reserved.</p>
        <p className="mb-0">
          <a href="/privacy-policy" className="text-decoration-none">Privacy Policy</a>
          <span className="mx-2">|</span>
          <a href="/terms" className="text-decoration-none">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;


