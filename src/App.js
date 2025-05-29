// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Verify path
import { UserProfileProvider } from './contexts/UserProfileContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext'; // Add this import
import LoginPage from './pages/LoginPage'; // Verify path
import RegisterPage from './pages/RegisterPage'; // Verify path
import DashboardPage from './pages/DashboardPage'; // Verify path
import SettingsPage from './pages/SettingsPage'; // Import SettingsPage
import AddSubscriptionPage from './pages/AddSubscriptionPage'; // Import AddSubscriptionPage
import ProtectedRoute from './components/routes/ProtectedRoute'; // Verify path
import Layout from './components/layout/Layout'; // Import Layout

// Helper component for the root path redirect logic
const RootRedirect = () => {
  const auth = useAuth();
  if (auth.loading) return <div>Loading...</div>; // Or a spinner
  return auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

// Simple NotFoundPage component
const NotFoundPage = () => (
  <div>
    <h2>404 - Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
);

function AppContent() {
  // This component will contain the routes and can use context if needed
  // For now, it's simple, but useful if Layout needs to be conditional
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes now use the Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}> {/* Wrap protected routes' content with Layout */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/add-subscription" element={<AddSubscriptionPage />} /> {/* Add this route */}
          {/* Add other protected pages here later */}
        </Route>
      </Route>
      
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <SubscriptionProvider> {/* Add SubscriptionProvider here */}
          <Router>
            <main> {/* Or your top-level layout structure */}
              <AppContent />
            </main>
          </Router>
        </SubscriptionProvider>
      </UserProfileProvider>
    </AuthProvider>
  );
}

export default App;
