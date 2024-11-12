// frontend/src/pages/Calendar.jsx

/*
Calendar page for managing lesson reservations:
1. Displays available study hours and remaining hours after pending reservations.
2. Loads existing reservations with color-coded status: green (approved), orange (pending), red (rejected).
3. Allows users to reserve lessons, delete pending reservations, and order additional study hours if depleted.
4. Provides a manual for usage and clears rejected reservations upon request.

This component enables users to manage and view their study schedule within an interactive calendar.
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
  const [hasRejectedEvents, setHasRejectedEvents] = useState(false);
  const [showRemainingHours, setShowRemainingHours] = useState(false);
  const [orderHours, setOrderHours] = useState(0);
  const [showOrderButton, setShowOrderButton] = useState(false);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    fetchStudyHours();
    loadEvents();
  }, []);

  const fetchStudyHours = async () => {
    try {
      const response = await api.get("/api/user/study_hours/");
      const availableHours = response.data.study_hours;
      setStudyHours(availableHours);
      setRemainingHours(availableHours); 
      setShowOrderButton(availableHours === 0);
    } catch (error) {
      console.error("Failed to load study hours:", error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await api.get("/api/reservations/");
      const events = response.data.map((res) => ({
        id: res.id,
        title: res.status === 'pending' ? 'Pending' : res.status === 'approved' ? 'Approved' : 'Rejected',
        start: res.start_time,
        end: res.end_time,
        color: res.status === 'pending' ? 'orange' : res.status === 'approved' ? 'green' : 'red',
        status: res.status,
      }));
      setEvents(events);
      setHasRejectedEvents(events.some(event => event.color === 'red'));

      // Deduction of pending reservations from remainingHours
      const pendingCount = events.filter(event => event.status === 'pending').length;
      setRemainingHours(Math.max(studyHours - pendingCount, 0));
      setShowRemainingHours(pendingCount > 0);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const handleDateClick = async (arg) => {
    // We will check remaining Hours only if there are pending reservations, otherwise we will use study Hours
    const hoursToCheck = showRemainingHours ? remainingHours : studyHours;
  
    if (hoursToCheck <= 0) {
      alert("You need to purchase study hours before reserving a lesson.");
      return;
    }
  
    const endDate = new Date(arg.date);
    endDate.setHours(endDate.getHours() + 1);
  
    try {
      await api.post("/api/reservation/create/", {
        start_time: arg.date.toISOString(),
        end_time: endDate.toISOString(),
      });
      setRemainingHours(prev => prev - 1); 
      loadEvents();
    } catch (error) {
      console.error("Failed to create reservation:", error);
    }
  };
  

  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/api/reservation/${eventId}/`);
      setRemainingHours(prev => prev + 1);
      loadEvents();
    } catch (error) {
      console.error("Failed to delete reservation:", error);
    }
  };

  const handleOrderSubmit = async () => {
    try {
      await api.post("/api/order/update/", { hours: orderHours });
      alert("Your order has been placed and is pending approval.");
      setShowOrderButton(false);
      setOrderHours(0);
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const renderEventContent = (eventInfo) => (
    <div>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
      {eventInfo.event.extendedProps.status === "pending" && (
        <button
          onClick={() => handleDelete(eventInfo.event.id)}
          style={{
            marginLeft: "10px",
            padding: "2px 5px",
            fontSize: "0.8em",
            color: "white",
            backgroundColor: "red",
            border: "none",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      )}
    </div>
  );

  const clearRejectedEvents = async () => {
    try {
      await api.post("/api/reservations/hide_rejected/");
      const filteredEvents = events.filter(event => event.color !== 'red');
      setEvents(filteredEvents);
      setHasRejectedEvents(false);
    } catch (error) {
      console.error("Failed to hide rejected reservations:", error);
    }
  };

  const manualContent = (
    <div>
      <h2>Manual for Using the Calendar</h2>
      <p>Welcome to your Calendar! Here’s how to use it:</p>
      <ul>
        <li><strong>View Events:</strong> All your reserved lessons appear on the calendar. Green for approved, orange for pending, and red for rejected.</li>
        <li><strong>Book a Lesson:</strong> Click on a date to reserve an hour. Ensure you have enough study hours available.</li>
        <li><strong>Delete a Reservation:</strong> Click "Delete" on any pending reservation to remove it from your schedule.</li>
        <li><strong>Order More Hours:</strong> If your study hours are depleted, you can place an order for more hours using the "Order Hours" button.</li>
      </ul>
      <p>Enjoy managing your study time!</p>
      <button onClick={() => setShowManual(false)} className="btn btn-primary mt-3">Close Manual</button>
    </div>
  );

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Your Calendar</h1>
      <p className="text-center mb-5">Manage your events and lessons here.</p>

      <div className="text-center mb-4">
        <h5>Available Study Hours: {studyHours}</h5>
        {showRemainingHours && <h5>Remaining Study Hours: {remainingHours}</h5>}
      </div>

      <div className="text-center mb-4">
        <button className="btn btn-info" onClick={() => setShowManual(true)}>
          Show Manual
        </button>
      </div>

      {showManual && (
        <div className="manual-overlay">
          <div className="manual-content">
            {manualContent}
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

      {showOrderButton && (
        <div className="text-center mb-4">
          <p>You have no remaining study hours.</p>
          <label>
            Enter number of hours to order:
            <input
              type="number"
              value={orderHours}
              onChange={(e) => setOrderHours(e.target.value)}
              className="form-control"
              style={{ width: "100px", display: "inline-block", margin: "0 10px" }}
            />
          </label>
          <button
            className="btn btn-primary"
            onClick={handleOrderSubmit}
            disabled={orderHours <= 0}
          >
            Order Hours
          </button>
        </div>
      )}

      <div className="card p-4 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          events={events}
          dateClick={handleDateClick}
          eventContent={renderEventContent}
          editable={false}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />
      </div>
    </div>
  );
}

export default Calendar;

