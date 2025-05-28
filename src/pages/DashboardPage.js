// src/pages/DashboardPage.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Adjust path if needed

const DashboardPage = () => {
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await auth.logout();
      // Navigation to /login will happen automatically due to ProtectedRoute logic
      // or the RootRedirect logic if we navigate to '/' after logout.
      console.log('Logout successful from dashboard');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (auth.loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {auth.currentUser?.email}!</p>
      <button onClick={handleLogout}>Logout</button>
      {/* Dashboard content will go here */}
    </div>
  );
};

export default DashboardPage;
