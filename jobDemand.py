"""
Job Market Analysis Agent (Database-Ready Version)
Author: Raaj Hackathon Build
"""

import os
import json
from typing import TypedDict, Optional, List, Dict
import sys
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
# Replace langchain_community Serper wrapper with direct HTTP call to avoid missing module errors
try:
    import requests  # Preferred if available
except Exception:
    requests = None
    import urllib.request
    import urllib.error
from langgraph.graph import StateGraph, START, END

# ============================================================
# 1. STATE DEFINITIONS (Structured for DB-friendly output)
# ============================================================

class JobDemandData(TypedDict, total=False):
    total_job_openings_estimated: int
    top_5_in_demand_job_titles: List[str]
    job_growth_trend: str
    industries_with_highest_demand: List[str]
    remote_vs_on_site_distribution: str

class SalaryInsights(TypedDict, total=False):
    average_salary_ranges: List[Dict]
    highest_paying_roles: List[Dict]
    salary_variation_by_experience_level: List[Dict]
    salary_growth_rate_yoy_percent: Optional[float]
    cost_of_living_adjustment_factors: Optional[str]

class SkillsInsights(TypedDict, total=False):
    top_10_in_demand_technical_skills: List[str]
    top_10_in_demand_soft_skills: List[str]
    emerging_technologies: List[str]
    skills_with_highest_salary_premium: List[str]
    year_over_year_skill_growth_trends: List[str]

class JobMarketSummary(TypedDict, total=False):
    overview: str
    key_opportunities: str
    salary_competitiveness: str
    recommended_skills: str
    market_outlook: str
    recommendations: str

class JobAnalysisState(TypedDict):
    location: str
    job_demand_data: JobDemandData
    salary_data: SalaryInsights
    skills_data: SkillsInsights
    summary: JobMarketSummary

# ============================================================
# 2. INITIALIZE MODELS AND SEARCH
# ============================================================

def initialize_gemini_llm(temp=0.3):
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=temp,
        api_key=os.getenv("GOOGLE_API_KEY")
    )

def serper_search(query: str) -> str:
    key = os.getenv("SERPER_API_KEY")
    if not key:
        return f"Search skipped (no SERPER_API_KEY). Query: {query}"
    url = "https://google.serper.dev/search"
    headers = {"X-API-KEY": key, "Content-Type": "application/json"}
    payload = {"q": query}
    try:
        if requests:
            resp = requests.post(url, headers=headers, json=payload, timeout=20)
            resp.raise_for_status()
            return resp.text
        else:
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(url, data=data, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=20) as r:
                return r.read().decode("utf-8")
    except Exception as e:
        return f"Search error: {e}"

# ============================================================
# 3. SEARCH HELPERS
# ============================================================
def search_job_postings(location: str) -> str:
    query = f"current job demand {location} 2025 software engineer data scientist"
    return serper_search(query)

def search_salary_data(location: str) -> str:
    query = f"average salary 2025 {location} tech roles compensation"
    return serper_search(query)

def search_skills_data(location: str) -> str:
    query = f"emerging tech skills {location} 2025 AI ML cloud"
    return serper_search(query)

# ============================================================
# 4. LLM ANALYSIS HELPERS
# ============================================================

def parse_json_safe(text: str):
    text = text.strip()
    if text.startswith("json"):
        text = text[7:]
    if text.endswith(""):
        text = text[:-3]
    try:
        return json.loads(text.strip())
    except Exception:
        return {"raw_text": text}

def analyze_job_demand(location: str, data: str) -> JobDemandData:
    llm = initialize_gemini_llm()
    prompt = ChatPromptTemplate.from_template("""
    You are a data-driven analyst. Analyze job demand data for {location}.
    Data:
    {data}

    Return valid JSON with:
    {{
        "total_job_openings_estimated": <int>,
        "top_5_in_demand_job_titles": [<list of 5>],
        "job_growth_trend": <string>,
        "industries_with_highest_demand": [<list>],
        "remote_vs_on_site_distribution": <string>
    }}
    """)
    res = llm.invoke(prompt.invoke({"location": location, "data": data}))
    return parse_json_safe(res.content)

def analyze_salary_trends(location: str, data: str) -> SalaryInsights:
    llm = initialize_gemini_llm()
    prompt = ChatPromptTemplate.from_template("""
    You are a compensation analyst. Extract structured salary insights for {location}.
    Data:
    {data}

    Return valid JSON with:
    {{
        "average_salary_ranges": [{{role, currency, min_annual, max_annual, average_annual}}],
        "highest_paying_roles": [{{role, max_annual_inr}}],
        "salary_variation_by_experience_level": [{{role, experience_level, range}}],
        "salary_growth_rate_yoy_percent": <float or null>,
        "cost_of_living_adjustment_factors": <string or null>
    }}
    """)
    res = llm.invoke(prompt.invoke({"location": location, "data": data}))
    return parse_json_safe(res.content)

