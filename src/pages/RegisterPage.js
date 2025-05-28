// src/pages/RegisterPage.js
import React from 'react';
import RegisterForm from '../components/auth/RegisterForm'; // Assuming RegisterForm will be in src/components/auth/

const RegisterPage = () => {
  return (
    <div>
      <h2>Create Account</h2>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
