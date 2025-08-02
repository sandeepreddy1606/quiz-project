'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';

import AuthLayout from '../../components/AuthLayout';
import AuthInputWithIcon from '../../components/AuthInputWithIcon';
import SuccessAnimation from '../../components/SuccessAnimation';
import AuthFormContainer from '../../components/AuthFormContainer';

// (GoogleIcon component remains the same)
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.49,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


export default function AuthPage() {
  const [formType, setFormType] = useState('register');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      router.push('/quiz');
    }
  }, [router]);

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <SuccessAnimation message="Registration Successful!" />
      </div>
    );
  }

  return (
    <AuthLayout imageFirst={formType === 'login'}>
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

// --- Register Form Component ---
function RegisterForm({ setFormType, setIsSuccess }) {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', gender: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id] || errors.form) setErrors(prev => ({ ...prev, [id]: null, form: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      
      setIsSuccess(true);
      setTimeout(() => {
        setFormType('login');
        setIsSuccess(false);
      }, 2000);

    } catch (err) {
      if (err.field) {
        setErrors({ [err.field]: err.message });
      } else {
        setErrors({ form: err.message || "An unknown error occurred." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleLogin = () => { window.location.href = 'http://localhost:5001/api/auth/google'; };

  return (
    <div>
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create an Account</h1>
        <p className="text-gray-500">Sign up to get started.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input fields here... */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AuthInputWithIcon id="firstName" icon={<FiUser />} placeholder="First Name" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
            <AuthInputWithIcon id="lastName" icon={<FiUser />} placeholder="Last Name" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
        </div>
        <AuthInputWithIcon id="email" type="email" icon={<FiMail />} placeholder="Email" value={formData.email} onChange={handleChange} error={errors.email} />
        <AuthInputWithIcon id="phoneNumber" type="tel" icon={<FiPhone />} placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} error={errors.phoneNumber} />
        <div>
            <select id="gender" value={formData.gender} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-700">
                <option value="" disabled>Select Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
            </select>
        </div>
        <AuthInputWithIcon id="password" type="password" icon={<FiLock />} placeholder="Password" value={formData.password} onChange={handleChange} error={errors.password} />
        <AuthInputWithIcon id="confirmPassword" type="password" icon={<FiLock />} placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        
        {errors.form && <p className="text-red-500 text-sm text-center font-semibold">{errors.form}</p>}
        
        <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 font-bold text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 transition-all shadow-lg disabled:opacity-60">
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </motion.button>
      </form>
      <div className="my-6 flex items-center"><div className="flex-grow border-t border-gray-200"></div><span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span><div className="flex-grow border-t border-gray-200"></div></div>
      <motion.button onClick={handleGoogleLogin} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 flex items-center justify-center gap-3 font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
        <GoogleIcon />Continue with Google
      </motion.button>
      <p className="text-sm text-center text-gray-500 mt-6">
        Already have an account?{' '}
        <button onClick={() => setFormType('login')} className="font-semibold text-yellow-600 hover:underline">Sign In</button>
      </p>
    </div>
  );
}

// --- Login Form Component ---
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
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      
      localStorage.setItem('token', data.token);
      router.push('/quiz');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => { window.location.href = 'http://localhost:5001/api/auth/google'; };

  return (
    <div>
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
        <p className="text-gray-500">Please enter your details.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInputWithIcon id="email" type="email" icon={<FiMail />} placeholder="Email" value={formData.email} onChange={handleChange} />
        <AuthInputWithIcon id="password" type="password" icon={<FiLock />} placeholder="Password" value={formData.password} onChange={handleChange} />
        
        {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}

        <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 font-bold text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 transition-all shadow-lg disabled:opacity-60">
            {isSubmitting ? 'Signing In...' : 'Sign In'}
        </motion.button>
      </form>
      <div className="my-6 flex items-center"><div className="flex-grow border-t border-gray-200"></div><span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span><div className="flex-grow border-t border-gray-200"></div></div>
      <motion.button onClick={handleGoogleLogin} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 flex items-center justify-center gap-3 font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
        <GoogleIcon />Continue with Google
      </motion.button>
      <p className="text-sm text-center text-gray-500 mt-6">
        Don't have an account?{' '}
        <button onClick={() => setFormType('register')} className="font-semibold text-yellow-600 hover:underline">Sign Up</button>
      </p>
    </div>
  );
}