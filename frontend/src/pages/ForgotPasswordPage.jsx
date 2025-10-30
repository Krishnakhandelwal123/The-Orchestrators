import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, MailCheck, LoaderCircle } from 'lucide-react';
import FloatingShape from '../components/FloatingShape';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../Store/AuthStore';

// --- Main Forgot Password Component ---
const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const { forgotPassword } = useAuthStore()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        setIsLoading(true);
        const result = await forgotPassword(email);
        if (result.success) {
            setSubmitted(true);
        }
        
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
                {submitted ? (
                    // --- Confirmation View ---
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-400 mb-4">
                            <MailCheck className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Check your inbox</h2>
                        <p className="mt-3 text-neutral-400">
                            If an account exists for <strong className="text-neutral-300">{email}</strong>, you will receive an email with instructions to reset your password.
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
                                <KeyRound className="h-8 w-8" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-white">
                                Forgot Password?
                            </h2>
                            <p className="mt-3 text-neutral-400">
                                No worries, we'll send you reset instructions.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                />
                            </div>

                            <div className="h-4">
                                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full cursor-pointer flex items-center justify-center rounded-lg border border-blue-600 bg-transparent px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <LoaderCircle className="h-6 w-6 animate-spin" />
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            <Link
                                to="/login"
                                className="font-medium text-neutral-400 hover:text-blue-400 transition-colors"
                            >
                                ← Back to Login
                            </Link>
                        </div>

                    </>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;