from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import hospitals, careers, news, blog, contact, users, admin, higs
import logging
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.core.dependencies import verify_api_key

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Base Backend Service",
    description="Backend service for Lexrunit Official Website",
    version="0.1.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

api_dependencies = [Depends(verify_api_key)]

app.include_router(hospitals.router, prefix="/api/v1/hospitals", tags=["Hospitals"], dependencies=api_dependencies)
app.include_router(careers.router, prefix="/api/v1/careers", tags=["Careers"], dependencies=api_dependencies)
app.include_router(news.router, prefix="/api/v1/news", tags=["News"], dependencies=api_dependencies)
app.include_router(blog.router, prefix="/api/v1/blog", tags=["Blog"], dependencies=api_dependencies)
app.include_router(contact.router, prefix="/api/v1/contact", tags=["Contact"], dependencies=api_dependencies)
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"], dependencies=api_dependencies)
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"], dependencies=api_dependencies)
app.include_router(higs.router, prefix="/api/v1/higs", tags=["HIGS"], dependencies=api_dependencies)

@app.get("/")
def root():
    return {"message": "Base Backend API", "version": "0.1.0"}
