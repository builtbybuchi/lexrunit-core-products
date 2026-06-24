"""
Health check and system status endpoints
"""
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.get("/health", tags=["Health"])
def health_check():
    """Basic health check endpoint"""
    return {"status": "healthy", "service": "LexCare AI"}


@router.get("/health/rag", tags=["Health"])
def rag_health_check():
    """Check the health of the RAG system"""
    try:
        from app.services.rag_system import get_rag_system
        rag_system = get_rag_system()
        return rag_system.health_check()
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}