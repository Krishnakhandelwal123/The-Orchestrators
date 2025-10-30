import React, { useEffect, useState } from 'react'

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      {children}
    </div>
  </div>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Industry Demand</h2>
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none text-white"
          >
            {COUNTRIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-neutral-400 text-center py-8">Loading industry demand data...</div>
      )}

      {!data && !loading && !error && (
        <div className="text-neutral-400 text-center py-8">No data yet for this location. Click Analyze to fetch data.</div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2 flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20">
            <div className="text-neutral-300 text-sm">
              <span className="font-semibold text-white">Location:</span> {data.location || location}
            </div>
            <div className="text-neutral-400 text-xs">
              Last updated: {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '—'}
            </div>
          </div>
          <Section title="Job Demand">
            <div className="space-y-3">
              {renderField('Total Openings (Est.)', jd.total_job_openings_estimated)}
              {Array.isArray(jd.top_5_in_demand_job_titles) && jd.top_5_in_demand_job_titles.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-neutral-200">Top Job Titles:</p>
                  {renderChips(jd.top_5_in_demand_job_titles)}
                </div>
              )}
              {renderField('Growth Trend', jd.job_growth_trend)}
              {Array.isArray(jd.industries_with_highest_demand) && jd.industries_with_highest_demand.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-neutral-200">Industries:</p>
                  {renderChips(jd.industries_with_highest_demand)}
                </div>
              )}
              {renderField('Remote vs On-site', jd.remote_vs_on_site_distribution)}
              {!hasContent(jd) && (
                <p className="text-neutral-500 text-sm">No job demand data available yet.</p>
              )}
            </div>
          </Section>

          <Section title="Salary Insights">
            <div className="space-y-3">
              {Array.isArray(sal.average_salary_ranges) && sal.average_salary_ranges.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-neutral-200">Average Salary Ranges:</p>
                  <div className="space-y-1 text-neutral-300 text-sm">
                    {sal.average_salary_ranges.map((r, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span>{r.role || 'Role'}</span>
                        <span>{r.min_annual ? `${r.min_annual} - ${r.max_annual} ${r.currency || ''}` : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(sal.highest_paying_roles) && sal.highest_paying_roles.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-neutral-200">Highest Paying Roles:</p>
                  {renderChips(sal.highest_paying_roles.map(x => x.role || JSON.stringify(x)))}
                </div>
              )}
              {renderField('Salary by Experience', sal.salary_variation_by_experience_level, true)}
              {renderField('Salary Growth (YoY %)', sal.salary_growth_rate_yoy_percent)}
              {renderField('Cost of Living Factors', sal.cost_of_living_adjustment_factors)}
              {!hasContent(sal) && (
                <p className="text-neutral-500 text-sm">No salary data available yet.</p>
              )}
            </div>
          </Section>

          <Section title="Skills Trends">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2 text-neutral-200">Technical Skills:</p>
                {Array.isArray(sk.top_10_in_demand_technical_skills) && sk.top_10_in_demand_technical_skills.length > 0 ? (
                  renderChips(sk.top_10_in_demand_technical_skills)
                ) : (
                  <p className="text-neutral-500 text-sm">No technical skills data available.</p>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold mb-2 text-neutral-200">Soft Skills:</p>
                {Array.isArray(sk.top_10_in_demand_soft_skills) && sk.top_10_in_demand_soft_skills.length > 0 ? (
                  renderChips(sk.top_10_in_demand_soft_skills)
                ) : (
                  <p className="text-neutral-500 text-sm">No soft skills data available.</p>
                )}
              </div>
              {Array.isArray(sk.emerging_technologies) && sk.emerging_technologies.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-neutral-200">Emerging Technologies:</p>
                  {renderChips(sk.emerging_technologies)}
                </div>
              )}
              {Array.isArray(sk.skills_with_highest_salary_premium) && sk.skills_with_highest_salary_premium.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-neutral-200">High Salary Premium Skills:</p>
                  {renderChips(sk.skills_with_highest_salary_premium)}
                </div>
              )}
              {Array.isArray(sk.year_over_year_skill_growth_trends) && sk.year_over_year_skill_growth_trends.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-1 text-neutral-200">YoY Growth Trends:</p>
                  {renderChips(sk.year_over_year_skill_growth_trends)}
                </div>
              )}
            </div>
          </Section>

          <Section title="Market Summary">
            <div className="space-y-3">
              {renderField('Overview', sum.overview)}
              {renderField('Key Opportunities', sum.key_opportunities)}
              {renderField('Salary Competitiveness', sum.salary_competitiveness)}
              {renderField('Recommended Skills', sum.recommended_skills)}
              {renderField('Market Outlook', sum.market_outlook)}
              {renderField('Recommendations', sum.recommendations)}
              {!hasContent(sum) && (
                <p className="text-neutral-500 text-sm">No summary data available yet.</p>
              )}
            </div>
          </Section>

          {/* Debug section to see what data we actually have */}
          <div className="lg:col-span-2">
            <details className="cursor-pointer">
              <summary className="text-sm text-neutral-400 mb-2">🔍 Debug: View Raw Data</summary>
              <pre className="text-xs text-neutral-400 overflow-auto max-h-64 p-4 bg-black/40 rounded border border-white/10">
                {JSON.stringify({ jd, sal, sk, sum, rawData: data }, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notification
