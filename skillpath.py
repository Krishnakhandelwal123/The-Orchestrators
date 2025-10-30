# skill_pathway_agent.py

import os
import sys
import json
from typing import TypedDict, Dict, List, Optional
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph, END

# ======== LOAD ENV ========
load_dotenv()

# ======== MODEL ========
model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)
model_final = ChatGoogleGenerativeAI(model="gemini-2.5-pro", temperature=0.3)
# ======== STATE SCHEMA ========
class SkillPathwayState(TypedDict, total=False):
    user_document: str
    target_career: str
    user_profile: Dict[str, Optional[str]]
    career_requirements: Dict[str, List[str]]
    skill_gaps: Dict[str, List[str]]
    skill_pathway: Dict[str, List[Dict[str, str]]]
    final_explanation: str


# ======== HELPER FUNCTION ========
def load_user_document(file_path="user.txt") -> str:
    """Load the user profile document from file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{file_path} not found. Please add your profile text file.")
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read().strip()


def parse_json_response(response_text: str):
    """Safely parse JSON returned by the model (in case of invalid formatting)."""
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        import re
        json_str = re.search(r"\{.*\}", response_text, re.DOTALL)
        if json_str:
            try:
                return json.loads(json_str.group())
            except json.JSONDecodeError:
                pass
        return {"error": "Invalid JSON returned by model", "raw": response_text}


# ======== NODE 1: USER PROFILE EXTRACTOR ========
user_profile_prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You are an intelligent profile analyzer. Extract structured information from a user's background document."),
    ("human",
     """User document:
{user_document}

Extract this information in JSON format:
{{
  "technical_skills": [],
  "soft_skills": [],
  "education_level": "",
  "experience_level": "",
  "interests": []
}}""")
])

def user_profile_node(state: SkillPathwayState):
    prompt = user_profile_prompt.format_messages(user_document=state["user_document"])
    response = model.invoke(prompt)
    return {"user_profile": parse_json_response(response.content)}


# ======== NODE 2: CAREER ANALYZER ========
career_analyzer_prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You are a career intelligence assistant. Analyze a given career and list essential technical and soft skills required in 2025."),
    ("human",
     """Target Career: {target_career}

Return in JSON:
{{
  "career": "{target_career}",
  "required_technical_skills": [],
  "required_soft_skills": []
}}""")
])

def career_analyzer_node(state: SkillPathwayState):
    prompt = career_analyzer_prompt.format_messages(target_career=state["target_career"])
    response = model.invoke(prompt)
    return {"career_requirements": parse_json_response(response.content)}


# ======== NODE 3: GAP ANALYZER ========
gap_analyzer_prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You are a skill gap analyst. Compare a user's current skills with the required skills for the target career."),
    ("human",
     """User Profile:
{user_profile}

Career Requirements:
{career_requirements}

Return JSON:
{{
  "missing_technical_skills": [],
  "missing_soft_skills": []
}}""")
])

def gap_analyzer_node(state: SkillPathwayState):
    prompt = gap_analyzer_prompt.format_messages(
        user_profile=json.dumps(state["user_profile"], indent=2),
        career_requirements=json.dumps(state["career_requirements"], indent=2)
    )
    response = model.invoke(prompt)
    return {"skill_gaps": parse_json_response(response.content)}


# ======== NODE 4: PATHWAY BUILDER ========
pathway_builder_prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You are a professional skill development advisor. Create a progressive skill pathway to reach the target career."),
    ("human",
     """Target Career: {target_career}

Missing Skills:
{skill_gaps}

Output JSON:
{{
  "technical_pathway": [
    {{"stage": "Beginner", "skills": [], "reasoning": ""}},
    {{"stage": "Intermediate", "skills": [], "reasoning": ""}},
    {{"stage": "Advanced", "skills": [], "reasoning": ""}}
  ],
  "soft_skill_pathway": [
    {{"stage": "Foundational", "skills": [], "reasoning": ""}},
    {{"stage": "Growth", "skills": [], "reasoning": ""}}
  ]
}}""")
])

def pathway_builder_node(state: SkillPathwayState):
    prompt = pathway_builder_prompt.format_messages(
        target_career=state["target_career"],
        skill_gaps=json.dumps(state["skill_gaps"], indent=2)
    )
    response = model.invoke(prompt)
    return {"skill_pathway": parse_json_response(response.content)}


# ======== NODE 5: EXPLANATION NODE ========
explanation_prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You are a career mentor AI. Write a clear and motivating explanation of the recommended skill pathway."),
    ("human",
     """User Profile:
{user_profile}

Skill Pathway:
{skill_pathway}

Generate a detailed explanation in human-readable paragraphs.""")
])

def explanation_node(state: SkillPathwayState):
    prompt = explanation_prompt.format_messages(
        user_profile=json.dumps(state["user_profile"], indent=2),
        skill_pathway=json.dumps(state["skill_pathway"], indent=2)
    )
    response = model_final.invoke(prompt)
    return {"final_explanation": response.content}


# ======== BUILD LANGGRAPH ========
graph = StateGraph(SkillPathwayState)
graph.add_node("user_profile_extractor", user_profile_node)
graph.add_node("career_analyzer", career_analyzer_node)
graph.add_node("gap_analyzer", gap_analyzer_node)
graph.add_node("pathway_builder", pathway_builder_node)
graph.add_node("explanation_node", explanation_node)

graph.add_edge("user_profile_extractor", "career_analyzer")
graph.add_edge("career_analyzer", "gap_analyzer")
graph.add_edge("gap_analyzer", "pathway_builder")
graph.add_edge("pathway_builder", "explanation_node")

graph.set_entry_point("user_profile_extractor")
graph.set_finish_point("explanation_node")

skill_pathway_agent = graph.compile()


def main():
    # CLI usage:
    #   python skillpath.py <target_career> <user_doc_path>
    # Outputs JSON with user_profile, career_requirements, skill_gaps, skill_pathway, final_explanation
    if len(sys.argv) >= 3:
        target = sys.argv[1]
        user_doc_path = sys.argv[2]
        try:
            user_doc = load_user_document(user_doc_path)
        except Exception as e:
            print(json.dumps({"error": f"Failed to load user document: {e}"}))
            sys.exit(0)
        inputs = {"user_document": user_doc, "target_career": target}
        try:
            result = skill_pathway_agent.invoke(inputs)
            print(json.dumps({
                "user_profile": result.get("user_profile"),
                "career_requirements": result.get("career_requirements"),
                "skill_gaps": result.get("skill_gaps"),
                "skill_pathway": result.get("skill_pathway"),
                "final_explanation": result.get("final_explanation"),
            }, ensure_ascii=False))
        except Exception as e:
            print(json.dumps({"error": f"Failed to generate skill pathway: {e}"}, ensure_ascii=False))
        sys.exit(0)

    # Fallback demo run for manual execution
    try:
        user_doc = load_user_document("user.txt")
        target = "Machine Learning Engineer"
        result = skill_pathway_agent.invoke({"user_document": user_doc, "target_career": target})
        print(json.dumps(result, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()