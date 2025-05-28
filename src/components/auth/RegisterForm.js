// src/components/auth/RegisterForm.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
});

const RegisterForm = () => {
  const auth = useAuth(); // Get auth context

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={RegisterSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          await auth.register(values.email, values.password);
          console.log('Registration successful from form');
          // Optionally redirect or show a success message
          // e.g., history.push('/login');
          alert('Registration successful! Please login.'); // Placeholder
        } catch (error) {
          console.error('Registration error in form:', error);
          setErrors({ submit: error.message || 'Registration failed' }); // Show a general error
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors, touched }) => (
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
            Register
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
