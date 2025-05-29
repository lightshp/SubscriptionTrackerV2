// src/pages/AddSubscriptionPage.js
import React from 'react';
import AddSubscriptionForm from '../components/subscriptions/AddSubscriptionForm'; // Adjust path if needed
import { useTranslation } from 'react-i18next';

const AddSubscriptionPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('add_new_subscription_title')}</h2> {/* Translate title */}
      <AddSubscriptionForm />
    </div>
  );
};

export default AddSubscriptionPage;
