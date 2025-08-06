import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, LoaderCircle } from 'lucide-react';
import FloatingShape from '../components/FloatingShape';
import { useAuthStore } from "../Store/AuthStore";
import { useNavigate } from 'react-router-dom';

// --- Main Email Verification Component ---
const EmailVerification = () => { 
    const {authUser, verifyEmail}=useAuthStore()
    // State for the 6-digit code, initialized as an array of 6 empty strings.
    const [code, setCode] = useState(new Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Refs for the input fields to manage focus.
    const inputRefs = useRef([]);

    // Effect to focus the first input on component mount.
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);
    
    // Auto-submit when all 6 digits are filled
    useEffect(() => {
        if (code.every(digit => digit !== '') && !isLoading) {
            handleSubmit(new Event('submit'));
        }
    }, [code, isLoading]);

    // Handles changes in any of the 6 input fields.
    const handleChange = (e, index) => {
        const { value } = e.target;
        const newCode = [...code];
         
        if(value.length > 1){
            const pastedcode = value.slice(0,6).split("");
            for(let i = 0; i < 6; i++){
                newCode[i] = pastedcode[i] || "";
            }
            setCode(newCode);
             
            const lastfilledindex = newCode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastfilledindex < 5 ? lastfilledindex + 1 : 5;
            inputRefs.current[focusIndex]?.focus();
        } else {
            newCode[index] = value;
            setCode(newCode);
            if(value && index < 5){
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    // Handles the 'Backspace' key to move focus backward.
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    
    // Handles the form submission.
    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");

        if (verificationCode.length !== 6) {
            setError("Please enter the complete 6-digit code.");
            return;
        }

        setIsLoading(true);
        setError("");
        
        try {
            const result = await verifyEmail(verificationCode);
            if (result.success) {
                // Small delay to ensure state is updated
                setTimeout(() => {
                    navigate("/");
                }, 500);
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError("Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
 
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-neutral-950 via-zinc-900 to-neutral-950 text-white overflow-hidden p-4">
            {/* Background floating shapes */}
            <FloatingShape size='w-64 h-64' top='-5%' left='10%' delay={0} />
            <FloatingShape size='w-48 h-48' top='70%' left='80%' delay={5} />
            <FloatingShape size='w-32 h-32' top='40%' left='-10%' delay={2} />

            {/* Verification Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/50 p-8 shadow-2xl backdrop-blur-sm"
            >
                <div className="text-center">
                    {/* UPDATED: Icon theme changed to blue */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 mb-4">
                        <Mail className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Check Your Email
                    </h1>
                    <p className="mt-3 text-neutral-400">
                        We've sent a 6-digit verification code to <br />
                        <span className="font-medium text-neutral-300">{authUser?.email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8">
                    <div className="flex justify-center gap-2 sm:gap-4">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                // UPDATED: Input focus theme changed to blue
                                className="h-14 w-12 sm:h-16 sm:w-14 rounded-lg border border-neutral-700 bg-neutral-800 text-center text-3xl font-semibold text-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                                required
                                disabled={isLoading}
                            />
                        ))}
                    </div>
                    {error && <div className="text-red-500 text-center mt-2">{error}</div>}
                    {/* UPDATED: Button style changed to transparent with blue border/hover */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 w-full flex items-center justify-center rounded-lg border border-blue-600 bg-transparent px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? (
                            <LoaderCircle className="h-6 w-6 animate-spin" />
                        ) : (
                            "Verify Account"
                        )}
                    </button>
                </form>

            </motion.div>
        </div>
    );
};
export default EmailVerification;