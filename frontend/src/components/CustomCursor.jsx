import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const cursorVariants = {
        default: {
            x: mousePosition.x - 16, // Offset by half the size
            y: mousePosition.y - 16,
            height: 32,
            width: 32,
            borderWidth: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0)',
        },
        // We can add more variants here later for hover effects
    };

    return (
        <motion.div
            className="fixed border-2 border-white rounded-full pointer-events-none z-[9999]"
            variants={cursorVariants}
            animate="default"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
    );
};

export default CustomCursor;
