// frontend/src/pages/PrivacyPolicy.jsx

import "../styles/PrivacyPolicy.css";
import React from "react";

function PrivacyPolicy() {
  return (
    <div className="container py-5"> 
      <h1 className="text-center mb-4">Privacy Policy</h1>
      <p className="text-center text-muted">Last updated: [01.11.2024]</p>
      <p>
        This Privacy Policy describes how RedBlue Academy collects, uses, and
        discloses your personal information when you visit our website.
      </p>

      <h2 className="mt-4">Information We Collect</h2>
      <p>
        We collect personal information that you provide directly to us,
        including but not limited to your name, email address, and payment
        information.
      </p>

      <h2 className="mt-4">How We Use Your Information</h2>
      <p>
        Your information is used to provide and improve our services, process
        transactions, and communicate with you regarding updates and
        promotions.
      </p>

      <h2 className="mt-4">Your Rights</h2>
      <p>
        You have the right to access, update, or delete the personal information
        we hold about you. To exercise these rights, please contact us at
        [Insert Contact Information].
      </p>

      <h2 className="mt-4">Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Please review this
        page periodically for any changes.
      </p>

      <p>If you have any questions, feel free to contact us at [info@redblueacademy.com].</p>
    </div>
  );
}

export default PrivacyPolicy;

