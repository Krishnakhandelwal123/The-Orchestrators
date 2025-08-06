import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../Store/AuthStore';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Shield, 
  Mail, 
  Camera,
  Save,
  Eye,
  EyeOff,
  Check,
  X,
  Upload,
  Download,
  Trash2,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Globe,
  Smartphone,
  CreditCard,
  Key,
  AlertTriangle,
  Info
} from 'lucide-react';

const Settings = () => {
  const { authUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Profile Settings
  const [profileData, setProfileData] = useState({
    username: authUser?.username || '',
    name: authUser?.name || '',
    email: authUser?.email || '',
    bio: authUser?.bio || '',
    location: authUser?.location || '',
    website: authUser?.website || ''
  });

  // Theme Settings
  const [themeSettings, setThemeSettings] = useState({
    theme: 'dark',
    accentColor: 'blue',
    fontSize: 'medium',
    animations: true,
    reducedMotion: false
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    fundingUpdates: true,
    projectUpdates: true,
    creatorMessages: true,
    systemUpdates: true,
    marketingEmails: false,
    weeklyDigest: true
  });

  // Security Settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showFundingHistory: true,
    showSupportedProjects: true,
    allowMessages: true,
    dataSharing: false,
    analytics: true
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'theme', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'privacy', name: 'Privacy', icon: Lock }
  ];

  const themeOptions = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'auto', name: 'Auto', icon: Monitor, description: 'Follows system preference' }
  ];

  const accentColors = [
    { id: 'blue', name: 'Blue', color: '#3B82F6' },
    { id: 'purple', name: 'Purple', color: '#8B5CF6' },
    { id: 'green', name: 'Green', color: '#10B981' },
    { id: 'orange', name: 'Orange', color: '#F59E0B' },
    { id: 'red', name: 'Red', color: '#EF4444' },
    { id: 'pink', name: 'Pink', color: '#EC4899' }
  ];

  const fontSizeOptions = [
    { id: 'small', name: 'Small', size: '14px' },
    { id: 'medium', name: 'Medium', size: '16px' },
    { id: 'large', name: 'Large', size: '18px' }
  ];

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update profile logic here
      console.log('Profile updated:', profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password changed successfully');
      setSecurityData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log('Profile picture uploaded:', file);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const renderProfileTab = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Profile Picture Section */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={authUser?.profilePic || `https://ui-avatars.com/api/?name=${authUser?.name}&background=6366f1&color=fff&size=120`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-neutral-600"
            />
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="text-neutral-300 text-sm mb-2">
              Upload a new profile picture. Recommended size: 400x400 pixels.
            </p>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm transition-colors">
                Upload New
              </button>
              <button className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Username</label>
            <input
              type="text"
              value={profileData.username}
              onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter location"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-300 mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-300 mb-2">Website</label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleProfileUpdate}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-lg text-white font-medium transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderThemeTab = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Theme Selection */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((theme) => {
            const Icon = theme.icon;
            return (
              <button
                key={theme.id}
                onClick={() => setThemeSettings(prev => ({ ...prev, theme: theme.id }))}
                className={`p-4 rounded-xl border transition-all ${
                  themeSettings.theme === theme.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-neutral-600 hover:border-neutral-500'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className="w-5 h-5 text-neutral-400" />
                  <span className="font-medium text-white">{theme.name}</span>
                </div>
                <p className="text-sm text-neutral-400 text-left">{theme.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">Accent Color</h3>
        <div className="flex flex-wrap gap-3">
          {accentColors.map((color) => (
            <button
              key={color.id}
              onClick={() => setThemeSettings(prev => ({ ...prev, accentColor: color.id }))}
              className={`w-12 h-12 rounded-full border-2 transition-all ${
                themeSettings.accentColor === color.id
                  ? 'border-white scale-110'
                  : 'border-neutral-600 hover:border-neutral-500'
              }`}
              style={{ backgroundColor: color.color }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">Font Size</h3>
        <div className="flex space-x-4">
          {fontSizeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setThemeSettings(prev => ({ ...prev, fontSize: option.id }))}
              className={`px-4 py-2 rounded-lg transition-colors ${
                themeSettings.fontSize === option.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
              style={{ fontSize: option.size }}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Settings */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">Animations</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Enable Animations</p>
              <p className="text-sm text-neutral-400">Show smooth transitions and effects</p>
            </div>
            <button
              onClick={() => setThemeSettings(prev => ({ ...prev, animations: !prev.animations }))}
              className={`w-12 h-6 rounded-full transition-colors ${
                themeSettings.animations ? 'bg-blue-600' : 'bg-neutral-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                themeSettings.animations ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Reduced Motion</p>
              <p className="text-sm text-neutral-400">Minimize animations for accessibility</p>
            </div>
            <button
              onClick={() => setThemeSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }))}
              className={`w-12 h-6 rounded-full transition-colors ${
                themeSettings.reducedMotion ? 'bg-blue-600' : 'bg-neutral-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                themeSettings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderNotificationsTab = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-sm text-neutral-400">
                  Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </p>
              </div>
              <button
                onClick={() => setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-neutral-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderSecurityTab = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Change Password */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors pr-12"
                placeholder="Enter current password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={securityData.newPassword}
                onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors pr-12"
                placeholder="Enter new password"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={securityData.confirmPassword}
              onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handlePasswordChange}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-lg text-white font-medium transition-colors"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Key className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Enable 2FA</p>
            <p className="text-sm text-neutral-400">Add an extra layer of security to your account</p>
          </div>
          <button
            onClick={() => setSecurityData(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              securityData.twoFactorEnabled ? 'bg-blue-600' : 'bg-neutral-600'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              securityData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderPrivacyTab = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          {Object.entries(privacySettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-sm text-neutral-400">
                  {key === 'profileVisibility' ? 'Control who can see your profile' :
                   key === 'showFundingHistory' ? 'Display your funding history publicly' :
                   key === 'showSupportedProjects' ? 'Show projects you\'ve supported' :
                   key === 'allowMessages' ? 'Allow other users to message you' :
                   key === 'dataSharing' ? 'Share data for research purposes' :
                   'Allow analytics and usage tracking'}
                </p>
              </div>
              {key === 'profileVisibility' ? (
                <select
                  value={value}
                  onChange={(e) => setPrivacySettings(prev => ({ ...prev, [key]: e.target.value }))}
                  className="px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              ) : (
                <button
                  onClick={() => setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-neutral-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="h-full p-6 overflow-y-auto scrollbar-hide"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-neutral-400">
              Manage your account preferences and security
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'theme' && renderThemeTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'privacy' && renderPrivacyTab()}
      </div>
    </motion.div>
  );
};

export default Settings; 