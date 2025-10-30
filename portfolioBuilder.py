import os
import sys
import json

# Ensure UTF-8 stdout/stderr to avoid Windows 'charmap' encode errors with emojis
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    # Older Python versions or environments may not support reconfigure
    pass
from dotenv import load_dotenv
from typing import TypedDict, Optional, List
from pydantic import BaseModel, Field

# Updated import to use Google's model
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from langchain_core.output_parsers import JsonOutputParser, PydanticOutputParser

from langgraph.graph import StateGraph, END

# --- 1. Define API Key and LLM ---
# (Will be loaded from .env)
llm = None

# --- 2. Define Pydantic Models for Structured Output ---
# These models ensure our data is structured between steps.

class ProfileAnalysis(BaseModel):
    """Structured analysis of the user's profile."""
    name: str = Field(description="User's name, if found")
    current_role: str = Field(description="User's current or most recent job title")
    key_skills: List[str] = Field(description="A list of core technical skills (e.g., 'Python', 'React', 'SQL')")
    experience_summary: str = Field(description="A 2-3 sentence summary of their experience")
    inferred_goals: List[str] = Field(description="Inferred career goals or areas they want to grow into (e.g., 'Move into Data Science', 'Become a Senior Full-Stack Developer')")

class ProjectStep(BaseModel):
    """A single project step in the roadmap."""
    step_title: str = Field(description="Name of this roadmap step (e.g., 'Step 1: The Foundation')")
    project_title: str = Field(description="A catchy title for the project")
    project_description: str = Field(description="A 1-2 paragraph description of what the project is.")
    portfolio_value: str = Field(description="Why this project is valuable for their portfolio (e.g., 'Demonstrates mastery of full-stack development and API integration')")
    key_skills_to_learn: List[str] = Field(description="A list of new skills they will learn or solidify (e.g., 'GraphQL', 'Terraform', 'CI/CD Pipelines')")

class PortfolioRoadmap(BaseModel):
    """The complete, 3-step portfolio roadmap."""
    intro_summary: str = Field(description="A brief, encouraging intro to the roadmap, tied to their goals.")
    foundation_project: ProjectStep = Field(description="A foundational project that leverages their current skills but adds a small stretch.")
    growth_project: ProjectStep = Field(description="A more complex project that bridges their current skills to their desired goals.")
    capstone_project: ProjectStep = Field(description="A large-scale, impressive project that would be a centerpiece of their portfolio.")

# --- 3. Define the Graph's State ---

class GraphState(TypedDict):
    """
    Defines the state of our graph.
    This state is passed between all nodes.
    """
    profile_content: str  # The raw text from the .txt file
    analysis: Optional[ProfileAnalysis] = None  # The structured analysis
    project_ideas: Optional[List[str]] = None # A simple list of brainstormed ideas
    roadmap: Optional[PortfolioRoadmap] = None # The final, structured 3-step roadmap
    final_guide: Optional[str] = None # The final formatted markdown string

# --- 4. Define the Graph Nodes ---
# Each node is a function that performs one step of the process.

def analyze_profile(state: GraphState) -> GraphState:
    """
    Node 1: Analyzes the raw profile text.
    """
    print("--- (1/4) ANALYZING PROFILE ---", file=sys.stderr)
    profile_content = state['profile_content']
    
    parser = PydanticOutputParser(pydantic_object=ProfileAnalysis)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a senior tech recruiter and career coach. Your task is to analyze the user's profile and extract key information. Pay close attention to their skills, experience level, and any hints about their career aspirations. Provide your analysis in the requested JSON format."),
        ("human", "Here is the user's profile: \n\n{profile}\n\n{format_instructions}")
    ])
    
    chain = prompt | llm | parser
    
    try:
        analysis = chain.invoke({
            "profile": profile_content,
            "format_instructions": parser.get_format_instructions()
        })
        return {"analysis": analysis}
    except Exception as e:
        print(f"Error during profile analysis: {e}", file=sys.stderr)
        # In a real app, you'd add more robust error handling
        return {"analysis": None}

