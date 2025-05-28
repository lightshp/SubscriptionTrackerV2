// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Verify path
import LoginPage from './pages/LoginPage'; // Verify path
import RegisterPage from './pages/RegisterPage'; // Verify path
import DashboardPage from './pages/DashboardPage'; // Verify path
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
          {/* Example: <Route path="/settings" element={<SettingsPage />} /> */}
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
      <Router>
        {/* The <header> previously here is now removed, as Layout handles it */}
        <main> {/* Keep a main tag or div as a general container if desired, or remove if Layout is sufficient */}
          <AppContent />
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
