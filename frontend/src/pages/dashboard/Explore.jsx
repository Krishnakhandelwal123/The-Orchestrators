import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { axiosInstance } from '../../lib/Axios'
import { toast } from 'react-hot-toast'
import {
  Brain, FileText, Target, GraduationCap, Rocket, Users, Sparkles,
  TrendingUp, BookOpen, Award, Zap, ArrowRight, X, Loader2
} from 'lucide-react'

const Explore = () => {
  const [loading, setLoading] = useState(false)
  const [fiveLoading, setFiveLoading] = useState(false)
  const [pathwayLoading, setPathwayLoading] = useState(false)
  const [pathway, setPathway] = useState(null)
  const [courseLoading, setCourseLoading] = useState(false)
  const [courses, setCourses] = useState(null)
  const [portfolioLoading, setPortfolioLoading] = useState(false)
  const [portfolio, setPortfolio] = useState(null)
  const [careerRoleLoading, setCareerRoleLoading] = useState(false)
  const [careerRoles, setCareerRoles] = useState(null)

  const handlePersonalityReview = async () => {
    try {
      setLoading(true)
      // Fetch instructions from backend (sourced from personality.py)
      const instrRes = await axiosInstance.get('/analysis/personality/instructions')
      const instructions = instrRes?.data?.instructions || 'Enter your 3-letter RIASEC code (e.g., RCE, IAS).'

      const input = window.prompt(`${instructions}\n\nExample: RCE or IAS`)
      if (input === null) return // user cancelled
      const riasecCode = String(input).trim().toUpperCase()
      if (!riasecCode) {
        toast.error('Please enter a 3-letter RIASEC code')
        return
      }

      const res = await axiosInstance.post('/analysis/personality', { riasecCode })
      const summary = res?.data?.personalityResult?.summary || 'No summary generated.'
      toast.success('Personality summary saved to your analysis')
      // Optionally show the summary in an alert for quick view
      window.alert(`Your Personality Summary (\n${riasecCode}\n)\n\n${summary}`)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to run personality review'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const actionCards = [
    {
      id: 'personality',
      icon: <Brain size={24} className="text-blue-400" />,
      title: 'Personality Review',
      description: 'Analyze your RIASEC personality type and get career insights',
      color: 'from-blue-500/20 to-blue-600/10',
      borderColor: 'border-blue-500/30',
      buttonColor: 'bg-blue-600 hover:bg-blue-500',
      onClick: handlePersonalityReview,
      loading: loading,
      disabled: loading
    },
    {
      id: 'analyse-five',
      icon: <FileText size={24} className="text-green-400" />,
      title: 'Analyse Profile',
      description: 'Generate comprehensive profile from your uploaded documents',
      color: 'from-green-500/20 to-green-600/10',
      borderColor: 'border-green-500/30',
      buttonColor: 'bg-green-600 hover:bg-green-500',
      onClick: async () => {
        try {
          setFiveLoading(true)
          const res = await axiosInstance.post('/students/analyse-five')
          toast.success('Student profile generated and saved')
        } catch (err) {
          const msg = err?.response?.data?.message || err?.response?.data?.error || 'Failed to generate profile'
          toast.error(msg)
        } finally {
          setFiveLoading(false)
        }
      },
      loading: fiveLoading,
      disabled: fiveLoading
    },
    {
      id: 'skill-pathway',
      icon: <Target size={24} className="text-purple-400" />,
      title: 'Skill Pathways',
      description: 'Build a personalized learning roadmap for your target career',
      color: 'from-purple-500/20 to-purple-600/10',
      borderColor: 'border-purple-500/30',
      buttonColor: 'bg-purple-600 hover:bg-purple-500',
      onClick: async () => {
        try {
          const target = window.prompt('Enter your target career (e.g., Machine Learning Engineer)')
          if (target === null) return
          const targetCareer = String(target).trim()
          if (!targetCareer) return toast.error('Please enter a target career')
          setPathwayLoading(true)
          const res = await axiosInstance.post('/students/skill-pathway', { targetCareer })
          setPathway(res?.data?.pathway || null)
          if (!res?.data?.pathway) toast('No pathway returned')
        } catch (err) {
          const msg = err?.response?.data?.message || 'Failed to generate skill pathway'
          toast.error(msg)
        } finally {
          setPathwayLoading(false)
        }
      },
      loading: pathwayLoading,
      disabled: pathwayLoading
    },
    {
      id: 'portfolio',
      icon: <Rocket size={24} className="text-pink-400" />,
      title: 'Portfolio Builder',
      description: 'Get a 3-step project roadmap to build an impressive portfolio',
      color: 'from-pink-500/20 to-pink-600/10',
      borderColor: 'border-pink-500/30',
      buttonColor: 'bg-pink-600 hover:bg-pink-500',
      onClick: async () => {
        try {
          setPortfolioLoading(true)
          const res = await axiosInstance.post('/students/portfolio-builder')
          setPortfolio(res?.data?.portfolio || null)
          if (!res?.data?.portfolio) toast('No portfolio returned')
        } catch (err) {
          const msg = err?.response?.data?.message || 'Failed to build portfolio guide'
          toast.error(msg)
        } finally {
          setPortfolioLoading(false)
        }
      },
      loading: portfolioLoading,
      disabled: portfolioLoading
    },
    {
      id: 'courses',
      icon: <BookOpen size={24} className="text-amber-400" />,
      title: 'Course Recommendations',
      description: 'Get personalized course suggestions based on your profile',
      color: 'from-amber-500/20 to-amber-600/10',
      borderColor: 'border-amber-500/30',
      buttonColor: 'bg-amber-600 hover:bg-amber-500',
      onClick: async () => {
        try {
          setCourseLoading(true)
          const res = await axiosInstance.post('/students/course-recommendations')
          setCourses(res?.data?.recommendations || null)
          if (!res?.data?.recommendations) toast('No recommendations returned')
        } catch (err) {
          const msg = err?.response?.data?.message || 'Failed to generate course recommendations'
          toast.error(msg)
        } finally {
          setCourseLoading(false)
        }
      },
      loading: courseLoading,
      disabled: courseLoading
    },
    {
      id: 'career-role',
      icon: <Users size={24} className="text-indigo-400" />,
      title: 'Career Role',
      description: 'Discover AI-recommended career paths based on market demand',
      color: 'from-indigo-500/20 to-indigo-600/10',
      borderColor: 'border-indigo-500/30',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-500',
      onClick: async () => {
        try {
          setCareerRoleLoading(true)
          const location = window.prompt('Enter location for industry demand data (e.g., India):', 'India')
          if (location === null) return
          const res = await axiosInstance.post('/career-role/suggest', { location: location.trim() || 'India' })
          setCareerRoles(res?.data?.suggested_roles || null)
          if (!res?.data?.suggested_roles || res?.data?.suggested_roles.length === 0) {
            toast('No career roles returned')
          } else {
            toast.success('Career roles generated successfully')
          }
        } catch (err) {
          const msg = err?.response?.data?.message || 'Failed to generate career roles'
          toast.error(msg)
        } finally {
          setCareerRoleLoading(false)
        }
      },
      loading: careerRoleLoading,
      disabled: careerRoleLoading
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <Sparkles size={24} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Explore AI Tools
            </h2>
            <p className="text-neutral-400 text-sm">Discover personalized insights and recommendations</p>
          </div>
        </div>
      </motion.div>

      {/* Action Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {actionCards.map((card, index) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            onClick={card.onClick}
            disabled={card.disabled}
            className={`group relative p-6 rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.color} backdrop-blur-sm hover:border-opacity-60 transition-all duration-300 text-left overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={!card.disabled ? { scale: 1.02, y: -4 } : {}}
            whileTap={!card.disabled ? { scale: 0.98 } : {}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative">
              <div className="mb-4 p-3 w-fit rounded-xl bg-black/20 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 transition-all">
                {card.title}
              </h3>
              <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
                {card.description}
              </p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${card.buttonColor} text-white transition-all`}>
                {card.loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Try Now</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {courses && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20">
                    <BookOpen size={24} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Recommended Courses</h3>
                    <p className="text-neutral-400 text-sm">Tailored from your profile analysis</p>
                  </div>
                </div>
                <button
                  onClick={() => setCourses(null)}
                  className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses?.courses?.map?.((c, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="font-semibold text-white text-lg">{c.title}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 font-medium">{c.level}</span>
                    </div>
                    {c.provider && (
                      <div className="flex items-center gap-2 text-neutral-300 text-sm mb-2">
                        <GraduationCap size={14} />
                        <span>{c.provider}</span>
                      </div>
                    )}
                    {Array.isArray(c.topics) && c.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {c.topics.slice(0, 3).map((topic, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs rounded-full border border-white/10 bg-white/5 text-neutral-300">
                            {topic}
                          </span>
                        ))}
                        {c.topics.length > 3 && (
                          <span className="px-2 py-1 text-xs rounded-full text-neutral-400">
                            +{c.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    {c.why && (
                      <div className="text-neutral-300 text-sm leading-relaxed bg-white/5 p-3 rounded-lg">
                        {c.why}
                      </div>
                    )}
                  </motion.li>
                ))}
              </ul>
              {courses?.summary && (
                <div className="p-4 rounded-xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-amber-600/5">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-400" />
                    Summary
                  </h4>
                  <div className="text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap">{courses.summary}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {pathway && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 via-purple-600/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20">
                    <Target size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Skill Pathway</h3>
                    <p className="text-neutral-400 text-sm">Your personalized learning roadmap</p>
                  </div>
                </div>
                <button
                  onClick={() => setPathway(null)}
                  className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {pathway?.skill_pathway && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Zap size={18} className="text-blue-400" />
                      Technical Pathway
                    </h4>
                    <ul className="space-y-3">
                      {pathway.skill_pathway?.technical_pathway?.map?.((s, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-3 rounded-lg border border-white/10 bg-black/20"
                        >
                          <div className="font-medium text-white mb-1">{s.stage}</div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {(s.skills||[]).map((skill, i) => (
                              <span key={i} className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                          {s.reasoning && (
                            <div className="text-neutral-400 text-xs mt-2 leading-relaxed">{s.reasoning}</div>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-5 rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Users size={18} className="text-purple-400" />
                      Soft Skill Pathway
                    </h4>
                    <ul className="space-y-3">
                      {pathway.skill_pathway?.soft_skill_pathway?.map?.((s, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-3 rounded-lg border border-white/10 bg-black/20"
                        >
                          <div className="font-medium text-white mb-1">{s.stage}</div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {(s.skills||[]).map((skill, i) => (
                              <span key={i} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                          {s.reasoning && (
                            <div className="text-neutral-400 text-xs mt-2 leading-relaxed">{s.reasoning}</div>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {pathway?.final_explanation && (
                <div className="p-5 rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-400" />
                    Pathway Explanation
                  </h4>
                  <div className="text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap">{pathway.final_explanation}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {portfolio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-pink-500/10 via-pink-600/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-pink-500/20">
                    <Rocket size={24} className="text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Portfolio Guide</h3>
                    <p className="text-neutral-400 text-sm">Your roadmap to a standout portfolio</p>
                  </div>
                </div>
                <button
                  onClick={() => setPortfolio(null)}
                  className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm text-neutral-200 leading-relaxed p-4 rounded-xl bg-black/20 border border-white/10">
                {portfolio?.final_guide || JSON.stringify(portfolio, null, 2)}
              </div>
            </div>
          </motion.div>
        )}

        {careerRoles && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 via-indigo-600/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/20">
                    <Users size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Suggested Career Roles</h3>
                    <p className="text-neutral-400 text-sm">Based on your profile and industry demand</p>
                  </div>
                </div>
                <button
                  onClick={() => setCareerRoles(null)}
                  className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careerRoles.map((role, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm hover:border-indigo-500/30 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-lg font-semibold text-white flex-1">{role.role}</h4>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        role.market_trend === 'High' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        role.market_trend === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {role.market_trend || 'N/A'} Demand
                      </span>
                    </div>
                    {role.reason && (
                      <p className="text-neutral-300 text-sm leading-relaxed">{role.reason}</p>
                    )}
                    {role.salary_range && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <TrendingUp size={16} className="text-indigo-400" />
                        <div>
                          <span className="text-xs text-neutral-400">Salary Range:</span>
                          <p className="text-sm font-semibold text-white">{role.salary_range}</p>
                        </div>
                      </div>
                    )}
                    {Array.isArray(role.skills_to_learn) && role.skills_to_learn.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-2 text-neutral-200 flex items-center gap-2">
                          <Award size={16} className="text-indigo-400" />
                          Skills to Learn
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {role.skills_to_learn.map((skill, i) => (
                            <span key={i} className="px-2 py-1 text-xs rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Explore
