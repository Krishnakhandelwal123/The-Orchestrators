import os
import sys
import json
import base64
from dotenv import load_dotenv
from typing import TypedDict, List # <-- Removed 'Literal'
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, END
from tavily import TavilyClient

# --- 1. Load API Keys ---
load_dotenv()

# Check if keys are set
if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY not found in environment variables. Get one from Google AI Studio.")
if not os.getenv("TAVILY_API_KEY"):
    raise ValueError("TAVILY_API_KEY not found in environment variables.")

# --- Instantiate Tavily Client ---
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


# --- 2. Define the Graph's State ---

class GraphState(TypedDict):
    image_url: str
    certificate_name: str
    search_results: List[dict]
    summary: str

# --- 3. Define Helper Functions and Tools ---

def image_to_data_url(file_path: str) -> str:
    """
    Helper function to convert a local image file to a data URL
    that vision models can read.
    """
    try:
        with open(file_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode()
        mime_type = "image/png"
        if file_path.endswith(".jpg") or file_path.endswith(".jpeg"):
            mime_type = "image/jpeg"
        elif file_path.endswith(".webp"):
            mime_type = "image/webp"
        
        return f"data:{mime_type};base64,{encoded_string}"
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return ""
    except Exception as e:
        print(f"Error encoding image: {e}")
        return ""

# --- This is the updated search function ---
def run_tavily_search(
    search_query: str,
    max_results: int = 5,
    include_raw_content: bool = False,
    include_answer: bool = False,
) -> dict:
    """Perform search using Tavily API for a single query.
    (The invalid 'topic' parameter has been removed.)

    Args:
        search_query: Search query to execute
        max_results: Maximum number of results per query
        include_raw_content: Whether to include raw webpage content
        include_answer: Whether to include a generated answer

    Returns:
        Search results dictionary
    """
    try:
        result = tavily_client.search(
            search_query,
            search_depth="basic",
            max_results=max_results,
            include_raw_content=include_raw_content,
            include_answer=include_answer,
            # 'topic' parameter removed as it's not supported
        )
        return result
    except Exception as e:
        print(f"Error during Tavily search: {e}")
        return {"results": []}

class CertificateInfo(BaseModel):
    certificate_name: str = Field(description="The exact, full name of the certificate or award found in the image")

# --- 4. Define the Graph's Nodes ---

def analyze_certificate(state: GraphState):
    """
    Node 1: Analyze the certificate image using Google Gemini.
    """
    print("--- 1. Analyzing Certificate Image (using Gemini) ---")
    image_url = state['image_url']
    
    vision_model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    structured_vision_model = vision_model.with_structured_output(CertificateInfo)
    
    prompt = HumanMessage(
        content=[
            {
                "type": "text",
                "text": "Analyze the provided image of a certificate. Identify and extract the exact, full name of the certificate, award, or course completed. For example: 'Google Advanced Data Analytics Professional Certificate'.",
            },
            {
                "type": "image_url",
                "image_url": {"url": image_url},
            },
        ]
    )
    
    try:
        response = structured_vision_model.invoke([prompt])
        print(f"Extracted Name: {response.certificate_name}")
        return {"certificate_name": response.certificate_name}
    except Exception as e:
        print(f"Error analyzing image: {e}")
        return {"certificate_name": "Error: Could not analyze image."}


def search_tavily(state: GraphState):
    """
    Node 2: Search Tavily for information about the certificate.
    """
    print("--- 2. Searching Tavily (using corrected function) ---")
    certificate_name = state['certificate_name']
    
    if "Error:" in certificate_name:
        print("Skipping search due to previous error.")
        return {"search_results": []}
    
    query = f"what skills and knowledge are gained from completing the '{certificate_name}'"
    
    # --- MODIFIED SECTION ---
    # Call the function without the 'topic' parameter
    tavily_response_dict = run_tavily_search(
        search_query=query,
        max_results=5,
        include_raw_content=False
    )
    # --- END MODIFIED SECTION ---
    
    results_list = tavily_response_dict.get("results", [])
    
    print(f"Found {len(results_list)} search results.")
    return {"search_results": results_list}

def generate_summary(state: GraphState):
    """
    Node 3: Synthesize search results into a detailed summary using Google Gemini.
    """
    print("--- 3. Generating Summary (using Gemini) ---")
    certificate_name = state['certificate_name']
    search_results = state['search_results']
    
    if "Error:" in certificate_name:
        return {"summary": "Could not generate summary because the certificate name could not be extracted from the image."}

    if not search_results:
        return {"summary": f"Could not find any reliable information online about the skills gained from '{certificate_name}'."}

    context = "\n\n".join([f"Source URL: {res['url']}\nSnippet: {res['content']}" for res in search_results if 'url' in res and 'content' in res])
    
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
    
    system_prompt = """
    You are an expert career and skills analyst. Your task is to provide a detailed summary of the skills, knowledge, and value a person has gained by completing a specific certificate.

    Use the provided certificate name and search results (context) to write this summary. 
    
    The summary should be structured and easy to read. Organize it into these sections:
    1.  *Core Competencies:* What key skills did they learn? (e.g., data analysis, cloud configuration, specific software)
    2.  *Key Knowledge Areas:* What topics do they now understand? (e.g., machine learning principles, network security protocols)
    3.  *Value & Validation:* What does this certificate prove to an employer? (e.g., proficiency in X, commitment to learning)
    
    Do not just list the search results. Synthesize them into a coherent, positive, and detailed report.
    """
    
    human_prompt = f"""
    Certificate Name: {certificate_name}

    Search Results Context:
    {context}
    
    Please generate the detailed summary of what the user has gained from this certificate.
    """
    
    try:
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ])
        print("--- 4. Summary Generated ---")
        return {"summary": response.content}
    except Exception as e:
        print(f"Error generating summary: {e}")
        return {"summary": "An error occurred while generating the final summary."}

# --- 5. Build the Graph ---

workflow = StateGraph(GraphState)

workflow.add_node("analyze_certificate", analyze_certificate)
workflow.add_node("search_tavily", search_tavily)
workflow.add_node("generate_summary", generate_summary)

workflow.set_entry_point("analyze_certificate")
workflow.add_edge("analyze_certificate", "search_tavily")
workflow.add_edge("search_tavily", "generate_summary")
workflow.add_edge("generate_summary", END)

app = workflow.compile()

if __name__ == "__main__":
    # Accept CLI path, fallback to default
    local_image_path = sys.argv[1] if len(sys.argv) > 1 else "hello.png"
    image_url = image_to_data_url(local_image_path)
    if image_url:
        inputs = {"image_url": image_url}
        final_summary = ""
        for event in app.stream(inputs, stream_mode="values"):
            if "summary" in event and event["summary"]:
                final_summary = event["summary"]
        print(json.dumps({"summary": final_summary}))
    else:
        print(json.dumps({"error": f"Could not process image at: {local_image_path}"}))