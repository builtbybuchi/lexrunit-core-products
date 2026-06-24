import os
from fastapi import Header, HTTPException, Request

API_KEY = os.getenv("LEXRUNIT_API_KEY", "default-dev-key")

async def verify_api_key(x_api_key: str = Header(..., alias="x-lexrunit-api-key")):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return x_api_key

def get_client_ip(request: Request):
    return request.client.host
