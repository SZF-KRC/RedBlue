// frontend/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";  
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Services from "./pages/Services";
import PriceList from "./pages/PriceList";
import CustomSolutions from "./pages/CustomSolutions";
import Faq from "./pages/Faq";
import Calendar from "./pages/Calendar";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderPage from "./pages/OrderPage";
import OrderPending from "./components/OrderPending";

function Logout() {
  const { logout } = useAuth();
  logout();
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/terms" element={<Layout><TermsOfService /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/price-list" element={<Layout><PriceList /></Layout>} />
          <Route path="/custom-solutions" element={<Layout><CustomSolutions /></Layout>} />
          <Route path="/faq" element={<Layout><Faq /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
          <Route path="/order" element={<ProtectedRoute><Layout><OrderPage /></Layout></ProtectedRoute>} />
          <Route path="/order-pending" element={<Layout><OrderPending /></Layout>} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Layout>
                  <Calendar />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
