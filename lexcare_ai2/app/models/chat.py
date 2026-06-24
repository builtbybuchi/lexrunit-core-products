"""
Chat-related Pydantic models
"""
from pydantic import BaseModel
from typing import Optional


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