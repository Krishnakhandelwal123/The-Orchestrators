import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
import {motion} from 'framer-motion'
import { useAuthStore } from "../Store/AuthStore";
import { Loader2 } from 'lucide-react';
import { Link } from "react-router-dom";
import { auth, provider } from "../lib/firebase.js";
import { signInWithPopup } from "firebase/auth";
import FloatingShape from '../components/FloatingShape.jsx';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        login(formData);
    };
    const { login, isLoggingIn, googleLogin } = useAuthStore();

    const handleGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            await googleLogin({ token: idToken });
        } catch (error) {
            console.error("Google Sign-in error:", error);
            toast.error("Google sign-in failed. Please try again.");
        }
    };

    return (
        <div className='flex relative overflow-hidden  min-h-screen bg-gradient-to-b from-neutral-900 via-zinc-800 to-neutral-950'>
            {/* Left Section */}
            <FloatingShape size='w-64 h-64' top='-5%' left='10%' delay={0} />
            <FloatingShape size='w-48 h-48' top='70%' left='80%' delay={5} />
            <FloatingShape size='w-32 h-32' top='40%' left='-10%' delay={2} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="left w-[57%]  text-white flex items-center justify-center">
                <div className="w-full max-w-sm rounded-xl border border-[#424242] bg-[#212121] p-8 text-center text-white">

                    <h2 className="text-2xl font-bold">Login to DevFund</h2>
                    <p className="mt-2 text-gray-400">Enter your credentials to access your account.</p>

                    {/* Google Sign-in */}
                    <button
                        onClick={handleGoogle}
                        disabled={isLoggingIn}
                        className="cursor-pointer mt-10 flex w-full items-center justify-center gap-3 rounded-lg border border-[#424242] py-3 font-semibold transition-colors hover:bg-[#2d2d2d]">
                        <FcGoogle size={22} />
                        <span>{isLoggingIn ? "Logging in..." : "Signin with Google"}</span>
                    </button>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <hr className="w-full border-t border-[#424242]" />
                        <span className="text-gray-400">or</span>
                        <hr className="w-full border-t border-[#424242]" />
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your Email"
                                className="w-full rounded-lg border border-[#424242] bg-[#212121] p-3  placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />

                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full rounded-lg border border-[#424242] bg-[#212121] p-3 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                required
                            />
                            <span
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
                            </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm">
 
                            <Link to="/forgotpassword" className="font-semibold text-blue-500 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="mt-6 cursor-pointer w-full rounded-lg bg-blue-600 py-3 font-semibold transition-colors hover:bg-blue-700"
                        >
                            {isLoggingIn ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Loading...
                                </span>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    {/* Sign up prompt */}
                    <div className="mt-4 cursor-pointer text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-500 hover:underline font-semibold">
                            Sign up
                        </Link>
                    </div>

                    {/* Footer */}
                    <footer className="mt-8 text-sm text-gray-500">
                        © 2025 DevFund. Crafted with{' '}
                        <FaHeart className="mx-1 inline text-[#e25555]" /> by Krishna
                    </footer>
                </div>
            </motion.div>

            {/* Right Section */}
            <div className="right w-[43%]  text-white flex items-center justify-center">
                <img className='mr-40' src="/login.png" alt="Login illustration" />
            </div>
        </div>
    );
};

export default Login;
