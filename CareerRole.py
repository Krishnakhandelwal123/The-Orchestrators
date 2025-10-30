import os
import sys
import json
from dotenv import load_dotenv
from typing import TypedDict, Dict, List, Optional

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph, END

# --- Load environment variables ---
load_dotenv()

# --- Initialize model ---
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.4)

# --- Shared graph state ---
class State(TypedDict):
    user_profile: Dict
    job_analysis: Dict
    suggested_roles: Optional[List[Dict]]

# --- Main agent ---
def career_role_suggester(state: State):
    prompt = ChatPromptTemplate.from_template("""
    You are an AI career advisor.

    Here is the latest job market analysis:
    {job_analysis}

    Here is the user's profile information:
    {user_profile}

    Based on both, suggest 5 possible career roles for this user.
    - The roles can be from the job analysis or inferred from related domains.
    - For each role, include:
        1. Role name
        2. Reason for recommendation
        3. Market trend (High / Medium / Low demand)
        4. Estimated salary range
        5. Skills to strengthen or learn next

    Return valid JSON in this format (array of objects):
    [
      {{
        "role": "...",
        "reason": "...",
        "market_trend": "...",
        "salary_range": "...",
        "skills_to_learn": [...]
      }}
    ]
    """)

    response = llm.invoke(prompt.format(
        job_analysis=json.dumps(state["job_analysis"], ensure_ascii=False),
        user_profile=json.dumps(state["user_profile"], ensure_ascii=False)
    ))

    # Parse JSON from response content
    content = response.content.strip()
    # Remove markdown code blocks if present
    if content.startswith("```json"):
        content = content[7:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()
    
    try:
        suggested_roles = json.loads(content)
        state["suggested_roles"] = suggested_roles
    except json.JSONDecodeError:
        # If parsing fails, try to extract JSON from text
        import re
        json_match = re.search(r'\[.*\]', content, re.DOTALL)
        if json_match:
            state["suggested_roles"] = json.loads(json_match.group())
        else:
            state["suggested_roles"] = [{"error": "Failed to parse response", "raw": content}]
    
    return state

# --- Build LangGraph ---
graph = StateGraph(State)
graph.add_node("CareerRoleSuggester", career_role_suggester)
graph.set_entry_point("CareerRoleSuggester")
graph.add_edge("CareerRoleSuggester", END)
career_graph = graph.compile()

# --- Main execution ---
if __name__ == "__main__":
    # CLI usage: python CareerRole.py <job_analysis_json> <user_profile_json>
    # Both arguments are JSON strings
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python CareerRole.py <job_analysis_json> <user_profile_json>"}), file=sys.stderr)
        sys.exit(1)
    
    try:
        job_analysis = json.loads(sys.argv[1])
        user_profile = json.loads(sys.argv[2])
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON input: {e}"}), file=sys.stderr)
        sys.exit(1)
    
    # Run the graph
    state = {"user_profile": user_profile, "job_analysis": job_analysis}
    result = career_graph.invoke(state)
    
    # Output clean JSON to stdout (logs go to stderr)
    output = {"suggested_roles": result.get("suggested_roles", [])}
    print(json.dumps(output, ensure_ascii=False))