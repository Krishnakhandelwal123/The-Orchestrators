import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Settings, Zap, Compass, Star, BarChart2, BookOpen, Rss } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    useFloating,
    useHover,
    useInteractions,
    useRole,
    useDismiss,
    FloatingPortal,
    offset,
    flip,
    shift,
    autoUpdate,
} from '@floating-ui/react';

// --- Reusable Hover Popover Component ---
const HoverPopover = ({ children, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Floating UI hook setup
    const { x, y, refs, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: 'bottom-start',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(15),
            flip({ padding: 10 }),
            shift({ padding: 10 }),
        ],
    });

    // Interaction hooks
    const hover = useHover(context, { handleClose: null, restMs: 50 });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'dialog' });

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss, role]);

    // Dynamic gradient style for the popover accent
    const accentStyle = {
        backgroundImage: `radial-gradient(circle at top left, ${content.color} 0%, transparent 60%)`,
    };

    return (
        <>
            {/* The reference element (the nav link) */}
            <div ref={refs.setReference} {...getReferenceProps()}>
                {children}
            </div>

            {/* The floating popover */}
            <FloatingPortal>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={refs.setFloating}
                            className="w-96 bg-neutral-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                            style={{ position: 'absolute', top: y ?? 0, left: x ?? 0 }}
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            {...getFloatingProps()}
                        >
                            {/* Colorful Accent Gradient */}
                            <div className="absolute inset-0 opacity-40" style={accentStyle}></div>

                            <div className="relative p-6">
                                <div className="flex items-start gap-4">
                                    <div className="text-white p-3 bg-white/10 rounded-lg">{content.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{content.title}</h3>
                                        <p className="text-neutral-400 text-sm mt-1">{content.description}</p>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </FloatingPortal>
        </>
    );
};


// --- Main Navbar Component ---
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const { scrollY } = useScroll();
    const lastScrollY = useRef(0);

    // Updated nav links with rich popover content and colors
    const mainNavLinks = [
        {
            name: 'Career Paths',
            href: '#career-paths',
            content: {
                icon: <Compass size={24} />,
                title: "Personalized Career Paths",
                description: "Explore AI-generated career journeys based on your interests and academic profile.",
                color: '#3b82f6'
            }
        },
        {
            name: 'Skill Builder',
            href: '#skills',
            content: {
                icon: <Star size={24} />,
                title: "Skill Pathways",
                description: "Track your next skills — technical & soft — aligned with future job roles.",
                color: '#8b5cf6'
            }
        },
       
        {
            name: 'Industry Insights',
            href: '#insights',
            content: {
                icon: <BarChart2 size={24} />,
                title: "Market Trends",
                description: "Real-time data on job demand, salary growth & emerging technologies.",
                color: '#f97316'
            }
        },
       
    ];


    useMotionValueEvent(scrollY, "change", (currentY) => {
        const delta = currentY - lastScrollY.current;
        if (delta < -10 || currentY <= 50) {
            setVisible(true);
        } else if (delta > 10) {
            setVisible(false);
            setIsMenuOpen(false);
        }
        lastScrollY.current = currentY;
    });

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 right-0 z-50 flex justify-center"
                animate={{ y: visible ? 0 : -120 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <nav className="flex items-center justify-between w-[92%] mt-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-black/20 px-6 py-3">
                    {/* Left links */}
                    <div className="hidden md:flex items-center gap-2 flex-1 justify-start">
                        {mainNavLinks.map(link => (
                            <HoverPopover key={link.name} content={link.content}>
                                <a href={link.href} className="relative group text-base font-medium text-neutral-300 hover:text-white transition-colors px-4 py-2 rounded-full">
                                    {link.name}
                                </a>
                            </HoverPopover>
                        ))}
                    </div>

                    {/* Center logo */}
                    <div className="flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                        <a href="#" className="flex items-center gap-2.5">
                            <Zap className="text-blue-500 h-7 w-7" />
                            <span className="text-2xl font-bold tracking-wider text-white">SkillSync</span>
                        </a>
                    </div>

                    {/* Right links */}
                    <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
                        <Link to="/login" className="text-base font-medium text-neutral-300 border border-neutral-700 hover:border-blue-500 hover:bg-blue-500/10 transition-colors px-5 py-2.5 rounded-full">Login</Link>
                        <a href="#" className="px-6 py-2.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:opacity-90 transition-opacity">Get Started</a>
                    </div>

                    {/* Mobile menu toggle */}
                    <div className="md:hidden flex-1 flex justify-end">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </nav>
            </motion.div>

            {/* Mobile menu would go here */}
        </>
    );
};

export default Navbar;
