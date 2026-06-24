import os
import logging
from dotenv import load_dotenv
from groq import Groq
from fastapi import HTTPException
from app.ecommerce.prompts import flickmart_initial_prompt
from app.ecommerce.models import NegotiationPayload
from app.services.context_manager import ContextManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Clients
try:
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY_NEXT"))
except Exception as e:
    logger.error(f"Failed to create Groq client: {str(e)}")
    # We might want to re-raise or handle this gracefully depending on app startup requirements
    # For now, we'll log it. If the service is used, it will fail.


async def handle_negotiation(payload: NegotiationPayload):
    """
    Handles negotiation logic.
    """
    # 1. Define the unique conversation thread key
    # (Used for logging or debugging, but ContextManager handles retrieval)
    
    # 2. Build the static initial system prompt
    initial_prompt = flickmart_initial_prompt(
        product_name=payload.product_name,
        initial_price=payload.actual_price,
        last_price=payload.last_price,
        target_price=payload.target_price,
    )

    # 3. Get or create the conversation from Appwrite via ContextManager
    data = None
    try:
        data = ContextManager.get_ecommerce_session(
            user_id=payload.user_id,
            seller_id=payload.seller_id,
            product_name=payload.product_name
        )
    except Exception as e:
        logger.error("Database query failed", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Database query failed: {e}")

    if data:
        conversation_data = data
        history = conversation_data.get("history", [])
    else:
        # No conversation found; initialize a new one with system prompt
        # We don't have a full record yet, so we construct the history
        history = [{"role": "system", "content": initial_prompt}]
        conversation_data = {
            "user_id": payload.user_id,
            "seller_id": payload.seller_id,
            "product_name": payload.product_name,
            "actual_price": payload.actual_price,
            "target_price": payload.target_price,
            "last_price": payload.last_price,
            "history": history,
            "status": "active"
        }

    # 4. Append the new user message to the history
    history.append({"role": "user", "content": payload.message})

    # 5. Prepare the full conversation for the Groq API
    messages_for_groq = history

    # 6. Call the Groq API for an AI response
    bot_response = ""
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=messages_for_groq,
            temperature=1,
            max_completion_tokens=400,
            top_p=1,
            reasoning_effort="medium",
            model="openai/gpt-oss-20b",
        )
        bot_response = chat_completion.choices[0].message.content
        
        # If AI returned empty, retry once with the initial system prompt enforced
        if not bot_response or not bot_response.strip():
            retry_msgs = [{"role": "system", "content": initial_prompt}] + history[1:]
            try:
                retry = groq_client.chat.completions.create(
                    messages=retry_msgs,
                    temperature=1,
                    max_completion_tokens=200,
                    top_p=1,
                    reasoning_effort="medium",
                    model="openai/gpt-oss-20b",
                )
                bot_response = retry.choices[0].message.content
            except Exception:
                pass
    except Exception as e:
        logger.error("Failed to get response from Groq API", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get response from Groq API: {str(e)}")

    # 7. Append the bot's response to the history
    history.append({"role": "assistant", "content": bot_response})

    # 8. Update the conversation record in Appwrite via ContextManager
    try:
        ContextManager.create_or_update_ecommerce_session(
            user_id=payload.user_id,
            seller_id=payload.seller_id,
            product_name=payload.product_name,
            actual_price=payload.actual_price,
            target_price=payload.target_price,
            last_price=payload.last_price,
            history=history
        )
    except Exception as e:
        # Log but do not interrupt response generation
        logger.error(
            "Failed to save conversation history, continuing without DB persistence: %s", str(e),
            exc_info=True
        )

    return {**payload.dict(), "response": bot_response}


async def handle_non_negotiable(payload: NegotiationPayload):
    """
    Handles non-negotiable logic.
    """
    message = (
        f"I'm sorry, but the price for {payload.product_name} is non-negotiable. "
        f"The actual fixed price is {payload.actual_price}."
        f"\n \tIf you need the product, pay by clicking on the wallet icon at the bottom right"
    )
    return {**payload.dict(), "response": message}
