import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../Store/AuthStore';
import { 
  User, 
  FileText, 
  Globe, 
  Github, 
  Twitter, 
  Linkedin, 
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Loader2
} from 'lucide-react';
import FloatingShape from '../components/FloatingShape';

const BecomeCreator = () => {
  const navigate = useNavigate();
  const { authUser, becomeCreator, isBecomingCreator } = useAuthStore();
  
  const [formData, setFormData] = useState({
    displayName: authUser?.name || '',
    bio: '',
    category: '',
    avatar: authUser?.profileImage || '',
    socialLinks: {
      github: '',
      twitter: '',
      linkedin: '',
      website: ''
    }
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'Developer', label: 'Developer', icon: '💻' },
    { value: 'Data Scientist', label: 'Data Scientist', icon: '📊' },
    { value: 'Designer', label: 'Designer', icon: '🎨' },
    { value: 'Other', label: 'Other', icon: '🚀' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters';
    } else if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    // Validate URLs if provided
    const urlRegex = /^https?:\/\/.+/;
    if (formData.socialLinks.github && !urlRegex.test(formData.socialLinks.github)) {
      newErrors.github = 'Please enter a valid GitHub URL';
    }
    if (formData.socialLinks.twitter && !urlRegex.test(formData.socialLinks.twitter)) {
      newErrors.twitter = 'Please enter a valid Twitter URL';
    }
    if (formData.socialLinks.linkedin && !urlRegex.test(formData.socialLinks.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    if (formData.socialLinks.website && !urlRegex.test(formData.socialLinks.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await becomeCreator(formData);
    if (result.success) {
      // Navigate to creator home page
      navigate('/c/home');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[platform]) {
      setErrors(prev => ({
        ...prev,
        [platform]: ''
      }));
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden">
      {/* Background floating shapes */}
      <FloatingShape size='w-64 h-64' top='-5%' left='10%' delay={0} />
      <FloatingShape size='w-48 h-48' top='70%' left='80%' delay={5} />
      <FloatingShape size='w-32 h-32' top='40%' left='-10%' delay={2} />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold">Become a Creator</h1>
            </div>
            
            <p className="text-neutral-400 text-lg">
              Share your story and start your creator journey on DevFund
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Display Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2">
                  <User size={16} />
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className={`w-full px-4 py-3 bg-neutral-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.displayName 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-neutral-700 focus:border-blue-500 focus:ring-blue-500/50'
                  }`}
                  placeholder="Enter your display name"
                />
                {errors.displayName && (
                  <p className="text-red-400 text-sm mt-1">{errors.displayName}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2">
                  <FileText size={16} />
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 bg-neutral-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.bio 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-neutral-700 focus:border-blue-500 focus:ring-blue-500/50'
                  }`}
                  placeholder="Tell us about yourself, your skills, and what you're passionate about..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.bio && (
                    <p className="text-red-400 text-sm">{errors.bio}</p>
                  )}
                  <p className="text-neutral-500 text-sm ml-auto">
                    {formData.bio.length}/500
                  </p>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2">
                  <Globe size={16} />
                  Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => handleInputChange('category', category.value)}
                      className={`p-4 rounded-lg border transition-all ${
                        formData.category === category.value
                          ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                          : 'border-neutral-700 hover:border-neutral-600 bg-neutral-800/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className="font-semibold">{category.label}</div>
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-red-400 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Social Links */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-3">
                  <ExternalLink size={16} />
                  Social Links (Optional)
                </label>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Github size={16} className="text-neutral-400" />
                      <span className="text-sm text-neutral-400">GitHub</span>
                    </div>
                    <input
                      type="url"
                      value={formData.socialLinks.github}
                      onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                      className={`w-full px-4 py-3 bg-neutral-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.github 
                          ? 'border-red-500 focus:ring-red-500/50' 
                          : 'border-neutral-700 focus:border-blue-500 focus:ring-blue-500/50'
                      }`}
                      placeholder="https://github.com/yourusername"
                    />
                    {errors.github && (
                      <p className="text-red-400 text-sm mt-1">{errors.github}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Twitter size={16} className="text-neutral-400" />
                      <span className="text-sm text-neutral-400">Twitter</span>
                    </div>
                    <input
                      type="url"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                      className={`w-full px-4 py-3 bg-neutral-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.twitter 
                          ? 'border-red-500 focus:ring-red-500/50' 
                          : 'border-neutral-700 focus:border-blue-500 focus:ring-blue-500/50'
                      }`}
                      placeholder="https://twitter.com/yourusername"
                    />
                    {errors.twitter && (
                      <p className="text-red-400 text-sm mt-1">{errors.twitter}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Linkedin size={16} className="text-neutral-400" />
                      <span className="text-sm text-neutral-400">LinkedIn</span>
                    </div>
                    <input
                      type="url"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                      className={`w-full px-4 py-3 bg-neutral-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.linkedin 
                          ? 'border-red-500 focus:ring-red-500/50' 
                          : 'border-neutral-700 focus:border-blue-500 focus:ring-blue-500/50'
                      }`}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                    {errors.linkedin && (
                      <p className="text-red-400 text-sm mt-1">{errors.linkedin}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Globe size={16} className="text-neutral-400" />
                      <span className="text-sm text-neutral-400">Website</span>
                    </div>
                    <input
                      type="url"
                      value={formData.socialLinks.website}
                      onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                      className={`w-full px-4 py-3 bg-neutral-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.website 
                          ? 'border-red-500 focus:ring-red-500/50' 
                          : 'border-neutral-700 focus:border-blue-500 focus:ring-blue-500/50'
                      }`}
                      placeholder="https://yourwebsite.com"
                    />
                    {errors.website && (
                      <p className="text-red-400 text-sm mt-1">{errors.website}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isBecomingCreator}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBecomingCreator ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Becoming Creator...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Become a Creator
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeCreator; 