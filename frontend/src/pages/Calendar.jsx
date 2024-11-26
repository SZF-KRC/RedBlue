// frontend/src/pages/Calendar.jsx

/*
Calendar page for managing lesson reservations with responsive design:
1. Displays available study hours and remaining hours dynamically after accounting for pending reservations.
2. Loads reservations with status-based color coding: green (approved), orange (pending), red (rejected).
3. Allows users to:
   - Reserve lessons for future dates only.
   - Delete pending reservations.
   - Order additional study hours if depleted.
4. Automatically adjusts the calendar view for smaller screens (day view) and larger screens (week view).
5. Provides a manual for user guidance and functionality to clear rejected reservations.

This component enables seamless scheduling of lessons with a responsive and user-friendly calendar interface.
*/

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/Calendar.css";
import api from "../api";

function Calendar() {
  const [events, setEvents] = useState([]);
  const [studyHours, setStudyHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);
  const [showRemainingHours, setShowRemainingHours] = useState(false);
  const [orderHours, setOrderHours] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [manualVisible, setManualVisible] = useState(false);
  const [hasRejectedEvents, setHasRejectedEvents] = useState(false);
  const [initialView, setInitialView] = useState(window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek");

  useEffect(() => {
    fetchStudyHours();
    loadEvents();

    const handleResize = () => {
      setInitialView(window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek");
    };

    window.addEventListener("resize", handleResize); // Update view on resize
    return () => window.removeEventListener("resize", handleResize); // Cleanup listener
  }, []);


  useEffect(() => {
    const pendingReservationsCount = events.filter(
      (event) => event.status === "pending"
    ).length;
  
    setRemainingHours(Math.max(studyHours - pendingReservationsCount, 0));
    setShowRemainingHours(pendingReservationsCount > 0);
  }, [events, studyHours]);

  useEffect(() => {
    const hasRejected = events.some((event) => event.color === "red");
    setHasRejectedEvents(hasRejected);
  }, [events]);
  
  

  // Fetch total study hours from the API and initialize state
  const fetchStudyHours = async () => {
    try {
      const { data } = await api.get("/api/user/study_hours/");
      const availableHours = data.study_hours;
      setStudyHours(availableHours); // Set the total available study hours
      setRemainingHours(availableHours); // Initially, set remaining hours equal to available hours
    } catch (error) {
      console.error("Failed to load study hours:", error);
    }
  };

  // Fetch all reservations (events) and update the calendar
  const loadEvents = async () => {
    try {
      const { data } = await api.get("/api/reservations/");
      const parsedEvents = data.map((res) => ({
        id: res.id,
        title:
          res.status === "pending"
            ? "Pending"
            : res.status === "approved"
            ? "Approved"
            : "Rejected",
        start: res.start_time,
        end: res.end_time,
        color:
          res.status === "pending"
            ? "orange"
            : res.status === "approved"
            ? "green"
            : "red",
        status: res.status,
      }));
      setEvents(parsedEvents); // Update the state with the parsed events
  
      // Count pending reservations and dynamically calculate remaining study hours
      const pendingReservationsCount = parsedEvents.filter(
        (event) => event.status === "pending"
      ).length;
      setRemainingHours(Math.max(studyHours - pendingReservationsCount, 0)); // Dynamic update of Remaining Study Hours
      setShowRemainingHours(pendingReservationsCount > 0); // Toggle visibility of "Remaining Study Hours" if there are pending reservations
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  // Handle user interaction with a calendar date to create a new reservation
  const handleDateClick = async (arg) => {
    if (remainingHours <= 0) { // Prevent booking if no remaining study hours are available
      alert("You have no remaining study hours. Please purchase more.");
      return;
    }
  
    const endDate = new Date(arg.date);
    endDate.setHours(endDate.getHours() + 1);
  
    try {
      await api.post("/api/reservation/create/", {
        start_time: arg.date.toISOString(),
        end_time: endDate.toISOString(),
      });
  
      // Reload study hours and events to ensure state is updated
      await fetchStudyHours();
      await loadEvents();
    } catch (error) {
      console.error("Failed to create reservation:", error);
    }
  };
  
  // Handle deletion of a reservation
  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/api/reservation/${eventId}/`); // Send a DELETE request to remove the reservation
      setRemainingHours((prev) => prev + 1);

      // Reload study hours and events to update the state
      await fetchStudyHours();
      await loadEvents();
    } catch (error) {
      console.error("Failed to delete reservation:", error);
    }
  };

  // Handle submission of a new order for additional study hours
  const handleOrderSubmit = async () => {
    try {
      if (orderHours <= 0) {
        alert("Please enter a valid number of hours.");
        return;
      }
      await api.post("/api/order/update/", { hours: orderHours });
      alert("Your order has been placed and is pending approval. You will be notified via email once your order is approved.");
      setOrderHours(0);
      setShowOrderForm(false);
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  // Render content for each event displayed on the calendar
  const renderEventContent = (eventInfo) => (
    <div>
      <b>{eventInfo.timeText}</b> <i>{eventInfo.event.title}</i>
      {eventInfo.event.extendedProps.status === "pending" && (
        <button
          onClick={() => handleDelete(eventInfo.event.id)}
          className="btn btn-danger btn-sm ml-2"
        >
          Delete
        </button>
      )}
    </div>
  );

  // Hide all rejected reservations
  const clearRejectedEvents = async () => {
    try {
      await api.post("/api/reservations/hide_rejected/"); // Send a POST request to mark all rejected events as hidden
      setEvents((prev) => prev.filter((event) => event.color !== "red")); // Filter out rejected events from the state
      setHasRejectedEvents(false);
    } catch (error) {
      console.error("Failed to hide rejected reservations:", error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Your Calendar</h1>
      <p className="text-center mb-4">Manage your events and lessons here.</p>

      <div className="text-center mb-4">
        <h5>Available Study Hours: {studyHours}</h5>
        {showRemainingHours && <h5>Remaining Study Hours: {remainingHours}</h5>}
      </div>

      <div className="text-center mb-4">
        <button className="btn btn-info" onClick={() => setManualVisible(true)}>
          Show Manual
        </button>
        <button className="btn btn-primary ml-2" onClick={() => setShowOrderForm(true)}>
          Order More Hours
        </button>
      </div>

      {manualVisible && (
        <div className="manual-overlay">
          <div className="manual-content">
            <h2>Manual</h2>
            <p>Welcome! Here's how to use your calendar:</p>
            <ul>
              <li><strong>View Events:</strong> All your reserved lessons appear on the calendar. Green for approved, orange for pending, and red for rejected.</li>
              <li><strong>Book a Lesson:</strong> Click on a date to reserve an hour. Ensure you have enough study hours available.</li>
              <li><strong>Delete a Reservation:</strong> Click "Delete" on any pending reservation to remove it from your schedule.</li>
              <li><strong>Order More Hours:</strong> If your study hours are depleted, you can place an order for more hours using the "Order Hours" button.</li>
            </ul>
            <p>Enjoy managing your study time!</p>
            <button className="btn btn-primary mt-3" onClick={() => setManualVisible(false)}>
              Close Manual
            </button>
          </div>
        </div>
      )}

      {showOrderForm && (
        <div className="manual-overlay">
          <div className="manual-content">
            <h2>Order More Study Hours</h2>
            <p>Enter the number of hours you want to order:</p>
            <label>
              Hours:
              <input
                type="number"
                value={orderHours}
                onChange={(e) => setOrderHours(Number(e.target.value))}
                className="form-control"
                style={{ width: "100px", display: "inline-block", margin: "10px 0" }}
              />
            </label>
            <div className="mt-3">
              <button
                className="btn btn-success"
                onClick={handleOrderSubmit}
                disabled={orderHours <= 0}
              >
                Submit Order
              </button>
              <button
                className="btn btn-secondary ml-2"
                onClick={() => setShowOrderForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {hasRejectedEvents && (
        <div className="text-center mb-4">
          <button className="btn btn-danger" onClick={clearRejectedEvents}>
            Clear Rejected Requests
          </button>
        </div>
      )}

      <div className="card p-4 shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        events={events}
        dateClick={handleDateClick}
        eventContent={renderEventContent}
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        validRange={{
          start: new Date().toISOString().split("T")[0], // Restrict past dates
        }}
        allDaySlot={false} // Remove the all-day slot
        aspectRatio={window.innerWidth < 768 ? 1 : 1.5} // Adjust aspect ratio for smaller screens
        height="auto" // Allow dynamic height adjustment
        contentHeight="auto" // Ensure it adjusts dynamically
      />

      </div>
    </div>
  );
}

export default Calendar;

