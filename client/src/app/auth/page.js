'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';

import AuthLayout from '../../components/AuthLayout';
import AuthInputWithIcon from '../../components/AuthInputWithIcon';
import SuccessAnimation from '../../components/SuccessAnimation';
import AuthFormContainer from '../../components/AuthFormContainer';

export default function AuthPage() {
  const [formType, setFormType] = useState('register');
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isSuccess) {
    return (
      <AuthLayout>
        <AuthFormContainer formType={formType}>
          <SuccessAnimation />
        </AuthFormContainer>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthFormContainer formType={formType}>
        {formType === 'register' ? (
          <RegisterForm setFormType={setFormType} setIsSuccess={setIsSuccess} />
        ) : (
          <LoginForm setFormType={setFormType} />
        )}
      </AuthFormContainer>
    </AuthLayout>
  );
}

function RegisterForm({ setFormType, setIsSuccess }) {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id] || errors.form) {
      setErrors(prev => ({ ...prev, [id]: null, form: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Starting registration process...');
      
      const requestData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      console.log('Sending registration request to server...');
      
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        console.log('Registration successful');
        setIsSuccess(true);
        setTimeout(() => {
          setFormType('login');
          setIsSuccess(false);
        }, 2000);
        return;
      }

      // Handle error responses
      const errorData = await response.json();
      console.log('Registration error:', errorData);
      
      if (errorData.field) {
        setErrors({ [errorData.field]: errorData.message });
      } else {
        setErrors({ form: errorData.message || "Registration failed" });
      }

    } catch (error) {
      console.error('Registration network error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrors({ form: "Cannot connect to server. Make sure the server is running on http://localhost:5001" });
      } else {
        setErrors({ form: "Network error: " + error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Create an Account</h2>
        <p className="text-gray-400">Sign up to get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInputWithIcon 
          icon={<FiMail />} 
          type="email"
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          error={errors.email} 
          id="email"
        />
        <AuthInputWithIcon 
          icon={<FiLock />} 
          type="password"
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          error={errors.password} 
          id="password"
        />
        <AuthInputWithIcon 
          icon={<FiLock />} 
          type="password"
          placeholder="Confirm Password" 
          value={formData.confirmPassword} 
          onChange={handleChange} 
          error={errors.confirmPassword} 
          id="confirmPassword"
        />
        
        {errors.form && (
          <div className="text-red-400 text-sm text-center">
            {errors.form}
          </div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </motion.button>
        
        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={() => setFormType('login')} 
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign In
          </button>
        </p>
      </form>
    </motion.div>
  );
}

function LoginForm({ setFormType }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Starting login process for:', formData.email);
      
      const requestData = {
        email: formData.email,
        password: formData.password
      };
      
      console.log('Sending login request to server...');
      
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Login error:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      console.log('Login successful:', data);
      
      // Store authentication data
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Token stored in localStorage');
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('User data stored in localStorage');
      } else {
        // Fallback user data
        const fallbackUser = {
          email: formData.email,
          firstName: formData.email.split('@')[0],
          lastName: ''
        };
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        console.log('Fallback user data stored');
      }
      
      console.log('Redirecting to quiz page...');
      router.push('/quiz');
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Cannot connect to server. Make sure the server is running on http://localhost:5001');
      } else {
        setError(error.message || 'Login failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
        <p className="text-gray-400">Please enter your details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInputWithIcon 
          icon={<FiMail />} 
          type="email"
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          id="email"
        />
        <AuthInputWithIcon 
          icon={<FiLock />} 
          type="password"
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          id="password"
        />
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <div className="text-red-400 text-sm">{error}</div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </motion.button>
        
        <p className="text-center text-gray-400">
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={() => setFormType('register')} 
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign Up
          </button>
        </p>
      </form>
    </motion.div>
  );
}
