"""
Chat endpoints for patient and doctor interactions
"""
from fastapi import APIRouter, HTTPException
from app.models.chat import ChatRequest
from app.utils.common import call_groq_with_context
from app.services.context_manager import ContextManager
from uuid import uuid4

router = APIRouter()

# Chat AI IDs
CHAT_AI_ID = "b892d269-92d3-4090-8620-3e3b1a11e990"
DOCTOR_CHAT_AI_ID = "doctor-ai-id"  # Add appropriate ID


@router.post("/chat/patient", tags=["Chat"])
def chat_patient(request: ChatRequest):
    """Handle patient chat interactions"""
    # Handle session creation/validation
    session_id = request.session_id
    
    if session_id:
        # Check if session exists
        existing_session = ContextManager.get_session(session_id)
        if not existing_session:
            # Session doesn't exist, create a new one
            session_id = ContextManager.create_session(
                session_id=session_id,
                session_type="chat_patient",
                metadata={"chat_ai_id": CHAT_AI_ID, "original_session_id": session_id}
            )
    else:
        # No session provided, create new one
        session_id = ContextManager.create_session(
            session_id=str(uuid4()),
            session_type="chat_patient",
            metadata={"chat_ai_id": CHAT_AI_ID}
        )

    try:
        # Get AI response with context
        ai_response = call_groq_with_context(session_id, request.message, "chat_patient")
        
        return {
            "session_id": session_id,
            "response": ai_response
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@router.post("/chat/doctor", tags=["Chat"])
def chat_doctor(request: ChatRequest):
    """Handle doctor chat interactions"""
    # Handle session creation/validation
    session_id = request.session_id
    
    if session_id:
        # Check if session exists
        existing_session = ContextManager.get_session(session_id)
        if not existing_session:
            # Session doesn't exist, create a new one
            session_id = ContextManager.create_session(
                session_id=session_id,
                session_type="chat_doctor",
                metadata={"chat_ai_id": DOCTOR_CHAT_AI_ID, "original_session_id": session_id}
            )
    else:
        # No session provided, create new one
        session_id = ContextManager.create_session(
            session_id=str(uuid4()),
            session_type="chat_doctor",
            metadata={"chat_ai_id": DOCTOR_CHAT_AI_ID}
        )

    try:
        # Get AI response with context
        ai_response = call_groq_with_context(session_id, request.message, "chat_doctor")
        
        return {
            "session_id": session_id,
            "response": ai_response
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Doctor chat error: {str(e)}")