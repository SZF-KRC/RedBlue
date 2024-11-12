// frontend/src/components/ProtectedRoute.jsx

/*
ProtectedRoute component to control access based on user authentication and order status:
1. Redirects unauthenticated users to the login page.
2. Redirects users with pending orders to the order pending page.
3. Redirects users without completed orders to the order page, unless order is pending.
4. Redirects users with completed orders away from the order page to the calendar.

Ensures only authorized users can access certain pages, based on their order status.
*/

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, orderCompleted, orderPending } = useAuth();
  const location = useLocation();

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the order is in "pending" status, redirect to the pending order page
  if (orderPending && location.pathname !== "/order-pending") {
    return <Navigate to="/order-pending" replace />;
  }

  // If the user has not completed the order and the page is not "/order", redirect to the order page
  if (!orderCompleted && !orderPending && location.pathname !== "/order") {
    return <Navigate to="/order" replace />;
  }

  // If the user is authenticated, the order is completed, but they are on the order page, redirect to the calendar
  if (orderCompleted && location.pathname === "/order") {
    return <Navigate to="/calendar" replace />;
  }

  return children;
}

export default ProtectedRoute;

