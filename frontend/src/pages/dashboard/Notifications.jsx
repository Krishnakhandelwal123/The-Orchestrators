import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  DollarSign, 
  Star, 
  Users, 
  TrendingUp,
  Award,
  Calendar,
  Filter,
  Check,
  Trash2,
  Settings,
  Search,
  MoreVertical,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'funding',
      title: 'Funding Successful',
      message: 'Your $50 contribution to "AI-Powered Learning Platform" has been processed successfully.',
      creator: 'Sarah Chen',
      creatorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      amount: 50,
      project: 'AI-Powered Learning Platform',
      timestamp: '2 hours ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'update',
      title: 'Project Update',
      message: 'New milestone reached! "Digital Art Collection" has achieved 150% of its funding goal.',
      creator: 'Marcus Rodriguez',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      project: 'Digital Art Collection',
      timestamp: '4 hours ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'comment',
      title: 'New Comment',
      message: 'Sarah Chen replied to your comment on "AI-Powered Learning Platform"',
      creator: 'Sarah Chen',
      creatorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      project: 'AI-Powered Learning Platform',
      timestamp: '1 day ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'milestone',
      title: 'Milestone Achieved',
      message: 'Congratulations! You\'ve supported 10 creators and earned the "Supporter" badge.',
      creator: null,
      project: null,
      timestamp: '2 days ago',
      isRead: true,
      priority: 'high'
    },
    {
      id: 5,
      type: 'creator',
      title: 'New Creator Followed',
      message: 'Alex Thompson started following you back!',
      creator: 'Alex Thompson',
      creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      project: null,
      timestamp: '3 days ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: 6,
      type: 'reward',
      title: 'Reward Unlocked',
      message: 'You\'ve unlocked exclusive content from "Indie Game Adventure" for your support!',
      creator: 'Alex Thompson',
      creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      project: 'Indie Game Adventure',
      timestamp: '1 week ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: 7,
      type: 'system',
      title: 'Account Verification',
      message: 'Your email has been successfully verified. Welcome to DevFund!',
      creator: null,
      project: null,
      timestamp: '1 week ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: 8,
      type: 'funding',
      title: 'Funding Reminder',
      message: 'Your monthly contribution to "Eco-Friendly Packaging" is due in 3 days.',
      creator: 'Startup Vision',
      creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      amount: 25,
      project: 'Eco-Friendly Packaging',
      timestamp: '1 week ago',
      isRead: true,
      priority: 'high'
    }
  ]);

  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRead, setShowRead] = useState(true);

  const notificationTypes = [
    { id: 'all', name: 'All', icon: Bell, count: notifications.length },
    { id: 'funding', name: 'Funding', icon: DollarSign, count: notifications.filter(n => n.type === 'funding').length },
    { id: 'update', name: 'Updates', icon: TrendingUp, count: notifications.filter(n => n.type === 'update').length },
    { id: 'comment', name: 'Comments', icon: MessageCircle, count: notifications.filter(n => n.type === 'comment').length },
    { id: 'milestone', name: 'Milestones', icon: Award, count: notifications.filter(n => n.type === 'milestone').length },
    { id: 'creator', name: 'Creators', icon: Users, count: notifications.filter(n => n.type === 'creator').length },
    { id: 'reward', name: 'Rewards', icon: Star, count: notifications.filter(n => n.type === 'reward').length },
    { id: 'system', name: 'System', icon: Settings, count: notifications.filter(n => n.type === 'system').length }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'funding':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'update':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      case 'milestone':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'creator':
        return <Users className="w-5 h-5 text-indigo-500" />;
      case 'reward':
        return <Star className="w-5 h-5 text-orange-500" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-neutral-600';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (notification.creator && notification.creator.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesReadStatus = showRead || !notification.isRead;
    
    return matchesType && matchesSearch && matchesReadStatus;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="h-full p-6 overflow-y-auto scrollbar-hide"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-neutral-400">
              Stay updated with your activity and creator updates
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Mark all read</span>
              </button>
            )}
            <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">Filter:</span>
          </div>
          {notificationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type.id
                    ? 'bg-neutral-700 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{type.name}</span>
                <span className="px-2 py-0.5 bg-neutral-600 rounded-full text-xs">
                  {type.count}
                </span>
              </button>
            );
          })}
          <div className="flex items-center space-x-2 ml-4">
            <input
              type="checkbox"
              id="showRead"
              checked={showRead}
              onChange={(e) => setShowRead(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-neutral-800 border-neutral-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="showRead" className="text-sm text-neutral-400">
              Show read notifications
            </label>
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div variants={itemVariants}>
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
            <p className="text-neutral-400">
              {searchQuery || filterType !== 'all' 
                ? 'No notifications match your current filters.'
                : 'You\'re all caught up! Check back later for new updates.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                className={`bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300 ${
                  !notification.isRead ? 'ring-1 ring-blue-500/20' : ''
                } ${getPriorityColor(notification.priority)} border-l-4`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-white">{notification.title}</h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        {notification.priority === 'high' && (
                          <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full">
                            High Priority
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-neutral-400">{notification.timestamp}</span>
                        <button className="p-1 hover:bg-neutral-700 rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-neutral-400" />
                        </button>
                      </div>
                    </div>

                    <p className="text-neutral-300 text-sm mb-3">{notification.message}</p>

                    {/* Additional Info */}
                    {(notification.creator || notification.project || notification.amount) && (
                      <div className="flex items-center space-x-4 text-sm">
                        {notification.creator && (
                          <div className="flex items-center space-x-2">
                            <img
                              src={notification.creatorAvatar}
                              alt={notification.creator}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-neutral-400">{notification.creator}</span>
                          </div>
                        )}
                        {notification.project && (
                          <div className="flex items-center space-x-1">
                            <span className="text-neutral-600">•</span>
                            <span className="text-neutral-400">{notification.project}</span>
                          </div>
                        )}
                        {notification.amount && (
                          <div className="flex items-center space-x-1">
                            <span className="text-neutral-600">•</span>
                            <span className="text-green-400 font-medium">${notification.amount}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 bg-neutral-700 hover:bg-red-600 rounded-lg transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Notifications;  