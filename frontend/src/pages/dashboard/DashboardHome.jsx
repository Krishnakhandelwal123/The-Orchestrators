import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../Store/AuthStore';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  Clock, 
  DollarSign, 
  Calendar,
  Star,
  ArrowUpRight,
  Eye,
  MessageCircle,
  Share2,
  Settings
} from 'lucide-react';

const DashboardHome = () => {
  const { authUser } = useAuthStore();
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'funding',
      creator: 'Tech Innovators',
      amount: 50,
      date: '2 hours ago',
      project: 'AI-Powered Learning Platform'
    },
    {
      id: 2,
      type: 'comment',
      creator: 'Creative Studios',
      content: 'Amazing progress on the project!',
      date: '1 day ago',
      project: 'Digital Art Collection'
    },
    {
      id: 3,
      type: 'funding',
      creator: 'Startup Vision',
      amount: 25,
      date: '3 days ago',
      project: 'Eco-Friendly Packaging'
    },
    {
      id: 4,
      type: 'update',
      creator: 'Game Developers',
      content: 'New milestone reached!',
      date: '1 week ago',
      project: 'Indie Game Adventure'
    }
  ]);

  const [stats, setStats] = useState({
    totalFunded: 1250,
    projectsSupported: 8,
    creatorsBacked: 6,
    monthlyContribution: 150
  });

  const [topCreators, setTopCreators] = useState([
    { name: 'Tech Innovators', category: 'Technology', funded: 300, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { name: 'Creative Studios', category: 'Art & Design', funded: 250, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
    { name: 'Startup Vision', category: 'Business', funded: 200, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }
  ]);

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

  const getActivityIcon = (type) => {
    switch (type) {
      case 'funding':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'update':
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

      return (
      <motion.div
        className="h-full p-6 overflow-y-auto scrollbar-hide"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {authUser?.name}! 👋
            </h1>
            <p className="text-neutral-400">
              Here's what's happening with your supported creators
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-2xl p-6 border border-neutral-700">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={authUser?.profilePic || `https://ui-avatars.com/api/?name=${authUser?.name}&background=6366f1&color=fff&size=80`}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-neutral-600"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-neutral-900"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">{authUser?.name}</h2>
              <p className="text-neutral-400">Supporter since {new Date().getFullYear()}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-neutral-400">Member</span>
                <span className="text-sm text-green-400">● Active</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">${stats.totalFunded}</div>
              <div className="text-sm text-neutral-400">Total Funded</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Total Funded</p>
              <p className="text-2xl font-bold text-white">${stats.totalFunded}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-500">+12% this month</span>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Projects Supported</p>
              <p className="text-2xl font-bold text-white">{stats.projectsSupported}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Heart className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <ArrowUpRight className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm text-blue-500">+2 this month</span>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Creators Backed</p>
              <p className="text-2xl font-bold text-white">{stats.creatorsBacked}</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <ArrowUpRight className="w-4 h-4 text-purple-500 mr-1" />
            <span className="text-sm text-purple-500">+1 this month</span>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Monthly Contribution</p>
              <p className="text-2xl font-bold text-white">${stats.monthlyContribution}</p>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm text-yellow-500">+8% vs last month</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              <button className="text-sm text-neutral-400 hover:text-white transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium">{activity.creator}</p>
                      <span className="text-xs text-neutral-400">{activity.date}</span>
                    </div>
                    <p className="text-neutral-300 text-sm mt-1">
                      {activity.type === 'funding' && `Funded $${activity.amount} to`}
                      {activity.type === 'comment' && activity.content}
                      {activity.type === 'update' && activity.content}
                    </p>
                    {activity.project && (
                      <p className="text-neutral-400 text-sm mt-1">{activity.project}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Creators & Quick Actions */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Top Creators */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <h3 className="text-xl font-semibold text-white mb-4">Top Creators</h3>
            <div className="space-y-4">
              {topCreators.map((creator, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{creator.name}</p>
                    <p className="text-neutral-400 text-xs">{creator.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">${creator.funded}</p>
                    <p className="text-neutral-400 text-xs">Funded</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors text-left">
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="text-white">Explore New Projects</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors text-left">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <span className="text-white">View Messages</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-neutral-700/50 rounded-lg hover:bg-neutral-700 transition-colors text-left">
                <Share2 className="w-5 h-5 text-purple-500" />
                <span className="text-white">Share Projects</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardHome; 