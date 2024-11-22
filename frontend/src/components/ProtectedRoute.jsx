// frontend/src/components/ProtectedRoute.jsx

/*
ProtectedRoute component to manage user access based on authentication and order status:
1. Redirects unauthenticated users to the login page.
2. Redirects users with their first pending order (and no completed orders) to the "Order Pending" page.
3. Redirects users with no completed orders and no pending orders to the "Order" page.
4. Redirects users with completed orders away from the "Order" page to the calendar.
5. Allows users with completed orders or valid pending orders to access protected routes.

This component ensures users are routed to appropriate pages based on their order and authentication status.
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

  // If the order is pending and the user has no completed orders, redirect to order-pending
  if (orderPending && !orderCompleted && location.pathname !== "/order-pending") {
    return <Navigate to="/order-pending" replace />;
  }

  // If the user has no completed orders and no pending orders, redirect to the order page
  if (!orderCompleted && !orderPending && location.pathname !== "/order") {
    return <Navigate to="/order" replace />;
  }

  // If the user has completed an order and is on the order page, redirect to the calendar
  if (orderCompleted && location.pathname === "/order") {
    return <Navigate to="/calendar" replace />;
  }

  // If all conditions are satisfied, render the children components
  return children;
}

export default ProtectedRoute;


