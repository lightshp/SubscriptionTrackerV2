// src/pages/LoginPage.js
import React from 'react';
import LoginForm from '../components/auth/LoginForm'; // Assuming LoginForm will be in src/components/auth/

const LoginPage = () => {
  return (
    <div>
      <h2>Login</h2>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
