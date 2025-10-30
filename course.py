import os
import re
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

load_dotenv()

def smart_skill_query(skill):
    for sep in [':', '.', ',', '(']:
        if sep in skill:
            skill = skill.split(sep)[0]
    for bad in ["Proficiency", "Fundamentals", "Frameworks", "Development", "Deployment",
                "Experience", "Expertise", "Hands-on", "&"]:
        skill = skill.replace(bad, "")
    tok = [t for t in skill.split() if t.strip()]
    query = " ".join(tok[:2]) if len(tok) >= 1 else skill
    return query.strip().lower()

def extract_skill_gaps(filename="skill_pathway.txt"):
    with open(filename, "r", encoding="utf-8") as f:
        text = f.read()
    technical_matches = re.findall(r'"missing_technical_skills": \[(.*?)\]', text, re.DOTALL)
    soft_matches = re.findall(r'"missing_soft_skills": \[(.*?)\]', text, re.DOTALL)
    def parse_skills(skill_str):
        return [s.strip('", \n') for s in re.findall(r'"([^"]+)"', skill_str) if len(s.strip()) > 3]
    skills = []
    if technical_matches:
        skills += parse_skills(technical_matches[0])
    if soft_matches:
        skills += parse_skills(soft_matches[0])
    if not skills:
        skills = ["Python", "Machine Learning", "Communication", "Presentation"]
    return skills[:5]

def search_courses_coursera(query):
    url = f"https://www.coursera.org/search?query={query.replace(' ', '+')}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    results = []
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(resp.text, 'html.parser')
        # Use robust anchor selector; look for course "learn" URLs anywhere in anchors
        for card in soup.select('a'):
            href = card.get('href', '')
            if href and '/learn/' in href:
                title = card.get('aria-label', '') or card.get_text(strip=True)
                if not href.startswith('http'):
                    href = "https://www.coursera.org" + href
                platform = "Coursera"
                desc = ""
                if title and href:
                    results.append({'platform': platform, 'title': title, 'desc': desc, 'url': href})
                if len(results) == 2:
                    break
        return results
    except Exception as e:
        print("Coursera error:", e)
        return []

class GraphState(TypedDict):
    gap_skills: list
    course_details: dict
    course_recommendations: str

def fetch_courses_node(state: GraphState):
    skills = state.get("gap_skills", [])
    all_courses = {}
    for skill in skills:
        search_term = smart_skill_query(skill)
        print(f"Skill: {skill} | Search Term: {search_term}")
        courses = search_courses_coursera(search_term)
        print("Scraped courses for Gemini:", courses)
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
        prompt = (
            f"For '{search_term}', here is a list of scraped online courses "
            "with platform, title, description, link. Pick the 2 most relevant and actionable. "
            "Output in Markdown (platform, title, desc, url as requested)."
            "\n\n"
            f"{courses}"
        )
        messages = [
            SystemMessage(content="Select top 2 and format (platform, title, description, url)."),
            HumanMessage(content=prompt)
        ]
        try:
            response = llm.invoke(messages)
            all_courses[skill] = response.content.strip()
        except Exception:
            all_courses[skill] = "\n".join(
                f"- *{c['platform']}*: {c['title']}  \n  {c['desc']}  \n  {c['url']}" for c in courses[:2]
            )
    return {"course_details": all_courses}

def recommend_courses_node(state: GraphState):
    course_details = state.get("course_details", {})
    return {
        "course_recommendations": "\n\n".join(
            f"### {skill}\n{course_details[skill]}" for skill in course_details
        )
    }

workflow = StateGraph(GraphState)
workflow.add_node("fetch_courses", fetch_courses_node)
workflow.add_node("recommend_courses", recommend_courses_node)
workflow.set_entry_point("fetch_courses")
workflow.add_edge("fetch_courses", "recommend_courses")
workflow.add_edge("recommend_courses", END)
app = workflow.compile()

if _name_ == "_main_":
    print("Extracting skills to improve from skill_pathway.txt...")
    gap_skills = extract_skill_gaps("skill_pathway.txt")
    print("Top 5 Skills identified for improvement:", gap_skills)
    initial_state = {"gap_skills": gap_skills}
    print("\nScraping course offerings and generating recommendations ...\n")
    final_state = app.invoke(initial_state)
    print("\n=== Recommended Courses ===\n")
    print(final_state.get('course_recommendations', 'No recommendations output.'))