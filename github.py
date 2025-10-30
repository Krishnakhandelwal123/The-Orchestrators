import requests
import os
import sys
import json
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from typing import TypedDict

# 1. Load .env
load_dotenv()

# 2. Scrape profile tool (WITH DOCSTRING!)
@tool
def scrape_profile_text(url: str) -> str:
    """
    Fetches the text content of a GitHub profile page.
    This is a simple scraper and may not get all dynamic content.
    For a full, robust analysis, the GitHub API is recommended.
    """
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    main_content = soup.find('body')
    if main_content:
        text_content = main_content.get_text(separator=' ', strip=True)
        cleaned_text = ' '.join(text_content.split())
        return cleaned_text[:10000]
    else:
        return "Could not find main content."

# 3. State
class GraphState(TypedDict):
    github_url: str
    question: str
    scraped_content: str
    analysis: str

# 4. Fetch content node
def fetch_content_node(state: GraphState):
    url = state['github_url']
    content = scrape_profile_text.invoke({"url": url})
    return {"scraped_content": content}

# 5. Analyze node
def analyze_content_node(state: GraphState):
    content = state['scraped_content']
    question = state['question']
    system_prompt = """
    You are a career-oriented GitHub profile and personal branding analyst.
You are given the scraped text content of a GitHub user's profile.
Your task is to generate a deep, humanized, and descriptive review that not only analyzes the technical aspects of the GitHub profile but also infers personality traits, learning attitude, career direction, and growth trajectory from the available data.

Your analysis should be comprehensive, narrative-driven, and personalized, not robotic or surface-level.
You may infer personality cues or growth mindset indicators from project themes, participation patterns (e.g., hackathons, collaboration), or profile tone.

Output Structure

Start with:

Personal GitHub Profile Review: [Username or Name if available]

Then follow this structure (each section should be detailed and distinct):

1. Holistic Summary

Give a narrative-style overview of the person’s profile.
Summarize who they are, what stage they’re in (student, early-career, professional), and what drives their work.
Focus on tone, motivation, and their personal story as reflected through projects, hackathons, and tech choices.

2. Technical & Creative Skillset

Provide a layered view of their technical foundation:

Core programming languages

Libraries, frameworks, and tools (if mentioned or inferred)

Domains explored (e.g., FinTech, AI, systems, etc.)
Then, interpret their creative or analytical tendencies — for example, whether their work shows curiosity, experimentation, or problem-solving orientation.
You can infer potential skill depth and learning habits from project consistency, naming style, or documentation effort.

3. Project Portfolio Deep Dive

List and interpret the most representative or pinned projects.
For each, give:

Purpose or Theme: What problem it tackles or what domain it belongs to

Tech Insight: Tools, methods, or unique elements inferred

Personal Value: What this project reveals about the creator’s interests, approach, or mindset

(If multiple hackathons are included, highlight collaboration, real-world application, and adaptability.)

4. Personality & Work Ethic Inference

Use indirect cues to describe what kind of learner and creator they appear to be.
For example, do they show curiosity, persistence, structured thinking, teamwork, or experimentation?
Highlight personal values — like analytical precision, innovation, consistency, or interdisciplinary thinking — that emerge through their work.

5. Strengths & Achievements

Summarize standout aspects — like initiative, early specialization, or strong alignment with certain domains.
You can mention hackathon participation, self-driven learning, and specific standout projects as evidence of these strengths.

6. Areas for Growth

Give constructive, personalized suggestions to improve both technically and personally.
Examples: improving documentation, showcasing thought process in READMEs, contributing to open-source communities, or diversifying project scope.

7. Future Trajectory & Career Alignment

Based on their interests, strengths, and current portfolio:

Suggest ideal career paths (e.g., Quant Developer, FinTech Engineer, Data Scientist).

Recommend learning directions or next-level projects to bridge their current stage to those roles.

Add a short paragraph imagining what their portfolio could evolve into if they continue their current path.

8. Final Impression

End with a short, narrative paragraph capturing the essence of this individual — their potential, personality, and how they’re shaping their identity through code.

Tone & Style Guidelines

Write like a mentor who deeply understands both career growth and technical craft.

Be insightful, empathetic, and constructive.

Avoid robotic or repetitive phrasing.

You may use mild storytelling language (e.g., “Harshit’s work reveals a builder who loves connecting data with meaning…”).

Keep it grounded in the evidence provided — no wild assumptions.”
    """
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Profile:\n{content}\n\nSpecific query: {question}")
    ]
    response = llm.invoke(messages)
    return {"analysis": response.content}

# 6. Wire the graph
workflow = StateGraph(GraphState)
workflow.add_node("fetcher", fetch_content_node)
workflow.add_node("analyzer", analyze_content_node)
workflow.set_entry_point("fetcher")
workflow.add_edge("fetcher", "analyzer")
workflow.add_edge("analyzer", END)
app = workflow.compile()

if __name__ == "__main__":
    # Accept URL via CLI arg; fallback to prompt
    github_url_to_analyze = sys.argv[1].strip() if len(sys.argv) > 1 else input("Enter GitHub profile URL: ").strip()
    question = "Give me a detailed, professional analysis of this user."
    inputs = {
        "github_url": github_url_to_analyze,
        "question": question
    }
    final_state = app.invoke(inputs)
    print(json.dumps({"analysis": final_state.get('analysis', '')}))