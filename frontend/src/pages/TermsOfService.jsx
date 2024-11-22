// frontend/src/pages/TermsOfService.jsx

import React from "react";
import "../styles/TermsOfService.css";

function TermsOfService() {
  return (
    <div className="main-service-container">
      <h1 className="text-center mb-4">Terms of Service</h1>
      <p className="text-center text-muted mb-5">Last updated: [22.11.2024]</p>

      <h2 className="mt-4">RedBlue Solutions s. r. o.</h2>
      <p>
        Company ID: xxxxxxx • Tax ID: xxxxxxxxxx • Registered Office: RedBlue Academy s. r. o., Slovakia
      </p>
      <p>email: info@redblueacademy.com</p>

      <h2 className="mt-4">Procedure After Submitting the Application</h2>
      <p>
        Upon receiving the application, the service provider will contact the applicant to agree on the course conditions (individual or group course, course date, course price). Subsequently, a binding registration form for the selected course will be sent to the applicant.
      </p>
      <p>
        A place in the course is reserved only after the course fee has been credited to the account of RedBlue Solutions s. r. o. no later than the date specified in the invitation, but in any case before the pre-determined deadline prior to the start of the course. Otherwise, the reserved spot will be made available to other interested parties. In the event of late payment, the applicant loses any previously granted discounts on the base course price.
      </p>
      <p>
        Other payment terms and methods can only be arranged with the sales department based on an agreed contract.
      </p>
      <p>
        If the transfer payment has not been credited to the company’s account by the start date of the course, RedBlue Solutions s. r. o. reserves the right to request proof of bank transfer. An invoice - tax document - will be issued to the applicant upon payment of the course fee.
      </p>
      <p>
        The course fee for public or private IT courses includes the lessons, study materials (unless otherwise stated in the course description), and the issuance of a certificate upon course completion.
      </p>

      <h2 className="mt-4">Conditions for Online Courses</h2>
      <p>
        For online courses, participants are required to provide the necessary equipment, including a computer or laptop, as well as a stable internet connection to participate without technical issues.
      </p>

      <h2 className="mt-4">Course Time Limits</h2>
      <p>
        All course hours must be completed within 180 days of the course start date. Any unused hours after this period will be forfeited without compensation. An exception is made for the "I Want to Be a Professional" course, where different conditions regarding forfeiture may be individually negotiated in writing.
      </p>

      <h2 className="mt-4">Conditions for Course Cancellation</h2>
      <p>
        Any cancellation (withdrawal) from a booked course or changes to the course date must be communicated in writing.
      </p>
      <p>
        The applicant has the right to cancel the booked services in writing, specifying: the applicant's name, contact details, course date and time, and reason for cancellation. The cancellation notice must be sent as soon as possible, either by email or postal mail. The decisive date for determining the number of days in calculating cancellation fees is the date of receipt of the written course cancellation.
      </p>
      <h3>Cancellation Fee in Case of Course Cancellation:</h3>
      <ul>
        <li>7 or more business days before the course start date – no fee</li>
        <li>6 to 3 business days before the course start date – 50% of the course fee</li>
        <li>1 to 2 business days before the course – 100% of the course fee</li>
        <li>
          No-show without cancellation notice – 100% of the course fee (no refund for non-attendance; however, the applicant has the right to send a substitute participant. Financial arrangements between the original and substitute participant are the responsibility of the original participant).
        </li>
      </ul>
      <p>
        The 100% cancellation fee for non-attendance may be assessed individually. In exceptional cases, special cancellation terms can be arranged.
      </p>

      <h2 className="mt-4">Course Rescheduling/Cancellation</h2>
      <p>
        RedBlue Solutions s. r. o. reserves the right to reschedule a course due to insufficient enrollment (this does not apply to individual courses) or in case of events beyond the company’s control (force majeure, power outage, instructor illness, etc.).
      </p>
      <p>
        In the event of the cancellation of a scheduled individual course, the participant may be offered a public course in a shortened format, where the pace and content of the lessons are adapted for multiple participants. If the participant is not interested in the public course and the alternative individual course date does not suit them, the full course fee will be refunded.
      </p>

      <h2 className="mt-4">Final Provisions</h2>
      <p>
        By confirming their registration (ordering a place in the course), the customer acknowledges and fully accepts these terms and conditions. The customer also agrees to the payment terms and will settle the fee for the ordered participation in the course in full by bank transfer to the account of RedBlue Solutions s. r. o.
      </p>
      <p>
        These terms and conditions are valid as stated on the website www.redblueacademy.com on the day the order is placed by the applicant, who accepts them without reservation by confirming their course registration.
      </p>
      <p>
        The operator reserves the right to make changes or additions to the terms and conditions. If the terms and conditions change between the time of ordering and the provision of the service, the provider will inform the customer. The customer has the right to accept the new terms or withdraw from the contract.
      </p>
      <p>
        These terms and conditions are effective as of November 1, 2024.
      </p>
      <p>
        All other conditions regarding payment or non-payment are governed by the current amendment to the Commercial Code.
      </p>
    </div>
  );
}

export default TermsOfService;

