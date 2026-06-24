"""
Custom middleware for the application
"""
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
import logging

logger = logging.getLogger(__name__)


def add_cors_middleware(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


async def log_headers_middleware(request: Request, call_next):
    """Middleware to log request headers for debugging"""
    logger.debug("Headers received:")
    for key, value in request.headers.items():
        logger.debug(f"{key}: {value}")
    
    response = await call_next(request)
    return response