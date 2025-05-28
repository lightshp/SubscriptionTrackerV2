// src/components/layout/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Assuming Header.js is in the same directory
import Sidebar from './Sidebar'; // Assuming Sidebar.js is in the same directory

const Layout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }}>
          <Outlet /> {/* Child routes will render here */}
        </main>
      </div>
      <footer style={{ padding: '1rem', backgroundColor: '#f0f0f0', textAlign: 'center', marginTop: 'auto' }}>
        <p>&copy; 2024 Subscription Tracker</p>
      </footer>
    </div>
  );
};

export default Layout;