def brainstorm_projects(state: GraphState) -> GraphState:
    """
    Node 2: Brainstorms project ideas based on the analysis.
    """
    print("--- (2/4) BRAINSTORMING PROJECTS ---", file=sys.stderr)
    analysis = state['analysis']
    if not analysis:
        return {"project_ideas": []}

    parser = JsonOutputParser()
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a project incubator and a principal engineer. Based on the user's profile analysis, brainstorm 5-7 creative, high-impact project ideas that would effectively fill their portfolio gaps and help them reach their goals. Just provide a list of project titles and a 1-sentence description for each. Output a JSON list of strings."),
        ("human", "Here is the profile analysis:\n\n{analysis}\n\nBrainstorm 5-7 project ideas. Format your response as a JSON list of strings, where each string is a project idea (e.g., 'AI-Powered Recipe App: A web app that suggests recipes based on available ingredients').")
    ])
    
    chain = prompt | llm | parser
    
    ideas = chain.invoke({"analysis": analysis.model_dump_json()})
    return {"project_ideas": ideas}


def generate_roadmap(state: GraphState) -> GraphState:
    """
    Node 3: Builds the detailed 3-step roadmap.
    """
    print("--- (3/4) GENERATING ROADMAP ---", file=sys.stderr)
    analysis = state['analysis']
    ideas = state['project_ideas']
    
    if not analysis:
        return {"roadmap": None}

    parser = PydanticOutputParser(pydantic_object=PortfolioRoadmap)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a senior engineering manager and career mentor. Your task is to create a detailed, 3-step project roadmap for a developer. You will be given their profile analysis and a list of brainstormed project ideas.\n\n"
         "Select 3 projects (you can refine the ideas from the list or create new ones inspired by it) and structure them as:\n"
         "1.  *Foundation Project:* Leverages their current skills but adds 1-2 new concepts.\n"
         "2.  *Growth Project:* A more complex project that directly bridges their current skills to their desired goals.\n"
         "3.  *Capstone Project:* A large-scale, impressive project that synthesizes all their skills and would be a centerpiece of their portfolio.\n\n"
         "For each project, provide a title, description, the specific value it adds to their portfolio, and the key new skills they will learn. Provide your response in the requested JSON format."),
        ("human", "Profile Analysis:\n{analysis}\n\nBrainstormed Ideas:\n{ideas}\n\n{format_instructions}")
    ])
    
    chain = prompt | llm | parser
    
    try:
        roadmap = chain.invoke({
            "analysis": analysis.model_dump_json(),
            "ideas": "\n".join(ideas),
            "format_instructions": parser.get_format_instructions()
        })
        return {"roadmap": roadmap}
    except Exception as e:
        print(f"Error during roadmap generation: {e}", file=sys.stderr)
        return {"roadmap": None}

def compile_guide(state: GraphState) -> GraphState:
    """
    Node 4: Compiles all data into a final, user-friendly Markdown guide.
    This node doesn't need an LLM, just string formatting.
    """
    print("--- (4/4) COMPILING YOUR GUIDE ---", file=sys.stderr)
    analysis = state['analysis']
    roadmap = state['roadmap']

    if not analysis or not roadmap:
        return {"final_guide": "Sorry, I was unable to generate a roadmap based on your profile. Please try again with a more detailed profile."}

    # Helper function to format a single project step
    def format_project(project: ProjectStep) -> str:
        skills = "\n".join(f"- {skill}" for skill in project.key_skills_to_learn)
        return f"""
### {project.step_title}: {project.project_title}

*Description:*
{project.project_description}

*Portfolio Value:*
{project.portfolio_value}

*Key Skills to Learn/Demonstrate:*
{skills}
"""

    # Build the final Markdown string
    guide = f"""
# Your Personalized Portfolio Roadmap

Hello {analysis.name}! Based on your profile as a *{analysis.current_role}* with skills in *{', '.join(analysis.key_skills)}*, I've created a 3-step project roadmap to help you achieve your goals of **{', '.join(analysis.inferred_goals)}**.

{roadmap.intro_summary}

---

## 🚀 Your 3-Step Project Plan

{format_project(roadmap.foundation_project)}

---

{format_project(roadmap.growth_project)}

---

{format_project(roadmap.capstone_project)}

---

## Next Steps

Good luck! This roadmap is a guide. Feel free to adapt the projects to your interests. The most important thing is to start building and learning.
"""
    
    return {"final_guide": guide}


# --- 5. Build and Compile the Graph ---

