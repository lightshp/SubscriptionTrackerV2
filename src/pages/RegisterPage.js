// src/pages/RegisterPage.js
import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('create_account_title')}</h2> {/* Translate title */}
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
