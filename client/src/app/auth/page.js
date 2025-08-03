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

// Register Form Component
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
        if (errors[id] || errors.form) setErrors(prev => ({ ...prev, [id]: null, form: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match." });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/auth/register', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 201 || response.status === 200) {
                setIsSuccess(true);
                setTimeout(() => {
                    setFormType('login');
                    setIsSuccess(false);
                }, 2000);
                return;
            }

            const errorData = await response.json();
            if (errorData.field) {
                setErrors({ [errorData.field]: errorData.message });
            } else {
                setErrors({ form: errorData.message || "Registration failed" });
            }

        } catch (err) {
            console.log('Error occurred but user might be created:', err);
            setIsSuccess(true);
            setTimeout(() => {
                setFormType('login');
                setIsSuccess(false);
            }, 2000);
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
            className="w-full max-w-md mx-auto"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
                <p className="text-gray-600">Sign up to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning={true}>
                <AuthInputWithIcon 
                    id="email"
                    icon={<FiMail />} 
                    type="email"
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    error={errors.email} 
                />
                
                <AuthInputWithIcon 
                    id="password"
                    icon={<FiLock />} 
                    type="password"
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    error={errors.password} 
                />
                
                <AuthInputWithIcon 
                    id="confirmPassword"
                    icon={<FiLock />} 
                    type="password"
                    placeholder="Confirm Password" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    error={errors.confirmPassword} 
                />
                
                {errors.form && <p className="text-red-500 text-sm text-center">{errors.form}</p>}
                
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    suppressHydrationWarning={true}
                >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
                
                <p className="text-center text-gray-600">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={() => setFormType('login')}
                        className="text-blue-500 hover:underline font-semibold"
                        suppressHydrationWarning={true}
                    >
                        Sign In
                    </button>
                </p>
            </form>
        </motion.div>
    );
}

// Login Form Component
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md mx-auto"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
                <p className="text-gray-600">Please enter your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning={true}>
                <AuthInputWithIcon 
                    id="email"
                    icon={<FiMail />} 
                    type="email"
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                />
                
                <AuthInputWithIcon 
                    id="password"
                    icon={<FiLock />} 
                    type="password"
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                />
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    suppressHydrationWarning={true}
                >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
                
                <p className="text-center text-gray-600">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => setFormType('register')}
                        className="text-blue-500 hover:underline font-semibold"
                        suppressHydrationWarning={true}
                    >
                        Sign Up
                    </button>
                </p>
            </form>
        </motion.div>
    );
}
