import json
import os
import requests
from dotenv import load_dotenv
from fastapi import HTTPException
from pydantic import BaseModel
from uuid import uuid4
from typing import List, Optional
from datetime import datetime, timezone
from app.services.context_manager import ContextManager

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_EMBED_URL = "https://api.groq.com/openai/v1/embeddings"

# Legacy in-memory session storage (deprecated - use ContextManager instead)
sessions = {}


# Pydantic schemas
class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    message: str


class AudioRequest(BaseModel):
    audio_url: str
    consultation_id: str  # link back to consultations table


# Groq API call helper with context management and RAG integration
def call_groq_with_context(session_id: str, user_message: str, session_type: str = "general") -> str:
    """
    Call Groq API with full context management and RAG integration.
    
    Args:
        session_id: Session identifier
        user_message: User's message
        session_type: Type of session for appropriate system prompt
        
    Returns:
        str: AI response
    """
    try:
        # Get RAG context for medical queries using Google File Search
        from app.services.rag_system import get_medical_context
        medical_context = get_medical_context(query=user_message)
        
        # Build complete prompt with context
        messages = ContextManager.build_prompt_with_context(session_id, session_type)
        
        # Add RAG context if relevant medical information was found
        if medical_context and "Knowledge base not found" not in medical_context and "Error processing" not in medical_context:
            rag_prompt = f"""

INFORMATION RETRIEVED FROM MEDICAL KNOWLEDGE BASE:
{medical_context}

Please use the information above to help answer the user's question. The information above is retrieved from verified medical documents."""
            
            # Insert RAG context before the user message
            if messages and messages[-1]["role"] == "system":
                messages[-1]["content"] += rag_prompt
            else:
                messages.append({"role": "system", "content": f"You are a medical AI assistant.{rag_prompt}"})
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Call Groq API
        print(messages)
        ai_response = call_groq("openai/gpt-oss-120b", messages)
        
        # Update session history
        ContextManager.update_session_history(session_id, user_message, ai_response)
        
        return ai_response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Context management error: {str(e)}")


# Original Groq API call helper (for direct use without context)
def call_groq(model: str, messages: List[dict]):
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    payload = {"model": model, "messages": messages}
    response = requests.post(GROQ_API_URL, json=payload, headers=headers)
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail=f"Model API Error{response.text}"
        )
    return response.json()["choices"][0]["message"]["content"]


def call_groq_embedding(model: str, inputs: list[str]) -> list[float]:
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    payload = {"model": model, "input": inputs}
    r = requests.post(GROQ_EMBED_URL, json=payload, headers=headers)
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail=r.text)
    return r.json()["data"][0]["embedding"]

