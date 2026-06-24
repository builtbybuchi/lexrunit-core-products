"""
Main FastAPI application entry point
"""
import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware 
from app.core.auth import require_api_key
from app.core.middleware import add_cors_middleware, log_headers_middleware
from app.api.v1.routes import chat, consultation, session, health, listen
from app.ecommerce import router as ecommerce_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
# Note: Removed global dependencies=[Depends(require_api_key)] to allow separate auth for ecommerce
app = FastAPI(
    title="Lexrunit AI",
    description="Lexrunit AI Service",
    version="0.1.0",
)

# Add middleware
add_cors_middleware(app)
app.middleware("http")(log_headers_middleware)

# Include API routes for Healthcare (with require_api_key dependency)
app.include_router(chat.router, prefix="/lexcare/v1", tags=["Chat"], dependencies=[Depends(require_api_key)])
app.include_router(consultation.router, prefix="/lexcare/v1", tags=["Consultation"], dependencies=[Depends(require_api_key)])
app.include_router(session.router, prefix="/lexcare/v1", tags=["Session Management"], dependencies=[Depends(require_api_key)])
app.include_router(health.router, prefix="/lexcare/v1", tags=["Health"], dependencies=[Depends(require_api_key)])
app.include_router(listen.router, prefix="/lexcare/v1", tags=["Audio"], dependencies=[Depends(require_api_key)])

# Include API routes for Ecommerce (auth is handled within the router)
app.include_router(ecommerce_router.router, prefix="/flickmart/v1", tags=["Ecommerce"])

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    try:
        from app.services.rag_system import get_rag_system
        rag_system = get_rag_system()
        health = rag_system.health_check()
        
        if health["status"] == "healthy":
            logger.info("RAG System initialized successfully")
            logger.info(f"Medical documents loaded: {health.get('document_count', 'unknown')}")
        else:
            logger.warning(f"RAG System initialization warning: {health}")
            
    except Exception as e:
        logger.error(f"RAG System initialization failed: {e}")
        logger.error("Make sure the 'medical_knowledge_db' folder exists in the project root")


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Lexrunit AI Service",
        "version": "0.0.0",
        "docs": "/docs"
    }


 # Load environment variables
load_dotenv()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)