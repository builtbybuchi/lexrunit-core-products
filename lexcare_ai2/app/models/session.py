"""
Session-related Pydantic models
"""
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class SessionCreate(BaseModel):
    session_id: Optional[str] = None
    session_type: str
    metadata: Optional[Dict[str, Any]] = None


class SessionResponse(BaseModel):
    session_id: str
    session_type: str
    status: str
    created_at: datetime
    last_activity: datetime
    metadata: Optional[Dict[str, Any]] = None