import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, TrendingUp, DollarSign, Code, Users, Briefcase, 
  MapPin, RefreshCw, AlertCircle, CheckCircle2, Sparkles,
  Building2, Laptop, TrendingDown, ArrowUp, ArrowDown
} from 'lucide-react'

const Section = ({ title, children, icon, gradient = 'from-blue-500/20 to-blue-600/10', borderColor = 'border-blue-500/30' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-2xl border ${borderColor} bg-gradient-to-br ${gradient} backdrop-blur-sm p-6 shadow-xl overflow-hidden`}
  >
    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
      {icon}
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </motion.div>
)

const Notification = () => {
  const [location, setLocation] = useState('India')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  const fetchLatest = async (loc) => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${API_BASE}/api/industry-demand/latest?location=${encodeURIComponent(loc)}`, {
        credentials: 'include'
      })
      if (res.status === 404) {
        // No cached data; trigger fresh run
        const runRes = await fetch(`${API_BASE}/api/industry-demand/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ location: loc })
        })
        if (!runRes.ok) throw new Error('Failed to fetch industry demand')
        const runJson = await runRes.json()
        setData(runJson.data)
        return
      }
      if (!res.ok) throw new Error('Failed to fetch industry demand')
      const json = await res.json()
      console.log('Industry Demand Data:', json.data) // Debug log
      setData(json.data)
    } catch (e) {
      setError(e.message || 'Something went wrong')
      console.error('Fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLatest(location)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    fetchLatest(location)
  }

  // Handle data structure - could be nested or flat
  const jd = data?.job_demand_data || (typeof data?.job_demand_data === 'object' && data?.job_demand_data !== null ? data.job_demand_data : {})
  const sal = data?.salary_data || (typeof data?.salary_data === 'object' && data?.salary_data !== null ? data.salary_data : {})
  const sk = data?.skills_data || (typeof data?.skills_data === 'object' && data?.skills_data !== null ? data.skills_data : {})
  const sum = data?.summary || (typeof data?.summary === 'object' && data?.summary !== null ? data.summary : {})

  const COUNTRIES = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Singapore', 'Japan', 'Brazil'
  ]

  // Helper to check if section has any content
  const hasContent = (obj) => {
    if (!obj || typeof obj !== 'object') return false
    return Object.keys(obj).some(key => {
      const val = obj[key]
      if (Array.isArray(val)) return val.length > 0
      if (typeof val === 'string') return val.trim().length > 0
      if (typeof val === 'number') return true
      if (typeof val === 'object' && val !== null) return hasContent(val)
      return false
    })
  }

  const renderField = (label, value, isArray = false) => {
    if (isArray && Array.isArray(value) && value.length > 0) {
      return (
        <div className="mb-3">
          <p className="text-sm font-semibold mb-1 text-neutral-200">{label}:</p>
          <ul className="list-disc list-inside text-neutral-300 space-y-1">
            {value.map((item, i) => (
              <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
            ))}
          </ul>
        </div>
      )
    }
    if (!isArray && value && value !== '' && value !== null) {
      return (
        <p className="mb-2 text-neutral-300">
          <span className="font-semibold text-neutral-200">{label}:</span> {value}
        </p>
      )
    }
    return null
  }

  const renderChips = (items = []) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className="px-2 py-1 text-xs rounded-full border border-white/10 bg-white/5 text-neutral-200">
          {typeof item === 'object' ? JSON.stringify(item) : item}
        </span>
      ))}
    </div>
  )

  return (
    <div className="space-y-6 h-full overflow-y-auto scrollbar-hide p-1">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <BarChart3 size={28} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Industry Demand
            </h2>
            <p className="text-sm text-neutral-400">Real-time job market insights and trends</p>
          </div>
        </div>
        
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSearch}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/10 focus:border-blue-500/50 focus:outline-none text-white appearance-none cursor-pointer hover:bg-black/40 transition-all"
            >
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Analyzing…</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Analyze</span>
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 space-y-4"
        >
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <RefreshCw size={32} className="text-blue-400 animate-spin" />
          </div>
          <p className="text-neutral-400 font-medium">Analyzing industry demand data...</p>
          <p className="text-xs text-neutral-500">This may take a few moments</p>
        </motion.div>
      )}

      {/* Empty State */}
      {!data && !loading && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 space-y-4"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
            <BarChart3 size={48} className="text-blue-400" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-neutral-300 font-semibold text-lg">No data available yet</p>
            <p className="text-neutral-400 text-sm">Click Analyze to fetch industry demand data for {location}</p>
          </div>
        </motion.div>
      )}

      {/* Data Display */}
      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={16} className="text-blue-400" />
                    <span className="font-semibold text-white">{data.location || location}</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Last updated: {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'Recently'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-neutral-300">Data Active</span>
              </div>
            </motion.div>

            {/* Stats Cards */}
            {jd.total_job_openings_estimated && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-5 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Briefcase size={20} className="text-blue-400" />
                    <TrendingUp size={16} className="text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{jd.total_job_openings_estimated.toLocaleString()}+</p>
                  <p className="text-sm text-neutral-400">Total Job Openings</p>
                </motion.div>

                {Array.isArray(jd.top_5_in_demand_job_titles) && jd.top_5_in_demand_job_titles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-5 rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Users size={20} className="text-purple-400" />
                      <Sparkles size={16} className="text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{jd.top_5_in_demand_job_titles.length}</p>
                    <p className="text-sm text-neutral-400">Top In-Demand Roles</p>
                  </motion.div>
                )}

                {Array.isArray(sk.top_10_in_demand_technical_skills) && sk.top_10_in_demand_technical_skills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-5 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Code size={20} className="text-indigo-400" />
                      <ArrowUp size={16} className="text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{sk.top_10_in_demand_technical_skills.length}+</p>
                    <p className="text-sm text-neutral-400">Key Skills Tracked</p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Job Demand Section */}
              <Section 
                title="Job Demand" 
                icon={<Briefcase size={22} className="text-blue-400" />}
                gradient="from-blue-500/20 to-blue-600/10"
                borderColor="border-blue-500/30"
              >
                {jd.total_job_openings_estimated && (
                  <div className="p-4 rounded-xl bg-black/20 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-400">Total Openings (Est.)</span>
                      <TrendingUp size={16} className="text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{jd.total_job_openings_estimated.toLocaleString()}</p>
                  </div>
                )}
                
                {Array.isArray(jd.top_5_in_demand_job_titles) && jd.top_5_in_demand_job_titles.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3 text-neutral-200 flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-400" />
                      Top Job Titles
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {jd.top_5_in_demand_job_titles.map((title, i) => (
                        <div key={i} className="p-3 rounded-lg bg-black/20 border border-white/10 hover:border-blue-500/30 transition-all">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-blue-400">#{i + 1}</span>
                            <span className="text-sm text-neutral-200 font-medium">{title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {jd.job_growth_trend && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={16} className="text-green-400" />
                      <span className="text-sm font-semibold text-white">Growth Trend</span>
                    </div>
                    <p className="text-neutral-300 text-sm leading-relaxed">{jd.job_growth_trend}</p>
                  </div>
                )}

                {Array.isArray(jd.industries_with_highest_demand) && jd.industries_with_highest_demand.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3 text-neutral-200 flex items-center gap-2">
                      <Building2 size={16} className="text-blue-400" />
                      Top Industries
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {jd.industries_with_highest_demand.map((industry, i) => (
                        <span key={i} className="px-3 py-1.5 text-xs rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {jd.remote_vs_on_site_distribution && (
                  <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Laptop size={16} className="text-purple-400" />
                      <span className="text-sm font-semibold text-white">Work Distribution</span>
                    </div>
                    <p className="text-neutral-300 text-sm">{jd.remote_vs_on_site_distribution}</p>
                  </div>
                )}

                {!hasContent(jd) && (
                  <div className="text-center py-8 text-neutral-500 text-sm">
                    No job demand data available yet.
                  </div>
                )}
              </Section>

              {/* Salary Insights Section */}
              <Section 
                title="Salary Insights" 
                icon={<DollarSign size={22} className="text-green-400" />}
                gradient="from-green-500/20 to-green-600/10"
                borderColor="border-green-500/30"
              >
                {Array.isArray(sal.average_salary_ranges) && sal.average_salary_ranges.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3 text-neutral-200 flex items-center gap-2">
                      <TrendingUp size={16} className="text-green-400" />
                      Average Salary Ranges
                    </p>
                    <div className="space-y-3">
                      {sal.average_salary_ranges.slice(0, 3).map((r, i) => (
                        <div key={i} className="p-3 rounded-lg bg-black/20 border border-white/10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">{r.role || 'Role'}</span>
                            {r.average_annual && (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                                Avg: {r.average_annual}
                              </span>
                            )}
                          </div>
                          {r.min_annual && r.max_annual && (
                            <p className="text-xs text-neutral-400">
                              {r.min_annual} - {r.max_annual} {r.currency || ''}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(sal.highest_paying_roles) && sal.highest_paying_roles.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3 text-neutral-200 flex items-center gap-2">
                      <ArrowUp size={16} className="text-green-400" />
                      Highest Paying Roles
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sal.highest_paying_roles.map((role, i) => (
                        <span key={i} className="px-3 py-1.5 text-xs rounded-full bg-green-500/20 border border-green-500/30 text-green-300 font-medium">
                          {typeof role === 'object' ? (role.role || JSON.stringify(role)) : role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {sal.salary_growth_rate_yoy_percent && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={16} className="text-green-400" />
                      <span className="text-sm font-semibold text-white">Salary Growth (YoY)</span>
                    </div>
                    <p className="text-2xl font-bold text-green-400">{sal.salary_growth_rate_yoy_percent}%</p>
                  </div>
                )}

                {sal.cost_of_living_adjustment_factors && (
                  <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                    <p className="text-sm font-semibold mb-2 text-white">Cost of Living Factors</p>
                    <p className="text-neutral-300 text-sm leading-relaxed">{sal.cost_of_living_adjustment_factors}</p>
                  </div>
                )}

                {!hasContent(sal) && (
                  <div className="text-center py-8 text-neutral-500 text-sm">
                    No salary data available yet.
                  </div>
                )}
              </Section>

              {/* Skills Trends Section */}
              <Section 
                title="Skills Trends" 
                icon={<Code size={22} className="text-purple-400" />}
                gradient="from-purple-500/20 to-purple-600/10"
                borderColor="border-purple-500/30"
              >
                {Array.isArray(sk.top_10_in_demand_technical_skills) && sk.top_10_in_demand_technical_skills.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3 text-neutral-200 flex items-center gap-2">
                      <Code size={16} className="text-purple-400" />
                      Technical Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sk.top_10_in_demand_technical_skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 text-xs rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(sk.top_10_in_demand_soft_skills) && sk.top_10_in_demand_soft_skills.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3 text-neutral-200 flex items-center gap-2">
                      <Users size={16} className="text-purple-400" />
                      Soft Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sk.top_10_in_demand_soft_skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 text-xs rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(sk.emerging_technologies) && sk.emerging_technologies.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3 text-neutral-200 flex items-center gap-2">
                      <Sparkles size={16} className="text-purple-400" />
                      Emerging Technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sk.emerging_technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-500/30 border border-purple-500/40 text-purple-200 font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(sk.skills_with_highest_salary_premium) && sk.skills_with_highest_salary_premium.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3 text-neutral-200 flex items-center gap-2">
                      <DollarSign size={16} className="text-purple-400" />
                      High Salary Premium Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sk.skills_with_highest_salary_premium.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-300 font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>

              {/* Market Summary Section */}
              <Section 
                title="Market Summary" 
                icon={<BarChart3 size={22} className="text-indigo-400" />}
                gradient="from-indigo-500/20 to-indigo-600/10"
                borderColor="border-indigo-500/30"
              >
                {sum.overview && (
                  <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                    <p className="text-sm font-semibold mb-2 text-white flex items-center gap-2">
                      <Sparkles size={16} className="text-indigo-400" />
                      Overview
                    </p>
                    <p className="text-neutral-300 text-sm leading-relaxed">{sum.overview}</p>
                  </div>
                )}

                {sum.key_opportunities && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20">
                    <p className="text-sm font-semibold mb-2 text-white flex items-center gap-2">
                      <TrendingUp size={16} className="text-green-400" />
                      Key Opportunities
                    </p>
                    <p className="text-neutral-300 text-sm leading-relaxed">{sum.key_opportunities}</p>
                  </div>
                )}

                {sum.salary_competitiveness && (
                  <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                    <p className="text-sm font-semibold mb-2 text-white flex items-center gap-2">
                      <DollarSign size={16} className="text-indigo-400" />
                      Salary Competitiveness
                    </p>
                    <p className="text-neutral-300 text-sm leading-relaxed">{sum.salary_competitiveness}</p>
                  </div>
                )}

                {sum.market_outlook && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <p className="text-sm font-semibold mb-2 text-white flex items-center gap-2">
                      <BarChart3 size={16} className="text-blue-400" />
                      Market Outlook
                    </p>
                    <p className="text-neutral-300 text-sm leading-relaxed">{sum.market_outlook}</p>
                  </div>
                )}

                {sum.recommendations && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                    <p className="text-sm font-semibold mb-2 text-white flex items-center gap-2">
                      <Sparkles size={16} className="text-purple-400" />
                      Recommendations
                    </p>
                    <p className="text-neutral-300 text-sm leading-relaxed">{sum.recommendations}</p>
                  </div>
                )}

                {!hasContent(sum) && (
                  <div className="text-center py-8 text-neutral-500 text-sm">
                    No summary data available yet.
                  </div>
                )}
              </Section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Notification
