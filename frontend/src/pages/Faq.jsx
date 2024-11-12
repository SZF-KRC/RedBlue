// frontend/src/pages/Faq.jsx

import React from "react";
import "../styles/Faq.css"; 

function Faq() {
  return (
    <div className="container py-5"> 
      <h1 className="text-center mb-4">Frequently Asked Questions</h1>
      <p className="text-center mb-5">
        Get answers to the most common questions about our services and professional packages.
      </p>

      <div className="faq-item mb-4">
        <h3>Will I receive a certificate upon completing the course?</h3>
        <p>
          Yes, every participant who successfully completes the entire course will receive a certificate. 
          This certificate will include details on the total number of hours completed, an overview of the knowledge and skills acquired, 
          and an evaluation of the final project.
        </p>
      </div>

      <div className="faq-item mb-4">
        <h3>Is there a time limit for completing the course?</h3>
        <p>
          Yes, if you purchase a course, you must complete it within 180 days from the purchase date; otherwise, 
          the course will expire. Exceptions for the "I Want to Be a Professional" course are negotiated separately.
        </p>
      </div>

      <div className="faq-item mb-4">
        <h3>What if I can't attend a scheduled lesson?</h3>
        <p>
          If you miss a scheduled lesson due to illness, that lesson will not be counted. 
          However, you must provide proof of illness within 72 hours of the missed lesson. 
          Otherwise, the missed lessons will be deducted from your prepaid lessons.
        </p>
      </div>

      <div className="faq-item mb-4">
        <h3>How is payment for the course handled?</h3>
        <p>
          After we agree in writing on the start of the course, the full course fees must be paid in advance via bank transfer as stated in the contract, 
          no later than two business days before the course begins.
        </p>
      </div>

      <div className="faq-item mb-4">
        <h3>Can I study only two hours a day?</h3>
        <p>
          The frequency of learning is entirely up to your agreement. The instructor will send you available time slots, 
          and together you can schedule the lessons at a time that suits you best. Lessons can be arranged from 6:00 AM to 10:00 PM, Monday to Sunday.
        </p>
      </div>

      <div className="faq-item mb-4">
        <h3>If I choose the "I Want to Be a Professional" course, can I opt for fewer than 160 hours?</h3>
        <p>
          The "I Want to Be a Professional" course requires a minimum of 160 hours. 
          If you select between 30 and 159 hours, you will be charged the rates for the "Dedicated Student" course.
        </p>
      </div>

      <div className="faq-item mb-4">
        <h3>How long does it take to learn programming?</h3>
        <p>
          This depends on the individual, but if you don't have a photographic memory, 
          you should expect to need at least 160 hours of study to grasp the basics of programming and be able to independently develop simple programs.
        </p>
      </div>

      <div className="faq-item mb-4">
        <h3>I paid for a course but need to cancel it. Is that possible?</h3>
        <p>
          Yes, if you cancel the course at least 7 days before the scheduled start date, you will receive a full refund. 
          If you cancel between 6 to 3 working days before the course starts, there is a cancellation fee of 50% of the course fees. 
          If you cancel 1 to 2 working days before the course, the cancellation fee is 100% of the course fees. 
          After the course starts, the cancellation fee is also 100% of the course fees.
        </p>
      </div>
    </div>
  );
}

export default Faq;

