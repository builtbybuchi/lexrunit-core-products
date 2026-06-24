from fastapi import APIRouter, Depends
from app.ecommerce.models import NegotiationPayload
from app.ecommerce.services import handle_negotiation, handle_non_negotiable
from app.ecommerce.auth import require_ecommerce_api_key

router = APIRouter(
    dependencies=[Depends(require_ecommerce_api_key)]
)

@router.post("/negotiable")
async def negotiate(payload: NegotiationPayload):
    """
    Handles negotiation for negotiable products by maintaining conversation history.
    """
    return await handle_negotiation(payload)

@router.post("/nonnegotiable")
async def non_negotiable(payload: NegotiationPayload):
    """
    Handles attempts to negotiate for non-negotiable products.
    """
    return await handle_non_negotiable(payload)
