// src/components/auth/LoginForm.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed
import { useTranslation } from 'react-i18next'; // Import useTranslation
// import { useHistory } from 'react-router-dom'; // if you want to redirect

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  // Note: Yup validation messages are not typically translated via i18next in this manner.
  // They often require a different setup if multi-language validation messages are needed.
  password: Yup.string().required('Password is required'),
});

const LoginForm = () => {
  const { t } = useTranslation(); // Initialize hook
  const auth = useAuth(); // Get auth context
  // const history = useHistory(); // For redirection

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          await auth.login(values.email, values.password);
          console.log('Login successful from form');
          // Redirect to dashboard or home page
          // history.push('/dashboard');
          alert(t('login_successful_alert', 'Login successful!')); // Example for alert (add key to JSON if needed)
        } catch (error) {
          console.error('Login error in form:', error);
          setErrors({ submit: error.message || t('login_failed_error', 'Login failed') }); // Example for error (add key to JSON)
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors }) => (
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
            {t('login_button')}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