def analyze_emerging_skills(location: str, data: str) -> SkillsInsights:
    llm = initialize_gemini_llm()
    prompt = ChatPromptTemplate.from_template("""
    You are a job skills analyst. Extract skill trends for {location}.
    Data:
    {data}

    Return valid JSON with:
    {{
        "top_10_in_demand_technical_skills": [<list>],
        "top_10_in_demand_soft_skills": [<list>],
        "emerging_technologies": [<list>],
        "skills_with_highest_salary_premium": [<list>],
        "year_over_year_skill_growth_trends": [<list>]
    }}
    """)
    res = llm.invoke(prompt.invoke({"location": location, "data": data}))
    return parse_json_safe(res.content)

def summarize_market(location: str, demand: dict, salary: dict, skills: dict) -> JobMarketSummary:
    llm = initialize_gemini_llm()
    prompt = ChatPromptTemplate.from_template("""
    Synthesize a strategic summary for {location} based on:

    JOB DEMAND: {demand}
    SALARY: {salary}
    SKILLS: {skills}

    Return valid JSON with:
    {{
        "overview": <text>,
        "key_opportunities": <text>,
        "salary_competitiveness": <text>,
        "recommended_skills": <text>,
        "market_outlook": <text>,
        "recommendations": <text>
    }}
    """)
    res = llm.invoke(prompt.invoke({
        "location": location,
        "demand": json.dumps(demand),
        "salary": json.dumps(salary),
        "skills": json.dumps(skills)
    }))
    return parse_json_safe(res.content)

# ============================================================
# 5. NODES
# ============================================================

def node_input(state: JobAnalysisState): 
    return {"location": state["location"]}

def node_demand(state: JobAnalysisState):
    loc = state["location"]
    results = search_job_postings(loc)
    analysis = analyze_job_demand(loc, results)
    return {"job_demand_data": analysis}

def node_salary(state: JobAnalysisState):
    loc = state["location"]
    results = search_salary_data(loc)
    analysis = analyze_salary_trends(loc, results)
    return {"salary_data": analysis}

def node_skills(state: JobAnalysisState):
    loc = state["location"]
    results = search_skills_data(loc)
    analysis = analyze_emerging_skills(loc, results)
    return {"skills_data": analysis}

def node_summary(state: JobAnalysisState):
    summary = summarize_market(
        state["location"],
        state["job_demand_data"],
        state["salary_data"],
        state["skills_data"]
    )
    return {"summary": summary}

# ============================================================
# 6. GRAPH WORKFLOW
# ============================================================

def build_workflow():
    graph = StateGraph(JobAnalysisState)
    graph.add_node("input", node_input)
    graph.add_node("demand", node_demand)
    graph.add_node("salary", node_salary)
    graph.add_node("skills", node_skills)
    graph.add_node("summary", node_summary)

    graph.add_edge(START, "input")
    graph.add_edge("input", "demand")
    graph.add_edge("input", "salary")
    graph.add_edge("input", "skills")
    graph.add_edge("demand", "summary")
    graph.add_edge("salary", "summary")
    graph.add_edge("skills", "summary")
    graph.add_edge("summary", END)
    return graph.compile()

# ============================================================
# 7. EXECUTION
# ============================================================

def run_job_analysis(location: str) -> JobAnalysisState:
    graph = build_workflow()
    init_state = {
        "location": location,
        "job_demand_data": {},
        "salary_data": {},
        "skills_data": {},
        "summary": {}
    }
    result = graph.invoke(init_state)

    # Route human-readable logs to stderr to keep stdout machine-readable
    print("\n================== DB-Friendly Output ==================", file=sys.stderr)
    print("\n📈 JOB DEMAND DATA:", file=sys.stderr)
    print(json.dumps(result["job_demand_data"], indent=2), file=sys.stderr)
    
    print("\n💰 SALARY DATA:", file=sys.stderr)
    print(json.dumps(result["salary_data"], indent=2), file=sys.stderr)
    
    print("\n🎯 SKILL TRENDS:", file=sys.stderr)
    print(json.dumps(result["skills_data"], indent=2), file=sys.stderr)
    
    print("\n📋 STRATEGIC SUMMARY:", file=sys.stderr)
    print(json.dumps(result["summary"], indent=2), file=sys.stderr)
    print("========================================================\n", file=sys.stderr)

    return result

# ============================================================
# 8. MAIN
# ============================================================

if __name__ == "__main__":
    load_dotenv()
    # CLI usage: python jobDemand.py [location]
    # If a location is provided, output JSON to stdout; logs go to stderr
    cli_location = "Bangalore, India"
    if len(sys.argv) >= 2:
        cli_location = " ".join(sys.argv[1:]).strip()
    result = run_job_analysis(cli_location)
    # Print pure JSON to stdout so callers can parse cleanly
    print(json.dumps(result))