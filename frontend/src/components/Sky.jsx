import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// We'll add some global CSS for the complex background animation.
// This is a clean way to handle animations that don't need to re-render.
const GlobalStyles = () => (
    <style jsx global>{`
    @keyframes breathe {
      0%, 100% {
        transform: scale(1) rotate(0deg);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.3) rotate(15deg);
        opacity: 1;
      }
    }

    /* This pseudo-element creates the slow, breathing aurora effect */
    .aurora-background::before {
      content: '';
      position: absolute;
      inset: -50%; /* Make it much larger than the screen to avoid hard edges */
      background: linear-gradient(45deg, #B2D7FF, #8cbef2, #4A90E2, #B2D7FF);
      animation: breathe 25s ease-in-out infinite;
      filter: blur(120px); /* Heavy blur is key to the soft look */
      z-index: 1;
    }
  `}</style>
);


const Sky = () => {
    // State to hold the current mouse position
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Effect to listen for mouse movement and update the state
    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);


    return (
        <>
            <GlobalStyles />
            {/* The main container. */}
            <div
                className='relative  min-h-screen bg-[#d6d6d6] overflow-hidden aurora-background'>

                {/* The interactive spotlight overlay. */}
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background: `radial-gradient(circle 500px at ${mousePosition.x}px ${mousePosition.y}px, rgba(178, 215, 255, 0.5), transparent 80%)`,
                    }}
                />



                {/* Your page content goes here, on top of all the effects */}
                <div className="relative pt-32 z-30 flex items-center justify-center h-screen">
                    <h1
                        className="text-6xl md:text-9xl tracking-tight text-neutral-800 text-center select-none leading-tight"
                    >
                        <span className="block">
                            Turning skills into
                        </span>
                        <span className="block text-right">
                            careers
                        </span>

                    </h1>
                </div>

                <div className='flex skie relative mx-auto gap-28 min-h-[80vh] z-30 w-[75vw]'>

                    <div
                        data-scroll
                        data-scroll-speed="0.2"
                        data-scroll-direction="vertical"
                        className='w-[44%] ml-20 mr-20 transform -translate-y-55'>
                        <img className='rounded-3xl' src="https://c14.patreon.com/Mobile_Insights_931320bfbd.png" alt="" />
                    </div>

                    <div className='w-[33%] '>
                        <h1 className='text-2xl font-semibold'>
                            More paths to success
                        </h1>
                        <p className='mt-5'>
                            SkillSync empowers talented students and developers with career-boosting support through mentorship, community, and growth-funding opportunities.
                        </p>

                        <button className='text-white mt-5 bg-black rounded-3xl p-3 pr-5 pl-5 cursor-pointer'>
                            Create Account
                        </button>
                    </div>
                    <div className='w-[33%] '>
                        <h1 className='text-2xl font-semibold'>
                            Unlock growth
                        </h1>
                        <p className='mt-12'>
                            SkillSync isn’t just about learning — it’s about career acceleration. Gain powerful insights, connect with supporters, and grow through a strong community that believes in your skills.
                        </p>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Sky;
