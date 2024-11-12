// frontend/src/pages/TermsOfService.jsx

import React from "react";
import "../styles/TermsOfService.css";

function TermsOfService() {
  return (
    <div className="container py-5"> 
      <h1 className="text-center mb-4">Terms of Service</h1>
      <p className="text-center text-muted mb-5">Last updated: [01.11.2024]</p>
      <h2 className="mt-4">Introduction</h2>
      <p>
        Welcome to RedBlue Academy. By accessing or using our services, you
        agree to the following terms and conditions.
      </p>
      <h2 className="mt-4">Use of Services</h2>
      <p>
        You agree to use our services for lawful purposes only. You are
        responsible for your conduct and any content you create or share while
        using our services.
      </p>
      <h2 className="mt-4">Payments</h2>
      <p>
        All payments for courses or other services must be completed before
        gaining access. No refunds are available unless otherwise specified in
        our refund policy.
      </p>
      <h2 className="mt-4">Termination</h2>
      <p>
        We reserve the right to terminate your access to our services if you
        violate any of these terms.
      </p>

      <h2 className="mt-4">Changes to Terms</h2>
      <p>
        We may update these Terms of Service from time to time. Please review
        this page periodically for any changes.
      </p>

      <p>
        If you have any questions or concerns about these terms, please contact
        us at [info@redblueacademy.com].
      </p>
    </div>
  );
}

export default TermsOfService;

