import React, { useState } from 'react'
import { axiosInstance } from '../../lib/Axios'
import { toast } from 'react-hot-toast'

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

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-start gap-3">
        <button
          onClick={handlePersonalityReview}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-semibold ${loading ? 'opacity-60 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
        >
          {loading ? 'Running…' : 'Personality review'}
        </button>
        <button
          onClick={async () => {
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
          }}
          disabled={fiveLoading}
          className={`px-4 py-2 rounded-lg font-semibold ${fiveLoading ? 'opacity-60 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'} text-white`}
        >
          {fiveLoading ? 'Analysing…' : 'Analyse five'}
        </button>
        <button
          onClick={async () => {
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
          }}
          disabled={pathwayLoading}
          className={`px-4 py-2 rounded-lg font-semibold ${pathwayLoading ? 'opacity-60 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500'} text-white`}
        >
          {pathwayLoading ? 'Building…' : 'Skill Pathways'}
        </button>
        <button
          onClick={async () => {
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
          }}
          disabled={portfolioLoading}
          className={`px-4 py-2 rounded-lg font-semibold ${portfolioLoading ? 'opacity-60 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-500'} text-white`}
        >
          {portfolioLoading ? 'Building…' : 'Portfolio builder'}
        </button>
      </div>

      <div className="flex items-start justify-start gap-3">
        <button
          onClick={async () => {
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
          }}
          disabled={courseLoading}
          className={`px-4 py-2 rounded-lg font-semibold ${courseLoading ? 'opacity-60 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500'} text-white`}
        >
          {courseLoading ? 'Recommending…' : 'Course recommendation'}
        </button>
        <button
          onClick={async () => {
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
          }}
          disabled={careerRoleLoading}
          className={`px-4 py-2 rounded-lg font-semibold ${careerRoleLoading ? 'opacity-60 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'} text-white`}
        >
          {careerRoleLoading ? 'Analyzing…' : 'Career Role'}
        </button>
      </div>

      {courses && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white space-y-4">
          <div>
            <h3 className="text-xl font-bold">Recommended Courses</h3>
            <p className="text-neutral-300 text-sm">Tailored from your profile text report.</p>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {courses?.courses?.map?.((c, i) => (
              <li key={i} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{c.title}</span>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded">{c.level}</span>
                </div>
                {c.provider && <div className="text-neutral-300 text-sm mt-1">Provider: {c.provider}</div>}
                {Array.isArray(c.topics) && c.topics.length > 0 && (
                  <div className="text-neutral-300 text-xs mt-1">Topics: {c.topics.join(', ')}</div>
                )}
                {c.why && <div className="text-neutral-200 text-sm mt-2">{c.why}</div>}
              </li>
            ))}
          </ul>
          {courses?.summary && (
            <div className="bg-white/5 rounded-lg p-3">
              <h4 className="font-semibold mb-2">Summary</h4>
              <div className="text-neutral-200 text-sm whitespace-pre-wrap">{courses.summary}</div>
            </div>
          )}
        </div>
      )}

      {pathway && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white space-y-4">
          <div>
            <h3 className="text-xl font-bold">Skill Pathway</h3>
            <p className="text-neutral-300 text-sm">Generated from your profile and target career.</p>
          </div>
          {pathway?.skill_pathway && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <h4 className="font-semibold mb-2">Technical Pathway</h4>
                <ul className="space-y-2 text-sm">
                  {pathway.skill_pathway?.technical_pathway?.map?.((s, idx) => (
                    <li key={idx} className="p-2 rounded bg-white/5">
                      <div className="font-medium">{s.stage}</div>
                      <div className="text-neutral-300">{(s.skills||[]).join(', ')}</div>
                      {s.reasoning && <div className="text-neutral-400 text-xs mt-1">{s.reasoning}</div>}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <h4 className="font-semibold mb-2">Soft Skill Pathway</h4>
                <ul className="space-y-2 text-sm">
                  {pathway.skill_pathway?.soft_skill_pathway?.map?.((s, idx) => (
                    <li key={idx} className="p-2 rounded bg-white/5">
                      <div className="font-medium">{s.stage}</div>
                      <div className="text-neutral-300">{(s.skills||[]).join(', ')}</div>
                      {s.reasoning && <div className="text-neutral-400 text-xs mt-1">{s.reasoning}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {pathway?.final_explanation && (
            <div className="bg-white/5 rounded-lg p-3">
              <h4 className="font-semibold mb-2">Explanation</h4>
              <div className="text-neutral-200 text-sm whitespace-pre-wrap">{pathway.final_explanation}</div>
            </div>
          )}
        </div>
      )}

      {portfolio && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white space-y-4">
          <div>
            <h3 className="text-xl font-bold">Portfolio Guide</h3>
            <p className="text-neutral-300 text-sm">Use this as your roadmap to craft a standout portfolio.</p>
          </div>
          <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm">
            {portfolio?.final_guide || JSON.stringify(portfolio, null, 2)}
          </div>
        </div>
      )}

      {careerRoles && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white space-y-4">
          <div>
            <h3 className="text-xl font-bold">Suggested Career Roles</h3>
            <p className="text-neutral-300 text-sm">Based on your profile and industry demand analysis.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerRoles.map((role, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-blue-300">{role.role}</h4>
                  <span className={`px-2 py-1 text-xs rounded ${
                    role.market_trend === 'High' ? 'bg-green-500/20 text-green-300' :
                    role.market_trend === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {role.market_trend || 'N/A'}
                  </span>
                </div>
                {role.reason && (
                  <p className="text-neutral-300 text-sm">{role.reason}</p>
                )}
                {role.salary_range && (
                  <p className="text-neutral-200 text-sm">
                    <span className="font-semibold">Salary Range:</span> {role.salary_range}
                  </p>
                )}
                {Array.isArray(role.skills_to_learn) && role.skills_to_learn.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2 text-neutral-200">Skills to Learn:</p>
                    <div className="flex flex-wrap gap-2">
                      {role.skills_to_learn.map((skill, i) => (
                        <span key={i} className="px-2 py-1 text-xs rounded-full border border-white/10 bg-white/5 text-neutral-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Explore