def build_graph():
    """Builds the LangGraph workflow."""
    
    workflow = StateGraph(GraphState)

    # Add the nodes
    workflow.add_node("analyze_profile", analyze_profile)
    workflow.add_node("brainstorm_projects", brainstorm_projects)
    workflow.add_node("generate_roadmap", generate_roadmap)
    workflow.add_node("compile_guide", compile_guide)

    # Define the edges
    # This is a simple, sequential graph
    workflow.set_entry_point("analyze_profile")
    workflow.add_edge("analyze_profile", "brainstorm_projects")
    workflow.add_edge("brainstorm_projects", "generate_roadmap")
    workflow.add_edge("generate_roadmap", "compile_guide")
    workflow.add_edge("compile_guide", END)

    # Compile the graph
    app = workflow.compile()
    
    return app

# --- 6. Main execution to run the graph ---

def run_app_from_text(profile_text: str):
    """Run the workflow given raw profile text and return an organized result dict."""
    global llm
    load_dotenv()
    google_api_key = os.getenv("GOOGLE_API_KEY")
    if not google_api_key:
        raise RuntimeError("GOOGLE_API_KEY not set")
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash",
                                 google_api_key=google_api_key,
                                 temperature=0.7)
    app = build_graph()
    inputs = {"profile_content": profile_text}
    final_state = app.invoke(inputs)

    analysis_obj = final_state.get("analysis")
    roadmap_obj = final_state.get("roadmap")

    result = {
        "analysis": analysis_obj.model_dump() if analysis_obj else None,
        "project_ideas": final_state.get("project_ideas") or [],
        "roadmap": roadmap_obj.model_dump() if roadmap_obj else None,
        "final_guide": final_state.get("final_guide") or "",
    }

    return result


def main():
    """
    Main function to run the application.
    Loads API key from .env and prompts user for file path.
    """
    # Load environment variables from .env file
    load_dotenv()
    
    global llm # Set the global LLM variable
    
    # Check for Google API key
    google_api_key = os.getenv("GOOGLE_API_KEY")
    if not google_api_key:
        print("❌ ERROR: GOOGLE_API_KEY not found in .env file.")
        print("Please create a .env file in the same directory and add: GOOGLE_API_KEY='your_api_key_here'")
        return # Exit the script

    # Initialize the LLM
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", 
                                 google_api_key=google_api_key, 
                                 temperature=0.7)

    print("🚀 Welcome to the Portfolio Roadmap Generator!", file=sys.stderr)
    
    # Get the .txt file path at runtime
    filepath = input("📄 Please enter the full path to your profile .txt file: ")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            profile_text = f.read()
        
        print(f"✅ Successfully loaded profile from {filepath}", file=sys.stderr)
        
        app = build_graph()
        final_state = app.invoke({"profile_content": profile_text})
        analysis_obj = final_state.get("analysis")
        roadmap_obj = final_state.get("roadmap")
        guide = final_state.get("final_guide") or ""

        organized = {
            "analysis": analysis_obj.model_dump() if analysis_obj else None,
            "project_ideas": final_state.get("project_ideas") or [],
            "roadmap": roadmap_obj.model_dump() if roadmap_obj else None,
            "final_guide": guide,
        }

        # Print organized JSON to stdout (machine-readable)
        print(json.dumps(organized, ensure_ascii=False, indent=2))

        # Save Markdown guide
        if guide:
            md_filename = "Your_Portfolio_Roadmap.md"
            with open(md_filename, 'w', encoding='utf-8') as f:
                f.write(guide)
            print(f"\n\nSuccess! Your roadmap has been saved to ✨ {md_filename} ✨", file=sys.stderr)

        # Save JSON as well
        json_filename = "Your_Portfolio_Roadmap.json"
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(organized, f, ensure_ascii=False, indent=2)
        print(f"Structured data saved to 📦 {json_filename}", file=sys.stderr)

    except FileNotFoundError:
        print(f"❌ ERROR: File not found at '{filepath}'. Please check the path and try again.")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")

if __name__ == "__main__":
    # CLI mode: python portfolioBuilder.py <profile_text_path>
    if len(sys.argv) >= 2:
        try:
            with open(sys.argv[1], 'r', encoding='utf-8') as f:
                text = f.read()
            organized = run_app_from_text(text)
            print(json.dumps(organized, ensure_ascii=False, indent=2))
        except Exception as e:
            print(json.dumps({"error": str(e)}))
    else:
        main()