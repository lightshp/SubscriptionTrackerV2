// src/components/auth/RegisterForm.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed
import { useTranslation } from 'react-i18next'; // Import useTranslation

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  // Note: Yup validation messages are not typically translated via i18next in this manner.
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
});

const RegisterForm = () => {
  const { t } = useTranslation(); // Initialize hook
  const auth = useAuth(); // Get auth context

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={RegisterSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          await auth.register(values.email, values.password);
          console.log('Registration successful from form');
          alert(t('registration_successful_alert', 'Registration successful! Please login.')); // Example for alert
        } catch (error) {
          console.error('Registration error in form:', error);
          setErrors({ submit: error.message || t('registration_failed_error', 'Registration failed') }); // Example for error
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <div>
            <label htmlFor="email">{t('email_label')}</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
          </div>

          <div>
            <label htmlFor="password">{t('password_label')}</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
          </div>

          {errors.submit && <div style={{ color: 'red', marginTop: '10px' }}>{errors.submit}</div>}

          <button type="submit" disabled={isSubmitting}>
            {t('register_button')}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
