"""
Consultation endpoints
"""
from fastapi import APIRouter, HTTPException
from app.models.chat import ChatRequest
from app.models.consultation import ConsultationRequest
from app.utils.common import call_groq_with_context
from app.services.context_manager import ContextManager
from datetime import datetime, timezone
import json
from uuid import uuid4
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

CONSULTATION_AI_ID = "f77b6df7-c27e-47f5-bcf7-797650d16d81"

# Confidence thresholds for diagnosis workflow
THRESHOLD_HIGH = 0.7
THRESHOLD_LOW = 0.3


@router.post("/consult", tags=["Consultation"])
def consult(request: ChatRequest):
    """Handle medical consultation with confidence-loop workflow"""
    # Handle session creation/validation
    session_id = request.session_id
    
    if session_id:
        # Check if session exists
        session = ContextManager.get_session(session_id)
        if not session:
            # Session doesn't exist, create a new one
            session_id = ContextManager.create_session(
                session_type="consultation",
                session_id=session_id,
                metadata={"consultation_ai_id": CONSULTATION_AI_ID, "original_session_id": session_id}
            )
    else:
        # No session provided, create new one
        session_id = ContextManager.create_session(
            session_id=str(uuid4()),
            session_type="consultation",
            metadata={"consultation_ai_id": CONSULTATION_AI_ID}
        )

    try:
        # Get AI response with medical context
        ai_response = call_groq_with_context(session_id, request.message, "consultation")
        
        # TODO: Implement confidence scoring and diagnosis workflow
        # This would involve analyzing the response for diagnostic confidence
        # and implementing the confidence-loop workflow mentioned in the original
        
        return {
            "session_id": session_id,
            "response": ai_response,
            "consultation_ai_id": CONSULTATION_AI_ID
        }
        
    except Exception as e:
        logger.error(f"Consultation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Consultation error: {str(e)}")