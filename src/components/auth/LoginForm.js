// src/components/auth/LoginForm.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed
// import { useHistory } from 'react-router-dom'; // if you want to redirect

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginForm = () => {
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
          alert('Login successful!'); // Placeholder
        } catch (error) {
          console.error('Login error in form:', error);
          setErrors({ submit: error.message || 'Login failed' }); // Show a general error
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors }) => ( // Added errors to destructuring
        <Form>
          {/* Example for displaying form-level error:
            {errors.submit && <div style={{ color: 'red' }}>{errors.submit}</div>}
          */}
          <div>
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
          </div>

          {errors.submit && <div style={{ color: 'red', marginTop: '10px' }}>{errors.submit}</div>}

          <button type="submit" disabled={isSubmitting}>
            Login
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
