"""
Session management endpoints
"""
from fastapi import APIRouter, HTTPException
from app.models.session import SessionCreate, SessionResponse
from app.services.context_manager import ContextManager
from typing import List

router = APIRouter()


@router.post("/sessions", response_model=SessionResponse, tags=["Session Management"])
def create_session(session_data: SessionCreate):
    """Create a new session"""
    try:
        session_id = ContextManager.create_session(
            session_id=session_data.session_id,
            session_type=session_data.session_type,
            metadata=session_data.metadata
        )
        
        session = ContextManager.get_session(session_id)
        return SessionResponse(**session)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Session creation error: {str(e)}")


@router.get("/sessions/{session_id}", response_model=SessionResponse, tags=["Session Management"])
def get_session(session_id: str):
    """Get session details"""
    session = ContextManager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return SessionResponse(**session)


@router.get("/sessions", response_model=List[SessionResponse], tags=["Session Management"])
def list_sessions():
    """List all sessions"""
    try:
        sessions = ContextManager.list_sessions()
        return [SessionResponse(**session) for session in sessions]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing sessions: {str(e)}")


@router.delete("/sessions/{session_id}", tags=["Session Management"])
def delete_session(session_id: str):
    """Delete a session"""
    try:
        success = ContextManager.delete_session(session_id)
        if not success:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {"message": "Session deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting session: {str(e)}")