import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    // Animation variants for the headline
    const headlineVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08, // Animates each word one by one
            },
        },
    };

    // Animation for each word
    const wordVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const headline = "Fund the Future of Development.";

    return (
        // Main container for the hero section  
        <div  className="flex justify-center items-start pt-40 md:pt-38 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="w-full flex max-w-7xl h-[70vh] rounded-3xl border border-white/10 bg-black/5 backdrop-blur-xl shadow-xl shadow-black/100"
            >
                {/* Left Section with Content */}
                <div className="w-full md:w-[70%] h-full flex flex-col justify-center p-8 md:p-16">
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight"
                        variants={headlineVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {headline.split(" ").map((word, index) => (
                            <motion.span
                                key={index}
                                variants={wordVariants}
                                className="inline-block mr-4" // Use margin for spacing between words
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>

                    <motion.p
                        className="mt-6 text-lg text-neutral-400 max-w-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.8 }}
                    >
                        The platform where brilliant creators get the funding they need, and supporters fuel the next wave of innovation.
                    </motion.p>

                    <motion.div
                        className="mt-10 flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 1.0 }}
                    >
                        <a href="#" className="flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:opacity-90 transition-opacity shadow-lg">
                            Explore Creators
                            <ArrowRight size={20} />
                        </a>
                        <a href="#" className="flex items-center justify-center text-base font-medium text-neutral-300 border border-neutral-700 hover:border-blue-500 hover:bg-blue-500/10 transition-colors px-8 py-4 rounded-full">
                            How It Works
                        </a>
                    </motion.div>
                </div>

                {/* Right Section (Remains empty as requested) */}
                <div className=" md:block w-[50%] h-full ">
                    <spline-viewer
                        url="https://prod.spline.design/GVbL4oNbDlH15nR2/scene.splinecode"
                        class="w-full h-full"
                    ></spline-viewer>
                </div>
            </motion.div>

        </div>
    );
};

export default Hero;
