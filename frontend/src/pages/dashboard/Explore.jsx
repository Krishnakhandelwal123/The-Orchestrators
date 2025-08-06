import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Heart, 
  Users, 
  Star, 
  MapPin, 
  Globe, 
  TrendingUp,
  Award,
  Sparkles,
  Eye,
  MessageCircle,
  Share2,
  Grid,
  List
} from 'lucide-react';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [viewMode, setViewMode] = useState('grid');
  const [creators, setCreators] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      username: '@sarahchen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      category: 'Technology',
      location: 'San Francisco, CA',
      followers: 12450,
      projects: 8,
      totalRaised: 125000,
      description: 'Building the future of AI-powered applications. Full-stack developer passionate about creating impactful solutions.',
      tags: ['React', 'Node.js', 'AI/ML', 'Startup'],
      isVerified: true,
      isTrending: true,
      rating: 4.8,
      featured: true
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      username: '@marcusrod',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      category: 'Design',
      location: 'New York, NY',
      followers: 8920,
      projects: 12,
      totalRaised: 89000,
      description: 'Creative director and UI/UX designer. Crafting beautiful digital experiences that users love.',
      tags: ['UI/UX', 'Figma', 'Branding', 'Web Design'],
      isVerified: true,
      isTrending: false,
      rating: 4.9,
      featured: false
    },
    {
      id: 3,
      name: 'Alex Thompson',
      username: '@alexthompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      category: 'Gaming',
      location: 'Seattle, WA',
      followers: 15680,
      projects: 5,
      totalRaised: 210000,
      description: 'Indie game developer creating immersive experiences. From concept to launch, bringing dreams to life.',
      tags: ['Unity', 'C#', 'Game Design', '3D Modeling'],
      isVerified: true,
      isTrending: true,
      rating: 4.7,
      featured: true
    },
    {
      id: 4,
      name: 'Emma Wilson',
      username: '@emmawilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      category: 'Art',
      location: 'Los Angeles, CA',
      followers: 6780,
      projects: 15,
      totalRaised: 67000,
      description: 'Digital artist and illustrator. Creating stunning visuals that tell stories and evoke emotions.',
      tags: ['Digital Art', 'Illustration', 'NFTs', 'Animation'],
      isVerified: false,
      isTrending: false,
      rating: 4.6,
      featured: false
    },
    {
      id: 5,
      name: 'David Kim',
      username: '@davidkim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      category: 'Technology',
      location: 'Austin, TX',
      followers: 11200,
      projects: 6,
      totalRaised: 95000,
      description: 'Backend engineer specializing in scalable systems. Building robust APIs and microservices.',
      tags: ['Python', 'Django', 'AWS', 'DevOps'],
      isVerified: true,
      isTrending: false,
      rating: 4.8,
      featured: false
    },
    {
      id: 6,
      name: 'Lisa Park',
      username: '@lisapark',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      category: 'Music',
      location: 'Nashville, TN',
      followers: 5430,
      projects: 9,
      totalRaised: 45000,
      description: 'Composer and music producer. Creating original scores and soundtracks for various media.',
      tags: ['Composition', 'Production', 'Sound Design', 'Film'],
      isVerified: false,
      isTrending: true,
      rating: 4.5,
      featured: false
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🌟' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'art', name: 'Art', icon: '🖼️' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'education', name: 'Education', icon: '📚' }
  ];

  const sortOptions = [
    { id: 'trending', name: 'Trending', icon: TrendingUp },
    { id: 'newest', name: 'Newest', icon: Sparkles },
    { id: 'rating', name: 'Top Rated', icon: Star },
    { id: 'followers', name: 'Most Followed', icon: Users }
  ];

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || creator.category.toLowerCase() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return b.isTrending - a.isTrending || b.followers - a.followers;
      case 'newest':
        return b.id - a.id;
      case 'rating':
        return b.rating - a.rating;
      case 'followers':
        return b.followers - a.followers;
      default:
        return 0;
    }
  });

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

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
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
            <h1 className="text-3xl font-bold text-white mb-2">Explore Creators</h1>
            <p className="text-neutral-400">
              Discover amazing developers, designers, and creators to support
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-neutral-700 text-white' 
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-neutral-700 text-white' 
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search creators, projects, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-colors"
          />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-wrap items-center gap-4">
          {/* Categories */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">Categories:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-neutral-700 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-4 mt-4">
          <span className="text-sm text-neutral-400">Sort by:</span>
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === option.id
                    ? 'bg-neutral-700 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{option.name}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div variants={itemVariants} className="mb-6">
        <p className="text-neutral-400">
          Found {sortedCreators.length} creator{sortedCreators.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Creators Grid/List */}
      <motion.div variants={itemVariants}>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCreators.map((creator) => (
              <motion.div
                key={creator.id}
                className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-900/50"
                whileHover={{ y: -4 }}
              >
                {/* Creator Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {creator.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{creator.name}</h3>
                      <p className="text-sm text-neutral-400">{creator.username}</p>
                    </div>
                  </div>
                  {creator.featured && (
                    <div className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Creator Info */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-neutral-400">{creator.category}</span>
                    <span className="text-neutral-600">•</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span className="text-sm text-neutral-400">{creator.location}</span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-300 line-clamp-2">{creator.description}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-neutral-400" />
                      <span className="text-neutral-300">{formatNumber(creator.followers)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-neutral-300">{creator.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">${formatNumber(creator.totalRaised)}</div>
                    <div className="text-xs text-neutral-400">Total Raised</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {creator.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-neutral-700 text-xs text-neutral-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {creator.tags.length > 3 && (
                    <span className="px-2 py-1 bg-neutral-700 text-xs text-neutral-400 rounded-full">
                      +{creator.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View Profile</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Follow</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCreators.map((creator) => (
              <motion.div
                key={creator.id}
                className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {creator.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-white">{creator.name}</h3>
                      <span className="text-sm text-neutral-400">{creator.username}</span>
                      {creator.featured && (
                        <div className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-neutral-400 mb-2">
                      <span>{creator.category}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{creator.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-neutral-300 mb-3">{creator.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-300">{formatNumber(creator.followers)} followers</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-neutral-300">{creator.rating} rating</span>
                      </div>
                      <div className="text-neutral-300">
                        ${formatNumber(creator.totalRaised)} raised
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                      <MessageCircle className="w-4 h-4" />
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

export default Explore; 