// frontend/src/components/Layout.jsx

import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1" style={{ paddingTop: '70px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;

