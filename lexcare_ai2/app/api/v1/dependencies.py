"""
API dependencies and shared functionality
"""
from fastapi import Depends
from app.core.auth import require_api_key
from app.services.groq_client import get_groq_client
from app.services.context_manager import ContextManager


# Authentication dependency
def get_api_key_dependency():
    """Get API key authentication dependency"""
    return Depends(require_api_key)


# Service dependencies
def get_groq_service():
    """Get Groq client service"""
    return get_groq_client()


def get_context_manager():
    """Get context manager service"""
    return ContextManager