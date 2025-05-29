// src/components/subscriptions/AddSubscriptionForm.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSubscription } from '../../contexts/SubscriptionContext'; // Adjust path as needed
import { useTranslation } from 'react-i18next'; // Import useTranslation
// import { useNavigate } from 'react-router-dom'; // Optional: for redirecting after add

const SubscriptionSchema = Yup.object().shape({
  serviceName: Yup.string().required('Service name is required'),
  // Yup validation messages are not typically translated via i18next in this manner.
  cost: Yup.number().positive('Cost must be a positive number').required('Cost is required'),
  currency: Yup.string().required('Currency is required (e.g., USD, EUR)'),
  billingFrequency: Yup.string().oneOf(['Monthly', 'Yearly'], 'Invalid billing frequency').required('Billing frequency is required'),
});

const AddSubscriptionForm = () => {
  const { t } = useTranslation(); // Initialize hook
  const { addSubscription } = useSubscription();
  // const navigate = useNavigate(); // Optional

  return (
    <Formik
      initialValues={{
        serviceName: '',
        cost: '',
        currency: 'USD', // Default currency
        billingFrequency: 'Monthly', // Default frequency
      }}
      validationSchema={SubscriptionSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const subscriptionData = {
            ...values,
            customFrequencyDays: null,
            category: 'Other',
            startDate: new Date().toISOString().split('T')[0],
            nextPaymentDate: new Date().toISOString().split('T')[0], // Placeholder
            paymentMethod: null,
            notes: null,
            isActive: true,
          };
          await addSubscription(subscriptionData);
          alert(t('subscription_added_alert', 'Subscription added successfully!')); // Example for alert
          resetForm();
          // navigate('/dashboard');
        } catch (error) {
          console.error("Failed to add subscription:", error);
          alert(t('subscription_failed_alert', 'Failed to add subscription.')); // Example for alert
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="serviceName">{t('service_name_label')}</label>
            <Field type="text" name="serviceName" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            <ErrorMessage name="serviceName" component="div" style={{ color: 'red', fontSize: '0.9em' }} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="cost">{t('cost_label')}</label>
            <Field type="number" name="cost" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            <ErrorMessage name="cost" component="div" style={{ color: 'red', fontSize: '0.9em' }} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="currency">{t('currency_label')}</label>
            <Field type="text" name="currency" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            <ErrorMessage name="currency" component="div" style={{ color: 'red', fontSize: '0.9em' }} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="billingFrequency">{t('billing_frequency_label')}</label>
            <Field as="select" name="billingFrequency" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
              <option value="Monthly">{t('frequency_monthly', 'Monthly')}</option> {/* Example for option */}
              <option value="Yearly">{t('frequency_yearly', 'Yearly')}</option>   {/* Example for option */}
            </Field>
            <ErrorMessage name="billingFrequency" component="div" style={{ color: 'red', fontSize: '0.9em' }} />
          </div>

          <button type="submit" disabled={isSubmitting} style={{ padding: '10px 15px', cursor: 'pointer' }}>
            {t('add_subscription_button')}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AddSubscriptionForm;
