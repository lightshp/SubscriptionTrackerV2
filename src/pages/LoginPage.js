// src/pages/LoginPage.js
import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const LoginPage = () => {
  const { t } = useTranslation(); // Initialize hook

  return (
    <div>
      <h2>{t('login_title')}</h2> {/* Translate title */}
      <LoginForm />
    </div>
  );
};

export default LoginPage;
