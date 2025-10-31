import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, FileText, Award, GraduationCap, Sparkles, TrendingUp, Target, Zap, BarChart3, Users, Rocket, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OnboardingForm from './OnboardingForm';
import { useAuthStore } from '../../Store/AuthStore';

const DashboardHome = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    
    const container = document.querySelector('.dashboard-home-container');
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const handleOnboardingComplete = (data) => {
    setAnalysisData(data);
    console.log("Onboarding complete, data received:", data);
  };

  const quickActions = [
    {
      icon: <FileText size={24} className="text-blue-400" />,
      title: 'Analyse Profile',
      description: 'Upload documents & analyze',
      action: () => navigate('/explore'),
      gradient: 'from-blue-500/20 to-blue-600/10',
      borderColor: 'border-blue-500/30',
      delay: 0.1
    },
    {
      icon: <BarChart3 size={24} className="text-purple-400" />,
      title: 'Industry Demand',
      description: 'Explore job market trends',
      action: () => navigate('/notifications'),
      gradient: 'from-purple-500/20 to-purple-600/10',
      borderColor: 'border-purple-500/30',
      delay: 0.2
    },
    {
      icon: <Users size={24} className="text-indigo-400" />,
      title: 'Career Roles',
      description: 'Get role suggestions',
      action: () => navigate('/explore'),
      gradient: 'from-indigo-500/20 to-indigo-600/10',
      borderColor: 'border-indigo-500/30',
      delay: 0.3
    },
    {
      icon: <Rocket size={24} className="text-pink-400" />,
      title: 'Portfolio Builder',
      description: 'Build your portfolio',
      action: () => navigate('/explore'),
      gradient: 'from-pink-500/20 to-pink-600/10',
      borderColor: 'border-pink-500/30',
      delay: 0.4
    },
  ];

  const stats = [
    { value: '95%', label: 'Accuracy', icon: <Target size={20} /> },
    { value: '24/7', label: 'AI Analysis', icon: <Brain size={20} /> },
    { value: '50+', label: 'Career Paths', icon: <TrendingUp size={20} /> },
  ];

  if (showOnboarding) {
    return (
      <div className="h-full flex flex-col items-center justify-start text-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4"
          >
            Upload Your Documents
          </motion.h2>
          <p className="text-neutral-400 mb-8 text-lg">
            Provide your resume, transcript, and certificates to begin AI-powered analysis.
          </p>
          <OnboardingForm onComplete={handleOnboardingComplete} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="dashboard-home-container h-full relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ x, y }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent blur-3xl" />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col p-8 overflow-y-auto scrollbar-hide">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm mb-6"
          >
            <Sparkles size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Welcome back, {authUser?.name || 'User'}!</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Unlock Your Career
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Potential
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Your journey starts here. Provide your academic and professional documents, and let our AI build your personalized career roadmap.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            onClick={() => setShowOnboarding(true)}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full overflow-hidden shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-64 group-hover:h-64 opacity-10" />
            <span className="relative flex items-center gap-2">
              Begin Analysis
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="p-4 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm text-center group hover:border-blue-500/30 transition-all"
            >
              <div className="flex justify-center mb-2 text-blue-400 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-neutral-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full"
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + action.delay }}
              onClick={action.action}
              className={`group relative p-6 rounded-2xl border ${action.borderColor} bg-gradient-to-br ${action.gradient} backdrop-blur-sm hover:border-opacity-60 transition-all duration-300 text-left overflow-hidden`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Hover effect gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="mb-4 p-3 w-fit rounded-xl bg-black/20 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 transition-all">
                  {action.title}
                </h3>
                <p className="text-sm text-neutral-400">
                  {action.description}
                </p>
                <ArrowRight 
                  size={18} 
                  className="mt-4 text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" 
                />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-12 max-w-4xl mx-auto w-full"
        >
          <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap size={28} className="text-blue-400" />
              Why Choose SkillSync?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Brain size={20} />, text: 'AI-Powered Insights' },
                { icon: <Target size={20} />, text: 'Personalized Roadmaps' },
                { icon: <TrendingUp size={20} />, text: 'Real-time Market Data' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.7 + index * 0.1 }}
                  className="flex items-center gap-3 text-neutral-300"
                >
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    {feature.icon}
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;