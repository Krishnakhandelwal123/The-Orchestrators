# transcript_analyzer.py

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

# Define the state schema for the workflow
class TranscriptState(TypedDict, total=False):
    image_path: str
    extracted_data: str
    analysis: str

# Initialize Gemini model (multimodal)
gemini_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",   # adjust model name as per your access
    temperature=0.2,
    api_key=os.environ.get("GOOGLE_API_KEY")
)

def image_to_base64_str(image: Image.Image, fmt: str = "PNG") -> str:
    """Convert a PIL Image into a base64-encoded data URI string."""
    buffered = BytesIO()
    image.save(buffered, format=fmt)
    b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:image/{fmt.lower()};base64,{b64}"

def extract_transcript_info(state: TranscriptState) -> TranscriptState:
    img_path = state.get("image_path")
    if not img_path:
        raise ValueError("image_path must be provided in state")

    image = Image.open(img_path)
    data_uri = image_to_base64_str(image)

    prompt = """
You are an expert academic data extractor.
From the provided transcript image, extract all the following in JSON:
{
  "name": "",
  "registration_number": "",
  "semester_year": "",
  "gpa": "",
  "total_credits": "",
  "subjects": [
    {
      "course_code": "",
      "course_name": "",
      "credits": "",
      "grade": ""
    }
  ]
}
Return only valid JSON.
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

def analyze_transcript(state: TranscriptState) -> TranscriptState:
    extracted = state.get("extracted_data", "")
    if not extracted:
        raise ValueError("extracted_data must be present in state")

    analysis_prompt = f"""
You are an education analyst.
Given this extracted data (JSON):
{extracted}

Generate an analytical report including:
- GPA and overall performance summary
- Top 3 best-performing subjects
- Any area of improvement
- Observations on credit and grading trends
- Possible academic strengths
"""

    message = HumanMessage(content=[{"type": "text", "text": analysis_prompt}])
    response = gemini_model.invoke([message])
    text = response.content
    if isinstance(text, list):
        text = " ".join([part["text"] for part in text if isinstance(part, dict) and "text" in part])

    state["analysis"] = text
    return state

# Build LangGraph workflow
graph = StateGraph(TranscriptState)
graph.add_node("extract", extract_transcript_info)
graph.add_node("analyze", analyze_transcript)
graph.add_edge("extract", "analyze")
graph.set_entry_point("extract")
graph.set_finish_point("analyze")

workflow = graph.compile()

if __name__ == "__main__":
    # Allow passing image path via CLI, fallback to default
    img_path = sys.argv[1] if len(sys.argv) > 1 else "transcript.png"
    result = workflow.invoke({"image_path": img_path})
    output = {
        "extracted_data": result.get("extracted_data"),
        "analysis": result.get("analysis"),
    }
    print(json.dumps(output))