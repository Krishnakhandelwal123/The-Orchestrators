import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Zap, Home as HomeIcon, Compass, Bell, Settings as SettingsIcon, PlusCircle,
  MoreHorizontal, LogOut, Edit, DollarSign, Users, Eye, Crown, TrendingUp,
  Calendar, BarChart3, Target, Award, User, Shield, Palette, Bell as BellIcon,
  ArrowRight, Heart
} from 'lucide-react';
import { useAuthStore } from '../Store/AuthStore';

const NavItem = ({ icon, children, isActive = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-200 ${isActive ? 'bg-purple-500/20 text-purple-300' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
   >
    {icon}
    <span className="font-semibold">{children}</span>
  </button>
);

const SupporterModePopup = ({ onSwitchToSupporter }) => (
  <motion.div
    className="absolute bottom-full left-0 mb-3 w-64 bg-neutral-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50"
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.95 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Heart size={20} className="text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Supporter Mode</h3>
          <p className="text-xs text-neutral-400">Switch to supporter dashboard</p>
        </div>
      </div>
      <button
        onClick={onSwitchToSupporter}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
      >
        <Heart size={16} />
        Switch to Supporter
        <ArrowRight size={16} />
      </button>
    </div>
  </motion.div>
);

const ProfileMenu = ({ logout, onClose }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const menuItems = [
    {
      icon: <User size={16} />,
      label: 'View Profile',
      action: () => {
        // Navigate to profile page
        console.log('View Profile clicked');
        onClose();
      },
      color: 'text-blue-400 hover:bg-blue-500/10'
    },
    {
      icon: <Edit size={16} />,
      label: 'Edit Profile',
      action: () => {
        // Navigate to edit profile page
        navigate('/c/settings');
        onClose();
      },
      color: 'text-green-400 hover:bg-green-500/10'
    },
    {
      icon: <Target size={16} />,
      label: 'My Projects',
      action: () => {
        // Navigate to projects page
        navigate('/c/projects');
        onClose();
      },
      color: 'text-emerald-400 hover:bg-emerald-500/10'
    },
    {
      icon: <BarChart3 size={16} />,
      label: 'Analytics',
      action: () => {
        // Navigate to analytics page
        navigate('/c/analytics');
        onClose();
      },
      color: 'text-cyan-400 hover:bg-cyan-500/10'
    },
    {
      icon: <Users size={16} />,
      label: 'Supporters',
      action: () => {
        // Navigate to supporters page
        navigate('/c/supporters');
        onClose();
      },
      color: 'text-pink-400 hover:bg-pink-500/10'
    },
    {
      icon: <Palette size={16} />,
      label: 'Creator Settings',
      action: () => {
        // Navigate to creator settings
        navigate('/c/settings');
        onClose();
      },
      color: 'text-purple-400 hover:bg-purple-500/10'
    },
    {
      icon: <BellIcon size={16} />,
      label: 'Notification Settings',
      action: () => {
        // Navigate to notification settings
        navigate('/c/notifications');
        onClose();
      },
      color: 'text-orange-400 hover:bg-orange-500/10'
    },
    {
      icon: <Shield size={16} />,
      label: 'Privacy & Security',
      action: () => {
        // Navigate to privacy settings
        navigate('/c/settings');
        onClose();
      },
      color: 'text-red-400 hover:bg-red-500/10'
    }
  ];

  return (
    <motion.div
      className="absolute bottom-full left-0 mb-3 w-72 bg-neutral-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img 
            src={authUser?.creatorProfile?.avatar || authUser?.profileImage || "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} 
            alt="User Avatar" 
            className="w-10 h-10 rounded-full border-2 border-purple-500/30" 
          />
          <div className="flex-1">
            <p className="font-semibold text-white">{authUser?.creatorProfile?.displayName || authUser?.name}</p>
            <div className="flex items-center gap-1">
              <Crown size={12} className="text-purple-400" />
              <p className="text-xs text-purple-400">Creator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors ${item.color}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        
        <div className="h-px bg-white/10 my-2"></div>
        
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </motion.div>
  );
};

const CreatorDashboardHome = () => {
  const { authUser } = useAuthStore();

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {authUser?.creatorProfile?.displayName || authUser?.name}! 👋
            </h1>
            <p className="text-neutral-400">
              Ready to inspire and create amazing content?
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <Crown size={16} className="text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">Creator</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">2,847</p>
              </div>
              <Eye className="h-8 w-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Supporters</p>
                <p className="text-2xl font-bold text-white">156</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Earnings</p>
                <p className="text-2xl font-bold text-white">$1,234</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Projects</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <Target className="h-8 w-8 text-orange-400" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-neutral-800/50 border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
                <PlusCircle size={20} className="text-blue-400" />
                <span className="text-white font-medium">Create New Project</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">
                <Edit size={20} className="text-green-400" />
                <span className="text-white font-medium">Update Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors">
                <BarChart3 size={20} className="text-purple-400" />
                <span className="text-white font-medium">View Analytics</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-neutral-800/50 border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">New supporter joined</p>
                  <p className="text-neutral-400 text-xs">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Project "AI Chatbot" updated</p>
                  <p className="text-neutral-400 text-xs">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Earnings milestone reached</p>
                  <p className="text-neutral-400 text-xs">3 days ago</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Creator Profile Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20 rounded-xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <Award className="h-6 w-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Your Creator Profile</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-neutral-400 text-sm mb-1">Category</p>
              <p className="text-white font-medium">{authUser?.creatorProfile?.category || 'Not set'}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm mb-1">Bio</p>
              <p className="text-white text-sm line-clamp-2">
                {authUser?.creatorProfile?.bio || 'No bio added yet'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const CreatorHome = () => {
  const { authUser, logout } = useAuthStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSupporterPopupOpen, setIsSupporterPopupOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', icon: <HomeIcon size={22} />, path: '/c/home' },
    { name: 'Projects', icon: <Target size={22} />, path: '/c/projects' },
    { name: 'Analytics', icon: <BarChart3 size={22} />, path: '/c/analytics' },
    { name: 'Supporters', icon: <Users size={22} />, path: '/c/supporters' },
    { name: 'Settings', icon: <SettingsIcon size={22} />, path: '/c/settings' },
  ];

  // Sync active navigation with URL
  useEffect(() => {
    const path = location.pathname;
    const currentNav = navItems.find(item => item.path === path);
    if (currentNav) {
      setActiveNav(currentNav.name);
    }
  }, [location.pathname]);

  const handleNavClick = (navItem) => {
    setActiveNav(navItem.name);
    navigate(navItem.path);
  };

  const handleSwitchToSupporter = () => {
    navigate('/s/home');
    setIsSupporterPopupOpen(false);
  };

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
      if (isSupporterPopupOpen && !event.target.closest('.supporter-popup-container')) {
        setIsSupporterPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen, isSupporterPopupOpen]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Render content based on active navigation
  const renderContent = () => {
    switch (activeNav) {
      case 'Home':
        return <CreatorDashboardHome />;
      case 'Projects':
        return <div className="flex items-center justify-center h-full"><p className="text-neutral-400">Projects - Coming soon</p></div>;
      case 'Analytics':
        return <div className="flex items-center justify-center h-full"><p className="text-neutral-400">Analytics - Coming soon</p></div>;
      case 'Supporters':
        return <div className="flex items-center justify-center h-full"><p className="text-neutral-400">Supporters - Coming soon</p></div>;
      case 'Settings':
        return <div className="flex items-center justify-center h-full"><p className="text-neutral-400">Settings - Coming soon</p></div>;
      default:
        return <CreatorDashboardHome />;
    }
  };

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950'>
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '4rem 4rem'
      }}></div>

      <motion.div
        className='relative z-10 text-white gap-8 flex min-h-screen p-8'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Sidebar Panel */}
        <motion.div
          className='w-[22%] rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl flex flex-col'
          variants={itemVariants}
        >
          <div className="flex-grow p-6">
            <div className="flex items-center gap-3 mb-12 px-2">
              <Zap className="text-purple-500 h-9 w-9" />
              <span className="text-3xl font-bold tracking-wider text-white">DevFund</span>
            </div>
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <NavItem
                  key={item.name}
                  icon={item.icon}
                  isActive={activeNav === item.name}
                  onClick={() => handleNavClick(item)}
                >
                  {item.name}
                </NavItem>
              ))}
            </nav>
          </div>
          <div className="p-6">
            <div className="h-px bg-white/10 my-6"></div>
            
            {/* Profile Section */}
            <div className="relative profile-menu-container">
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <ProfileMenu 
                    logout={logout} 
                    onClose={() => setIsProfileMenuOpen(false)}
                  />
                )}
              </AnimatePresence>
              
              {/* Supporter Mode Popup */}
              <div className="relative supporter-popup-container">
                <AnimatePresence>
                  {isSupporterPopupOpen && (
                    <SupporterModePopup onSwitchToSupporter={handleSwitchToSupporter} />
                  )}
                </AnimatePresence>
                
                <div 
                  className='flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-colors'
                  onClick={() => setIsSupporterPopupOpen(!isSupporterPopupOpen)}
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={authUser?.creatorProfile?.avatar || authUser?.profileImage || "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} 
                      alt="User Avatar" 
                      className="w-12 h-12 rounded-full border-2 border-purple-500/30" 
                    />
                    <div>
                      <p className="font-semibold">{authUser?.creatorProfile?.displayName || authUser?.name}</p>
                      <div className="flex items-center gap-1">
                        <Crown size={12} className="text-purple-400" />
                        <p className="text-xs text-purple-400">Creator</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                    }}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Panel */}
        <motion.div
          className='w-[78%] rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl p-8 overflow-y-auto'
          variants={itemVariants}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CreatorHome; 