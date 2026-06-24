"""
Consultation-related Pydantic models
"""
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class ConsultationRequest(BaseModel):
    session_id: Optional[str] = None
    message: str
    symptoms: Optional[List[str]] = None
    medical_history: Optional[str] = None


class DiagnosisResponse(BaseModel):
    confidence_score: float
    primary_diagnosis: str
    differential_diagnoses: List[str]
    recommendations: List[str]
    requires_followup: bool