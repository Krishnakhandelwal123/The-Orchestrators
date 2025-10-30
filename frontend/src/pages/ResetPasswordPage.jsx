import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, Eye, EyeOff, LoaderCircle, CircleCheck } from 'lucide-react';
import FloatingShape from '../components/FloatingShape';
import { useAuthStore } from '../Store/AuthStore';
import { Link, useParams } from 'react-router-dom';

// --- Main Reset Password Component ---
const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { resetPassword } = useAuthStore()
    const {token}=useParams()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!password || !confirmPassword) {
            setError('Please fill in both password fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        const result = await resetPassword(token, password);
        if (result.success) {
            setSuccess(true);
        }
        
        setIsLoading(false);
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-neutral-950 via-zinc-900 to-neutral-950 text-white overflow-hidden p-4">
            {/* Background floating shapes */}
            <FloatingShape size='w-64 h-64' top='-5%' left='10%' delay={0} />
            <FloatingShape size='w-48 h-48' top='70%' left='80%' delay={5} />
            <FloatingShape size='w-32 h-32' top='40%' left='-10%' delay={2} />

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/50 p-8 shadow-2xl backdrop-blur-sm"
            >
                {success ? (
                    // --- Success View ---
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-400 mb-4">
                            <CircleCheck className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Password Reset!</h2>
                        <p className="mt-3 text-neutral-400">
                            Your password has been successfully updated.
                        </p>
                        <div className="mt-6 text-center text-sm">
                            <Link
                                to="/login"
                                className="font-medium text-neutral-400 hover:text-blue-400 transition-colors"
                            >
                                ← Back to Login
                            </Link>
                        </div>

                    </div>
                ) : (
                    // --- Form View ---
                    <>
                        <div className="text-center mb-8">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 mb-4">
                                <LockKeyhole className="h-8 w-8" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-white">
                                Set New Password
                            </h2>
                            <p className="mt-3 text-neutral-400">
                                Please create a new, secure password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* New Password Input */}
                            <div className="relative">
                                <label htmlFor="password" className="sr-only">New Password</label>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500 hover:text-blue-400"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="relative">
                                <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm New Password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                />
                            </div>

                            <div className="h-5 pt-1">
                                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center rounded-lg border border-blue-600 bg-transparent px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <LoaderCircle className="h-6 w-6 animate-spin" />
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage