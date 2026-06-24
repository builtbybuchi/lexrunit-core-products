from pydantic import BaseModel

class NegotiationPayload(BaseModel):
    user_id: str
    seller_id: str
    product_name: str
    actual_price: float
    target_price: float
    last_price: float
    message: str
