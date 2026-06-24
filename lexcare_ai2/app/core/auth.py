import os
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Security, status
from fastapi.security.api_key import APIKeyHeader

# Load environment variables
load_dotenv()

# Load expected API key from environment
API_KEY_NAME = "lexrunit-api-key"
API_KEY = os.getenv("API_KEY")  # set this in your .env file

# Define the header scheme for API Key
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


async def require_api_key(api_key: str = Security(api_key_header)):
    """
    Dependency that enforces a valid API Key in the LEXRUNIT-API-KEY header.
    """
    print("Received API key from header:", api_key)
    print("Expected API key from .env:", API_KEY)

    if not API_KEY or api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key",
        )
    return api_key
