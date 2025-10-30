import os
import sys
import json
import base64
from io import BytesIO
from typing import TypedDict
from dotenv import load_dotenv
from PIL import Image

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph

load_dotenv()

# ====== STATE SCHEMA ======
class ResumeState(TypedDict, total=False):
    image_path: str
    extracted_data: str
    analysis: str


# ====== MODEL SETUP ======
gemini_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.2,
    api_key=os.environ.get("GOOGLE_API_KEY")
)


# ====== HELPER FUNCTION ======
def image_to_base64_str(image: Image.Image, fmt: str = "PNG") -> str:
    """Convert a PIL image into a base64-encoded data URI."""
    buffered = BytesIO()
    image.save(buffered, format=fmt)
    b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:image/{fmt.lower()};base64,{b64}"


# ====== EXTRACTION NODE ======
def extract_resume_info(state: ResumeState) -> ResumeState:
    img_path = state.get("image_path")
    if not img_path:
        raise ValueError("image_path must be provided in state")

    image = Image.open(img_path)
    data_uri = image_to_base64_str(image)

    prompt = """
You are a professional resume parsing expert.

From the given resume image, carefully extract *structured information* in pure JSON format with the following schema:

{
  "name": "",
  "email": "",
  "phone": "",
  "linkedin": "",
  "github": "",
  "education": [
    {
      "degree": "",
      "institution": "",
      "year_of_graduation": "",
      "gpa_or_percentage": ""
    }
  ],
  "skills": [],
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies_used": []
    }
  ],
  "experience": [
    {
      "role": "",
      "organization": "",
      "duration": "",
      "achievements": ""
    }
  ],
  "certifications": [],
  "achievements": [],
  "career_objective": ""
}

Return only valid JSON without commentary or extra text.
"""

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": data_uri}
        ]
    )

    response = gemini_model.invoke([message])
    text = response.content
    if isinstance(text, list):
        text = " ".join([part["text"] for part in text if isinstance(part, dict) and "text" in part])

    state["extracted_data"] = text
    return state


# ====== ANALYSIS NODE ======
def analyze_resume(state: ResumeState) -> ResumeState:
    extracted = state.get("extracted_data", "")
    if not extracted:
        raise ValueError("extracted_data must be present in state")

    analysis_prompt = f"""
You are a career and recruitment analyst.

Using this extracted resume data (JSON):
{extracted}

Perform a deep analytical review of the candidate’s profile and generate a *professional evaluation report* covering:

1. *Overall Summary* – A brief overview of the candidate.
2. *Skillset Evaluation* – Identify technical and soft skills, their balance, and relevance to the candidate’s field.
3. *Education Analysis* – Comment on academic strengths and clarity of educational trajectory.
4. *Projects & Experience* – Highlight impactful projects or internships and assess their quality and industry relevance.
5. *Career Objective Assessment* – Evaluate how well it aligns with the skills and experiences shown.
6. *Strengths & Achievements* – Identify top qualities, achievements, and standout aspects.
7. *Improvement Areas* – Suggest missing skills, certifications, or areas to enhance for employability.
8. *Recommended Career Paths* – Suggest 2–3 potential roles or domains best suited for this candidate.
9. *Final Verdict* – A concise one-paragraph professional summary.

Write this as a structured, readable analytical report in natural English with bullet points and short paragraphs.
"""

    message = HumanMessage(content=[{"type": "text", "text": analysis_prompt}])
    response = gemini_model.invoke([message])
    text = response.content
    if isinstance(text, list):
        text = " ".join([part["text"] for part in text if isinstance(part, dict) and "text" in part])

    state["analysis"] = text
    return state


# ====== WORKFLOW GRAPH ======
graph = StateGraph(ResumeState)
graph.add_node("extract", extract_resume_info)
graph.add_node("analyze", analyze_resume)
graph.add_edge("extract", "analyze")
graph.set_entry_point("extract")
graph.set_finish_point("analyze")

workflow = graph.compile()


# ====== MAIN RUNNER ======
if __name__ == "__main__":
    # Accept CLI path, fallback to default
    resume_file = sys.argv[1] if len(sys.argv) > 1 else "image.png"
    if not os.path.exists(resume_file):
        print(json.dumps({
            "error": f"Resume file not found at '{resume_file}'"
        }))
    else:
        result = workflow.invoke({"image_path": resume_file})
        output = {
            "extracted_data": result.get("extracted_data"),
            "analysis": result.get("analysis"),
        }
        print(json.dumps(output))