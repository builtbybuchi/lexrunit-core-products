import os
from dotenv import load_dotenv
from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader

# Load environment variables
load_dotenv()

# Load expected API key from environment for Ecommerce
API_KEY_NAME = "flickmart-api-key"
API_KEY = os.getenv("FLICKMART_API_KEY")

# Define the header scheme for API Key
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def require_ecommerce_api_key(api_key: str = Security(api_key_header)):
    """
    Dependency that enforces a valid API Key in the FLICKMART-API-KEY header.
    """
    if not API_KEY:
        # If no key is configured, we might want to fail open or closed. 
        # For security, failing closed (500 or 401) is better if it's expected to be there.
        # But let's log a warning or just fail.
        print("FLICKMART_API_KEY not set in environment.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server configuration error: API Key not set",
        )

    if not api_key or api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key",
        )
    return api_key
