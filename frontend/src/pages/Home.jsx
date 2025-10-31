import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Zap, Home as HomeIcon, Compass, Bell, Settings as SettingsIcon, PlusCircle,
  MoreHorizontal, LogOut, Edit, DollarSign, Users, Eye, Crown, ArrowRight,
  User, Heart, Shield
} from 'lucide-react';
import { useAuthStore } from '../Store/AuthStore';
import DashboardHome from './dashboard/DashboardHome';
import Explore from './dashboard/Explore';
import Notification from './dashboard/Notification';
import Settings from './dashboard/Settings';


const NavItem = ({ icon, children, isActive = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-200 ${isActive ? 'bg-blue-500/20 text-blue-300' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
   >
    {icon}
    <span className="font-semibold">{children}</span>
  </button>
);

const ProfileMenu = ({ logout, onClose }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const menuItems = [
    {
      icon: <User size={16} />,
      label: 'View Profile',
      action: () => {
        navigate(`/profile/${authUser.username}`); // Assuming a profile route exists
        onClose();
      },
      color: 'text-blue-400 hover:bg-blue-500/10'
    },
    {
      icon: <Edit size={16} />,
      label: 'Account Settings',
      action: () => {
        navigate('/settings');
        onClose();
      },
      color: 'text-green-400 hover:bg-green-500/10'
    },
    {
      icon: <Shield size={16} />,
      label: 'Privacy & Security',
      action: () => {
        // Navigate to privacy settings
        navigate('/settings');
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
            src={authUser?.profilePic || `https://ui-avatars.com/api/?name=${authUser?.name}&background=6366f1&color=fff&size=80`}
            alt="User Avatar" 
            className="w-10 h-10 rounded-full border-2 border-blue-500/30" 
          />
          <div className="flex-1">
            <p className="font-semibold text-white">{authUser?.name}</p>
            <div className="flex items-center gap-1">
              <Heart size={12} className="text-blue-400" />
              <p className="text-xs text-blue-400">Student</p>
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
          onClick={async () => {
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

const CreatorModePopup = ({ onSwitchToCreator }) => (
  <motion.div
    className="absolute bottom-full left-0 mb-3 w-64 bg-neutral-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50"
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.95 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Crown size={20} className="text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Creator Mode</h3>
          <p className="text-xs text-neutral-400">Switch to creator dashboard</p>
        </div>
      </div>
      <button
        onClick={onSwitchToCreator}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
      >
        <Crown size={16} />
        Switch to Creator
        <ArrowRight size={16} />
      </button>
    </div>
  </motion.div>
);

const Home = () => {
  const { authUser, logout } = useAuthStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCreatorPopupOpen, setIsCreatorPopupOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', icon: <HomeIcon size={22} />, path: '/' },
    { name: 'Explore', icon: <Compass size={22} />, path: '/explore' },
    { name: 'Industry Demand', icon: <Bell size={22} />, path: '/notifications' },
    { name: 'Settings', icon: <SettingsIcon size={22} />, path: '/settings' },
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

  const handleBecomeCreator = () => {
    navigate('/becomecreator');
  };

  const handleSwitchToCreator = () => {
    navigate('/c/home');
    setIsCreatorPopupOpen(false);
  };

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
      if (isCreatorPopupOpen && !event.target.closest('.creator-popup-container')) {
        setIsCreatorPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen, isCreatorPopupOpen]);

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
        return <DashboardHome />;
      case 'Explore':
        return <Explore />;
      case 'Industry Demand':
        return <Notification />;
      case 'Settings':
        return <Settings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950'>
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '4rem 4rem'
      }}></div>

      <motion.div
        className='relative z-10 text-white gap-8 flex h-screen p-8'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Sidebar Panel */}
        <motion.div
          className='w-[22%] h-full rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden'
          variants={itemVariants}
        >
          <div className="flex-grow p-6 overflow-hidden">
            <div className="flex items-center gap-3 mb-12 px-2">
              <Zap className="text-blue-500 h-9 w-9" />
              <span className="text-3xl font-bold tracking-wider text-white">SkillSync</span>
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
          <div className="p-6 flex-shrink-0">
          
            <div className="h-px bg-white/10 my-6"></div>
            
            {/* Profile Section */}
            <div className="relative profile-menu-container">
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <ProfileMenu 
                  logout={() => {
                    // We need to navigate to the initial page after logout.
                    // The navigation logic is handled inside the logout function in the store.
                    logout(navigate);
                  }} 
                    onClose={() => setIsProfileMenuOpen(false)}
                  />
                )}
              </AnimatePresence>
               
              {/* Creator Mode Popup */}
              <div className="relative creator-popup-container">
                <AnimatePresence>
                  {isCreatorPopupOpen && (
                    <CreatorModePopup onSwitchToCreator={handleSwitchToCreator} />
                  )}
                </AnimatePresence>
                
                <div 
                  className='flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-colors'
                  onClick={() => {
                    if (authUser?.roles?.isCreator) {
                      setIsCreatorPopupOpen(!isCreatorPopupOpen);
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <img src={authUser?.profilePic || `https://ui-avatars.com/api/?name=${authUser?.name}&background=6366f1&color=fff&size=80`} alt="User Avatar" className="w-12 h-12 rounded-full border-2 border-white/20" />
                    <div>
                      <p className="font-semibold">{authUser.name}</p>
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-neutral-400">Student</p>
                        {authUser?.roles?.isCreator && (
                          <Crown size={10} className="text-purple-400" />
                        )}
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
          className='w-[78%] h-full rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col'
          variants={itemVariants}
        >
          <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNav}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Home;
