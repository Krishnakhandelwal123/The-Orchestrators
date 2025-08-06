import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';


const Footer = () => {

    return (
        <footer
            
            className="flex  flex-col items-center justify-between w-full min-h-screen p-8 text-white bg-zinc-900">
            {/* Top Section with Bold Headings */}
            <div className="flex justify-between w-full">
                {/* Left - Bold Headings */}
                <div className="text-left">
                    <h1 className="text-white text-[6rem] font-bold leading-none">INNOVATE</h1>
                    <h1 className="text-gray-400 text-[6rem] font-bold leading-none">WITH AI</h1>
                </div>

                {/* Right - Bold Headings */}
                <div className="text-right">
                    <h1 className="text-white text-[6rem] font-bold leading-none">BOOST</h1>
                    <h1 className="text-gray-400 text-[6rem] font-bold leading-none">ANALYTICS</h1>
                </div>
            </div>

            {/* Contact Us Section */}
            <div className="flex flex-col items-center w-full mt-16">
                <h2 className="mb-6 text-4xl font-semibold text-gray-100">Contact Us</h2>
                <form className="w-full max-w-lg">
                    <div className="flex flex-wrap mb-6 -mx-3">
                        <div className="w-full px-3">
                            <label className="block mb-2 text-xs font-bold tracking-wide text-gray-400 uppercase" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="block w-full px-4 py-3 leading-tight text-gray-200 bg-gray-800 border border-gray-700 rounded appearance-none focus:outline-none focus:bg-gray-700 focus:border-gray-500"
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-6 -mx-3">
                        <div className="w-full px-3">
                            <label className="block mb-2 text-xs font-bold tracking-wide text-gray-400 uppercase" htmlFor="message">
                                Message
                            </label>
                            <textarea
                                className="block w-full px-4 py-3 leading-tight text-gray-200 bg-gray-800 border border-gray-700 rounded appearance-none focus:outline-none focus:bg-gray-700 focus:border-gray-500"
                                id="message"
                                rows="4"
                                placeholder="Type your message"
                            ></textarea>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="px-8 py-3 font-bold text-white transition-colors bg-gray-800 rounded-full hover:bg-gray-700"
                            type="submit"
                        >
                            Send Message
                        </button>
                    </div>
                </form>
            </div>

            {/* Social Media Icons and Join Button */}
            <div className="flex items-center mt-8 space-x-6">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                    <FaFacebookF size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                    <FaTwitter size={24} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                    <FaLinkedinIn size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                    <FaInstagram size={24} />
                </a>

                {/* Join Our Community Now Button */}
                <a href="/community">
                    <button className="px-6 py-2 text-lg font-semibold text-white transition-colors bg-indigo-600 rounded-full hover:bg-indigo-500">
                        Join Our Community Now
                    </button>
                </a>
            </div>

            {/* Footer Bottom Links */}
            <div className="flex justify-between w-full mt-auto text-sm text-gray-500">
                <span>&copy; 2025 YourDevFund. All rights reserved.</span>
                <span className="cursor-pointer hover:text-gray-300">Privacy Policy | Terms of Service</span>
            </div>
        </footer>
    );
};

export default Footer;
