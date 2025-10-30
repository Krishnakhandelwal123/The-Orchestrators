import os
import sys
import json
from typing import TypedDict
from dotenv import load_dotenv  # Loads your .env file

from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# --- 1. Setup API Key ---
load_dotenv()  # This line finds and loads your .env file

# The script now assumes GOOGLE_API_KEY is in the environment
# (either from your .env file or set manually).

# --- 2. Define the State ---
class AgentState(TypedDict):
    """
    Represents the state of our graph.
    
    Attributes:
        riasec_code: The 3-letter RIASEC code (e.g., "IAS", "RCE").
        summary: The generated personality summary.
    """
    riasec_code: str
    summary: str

# --- 3. Define the Nodes ---

def generate_summary(state: AgentState):
    """
    Generates a personality trait summary based on the RIASEC code.
    """
    # This message will print in your terminal
    print(f"--- Generating summary for code: {state['riasec_code']} ---")
    
    # Get the input code from the state
    riasec_code = state['riasec_code']
    
    # 1. Define the LLM
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)
    except Exception as e:
        print(f"Error initializing the LLM. Is your GOOGLE_API_KEY in the .env file and correct? Error: {e}")
        return {"summary": "Error: Could not initialize model. Please check your API key."}

    
    # 2. Define a specialized prompt
    prompt_template = ChatPromptTemplate.from_template(
        """
        You are an expert career counselor and psychologist specializing in the 
        Holland Codes (RIASEC) framework.

        The RIASEC codes are:
        - R: Realistic (Doers) - Practical, hands-on, physical.
        - I: Investigative (Thinkers) - Analytical, curious, scientific.
        - A: Artistic (Creators) - Expressive, original, independent.
        - S: Social (Helpers) - Cooperative, supportive, empathetic.
        - E: Enterprising (Persuaders) - Competitive, ambitious, leadership-oriented.
        - C: Conventional (Organizers) - Detail-oriented, organized, structured.

        The user's 3-letter RIASEC code is: *{riasec_code}*
 
        Focus on their strengths, work preferences, and how the combination of these three traits creates a unique personality profile.
        
        Address the user directly (e.g., "With an {riasec_code} profile...").
        """
    )
    
    # 3. Create a simple chain
    summary_chain = prompt_template | llm | StrOutputParser()
    
    # 4. Invoke the chain and get the result
    summary = summary_chain.invoke({"riasec_code": riasec_code})
    
    # 5. Return the updated state
    return {"summary": summary}

# --- 4. Build the Graph ---

# Initialize a new graph
workflow = StateGraph(AgentState)

# Add the single node we defined
workflow.add_node("generate_summary", generate_summary)

# Set the entry point for the graph
workflow.set_entry_point("generate_summary")

# This node is the last step, so it connects to the END
workflow.add_edge("generate_summary", END)

# Compile the graph into a runnable application
app = workflow.compile()

# --- 5. Run the Graph Interactively ---

def main():
    """
    Main function to run the interactive loop.
    """
    print("✨ RIASEC Code Summary Generator ✨")
    print("Enter your 3-letter RIASEC code (e.g., 'RCE', 'IAS').\n")
    
    # 1. Get user input
    user_code = input("Enter your code: ")
        
    # 2. Sanitize the input
    riasec_code = user_code.strip().upper()
    
    # 3. Basic validation
    if len(riasec_code) != 3:
        print("Invalid input. Please enter a 3-letter code.\n")
        return # Exit if input is invalid

    # 4. Define the input for the graph
    inputs = {"riasec_code": riasec_code}
    
    # 5. Run the graph
    try:
        # The .invoke() call will run the graph and print the "Generating..." message
        result = app.invoke(inputs)
        
        # 6. Print the final summary
        print("\n✨ FINAL SUMMARY:\n")
        print(result['summary'])
        print("\n" + "="*30 + "\n")
    except Exception as e:
        print(f"An error occurred: {e}")
        print("Please check your API key and network connection.\n")
    
    print("--- Script finished ---")

# This makes sure the main() function runs when you execute the script
if __name__ == "__main__":
    # Support CLI mode for backend integration
    # Usage:
    #   python personality.py RCE           -> prints JSON {"summary": "..."}
    #   python personality.py --instructions -> prints JSON {"instructions": "..."}
    if len(sys.argv) >= 2:
        arg = sys.argv[1].strip()
        # Provide instructions for UI prompt
        if arg == "--instructions":
            instructions = (
                "Enter your 3-letter RIASEC code (e.g., RCE, IAS) where each letter must be one of: R (Realistic), "
                "I (Investigative), A (Artistic), S (Social), E (Enterprising), C (Conventional)."
            )
            print(json.dumps({"instructions": instructions}, ensure_ascii=False))
            sys.exit(0)

        riasec_code = arg.upper()
        valid_letters = set(["R", "I", "A", "S", "E", "C"])
        if len(riasec_code) != 3 or any(ch not in valid_letters for ch in riasec_code):
            print(json.dumps({
                "error": "Invalid RIASEC code. Provide exactly 3 letters from R, I, A, S, E, C (e.g., RCE, IAS)."
            }, ensure_ascii=False))
            sys.exit(0)

        try:
            result = app.invoke({"riasec_code": riasec_code})
            print(json.dumps({"summary": result.get("summary", "")}, ensure_ascii=False))
        except Exception as e:
            print(json.dumps({"error": f"Failed to generate summary: {e}"}, ensure_ascii=False))
        sys.exit(0)

    # Fallback to interactive mode if no CLI args provided
    main()