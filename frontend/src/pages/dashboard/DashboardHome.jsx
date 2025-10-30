import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Award, GraduationCap } from 'lucide-react';
import OnboardingForm from './OnboardingForm';

const DashboardHome = () => {
  // This state will control whether we show the welcome screen or the onboarding form.
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const handleOnboardingComplete = (data) => {
    setAnalysisData(data);
    // Here you would typically navigate to the main dashboard view
    // For now, we'll just log the data.
    console.log("Onboarding complete, data received:", data);
  };

  // If showOnboarding is true, render the form.
  if (showOnboarding) {
    return (
      <div className="h-full flex flex-col items-center justify-start text-center p-4">
        <div className="max-w-3xl w-full">
          <h2 className="text-3xl font-bold text-white mb-4">Upload Documents</h2>
          <p className="text-neutral-400 mb-6">Provide your resume, transcript, and certificates to begin AI analysis.</p>
          <OnboardingForm onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
          Unlock Your Career Potential
        </h1>
        <p className="text-lg text-neutral-400 mb-10">
          Your journey starts here. Provide your academic and professional documents, and let our AI build your personalized career roadmap.
        </p>
        <motion.button
          onClick={() => setShowOnboarding(true)}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full overflow-hidden shadow-2xl shadow-black/40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
          <span className="relative flex items-center gap-2">
            Begin Analysis
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={22} />
          </span>
        </motion.button>
      </motion.div>
    </div>
  )
}

export default DashboardHome