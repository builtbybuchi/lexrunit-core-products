import os
import logging
import requests
from .automated_resp import automated_resp
import uuid

LEXRUNIT_API_KEY = os.environ.get("LEXRUNIT_API_KEY")
BASE_BACKEND_URL = os.environ.get("VITE_BASE_BACKEND_URL", "https://lexrunit-base-backend.builtbybuchi.workers.dev")
URL = "https://lexcare-ai2.fly.dev/lexcare/v1/chat/patient"
CONSULT_URL = "https://lexcare-ai2.fly.dev/lexcare/v1/chat/consultation"

headers = {
    "Content-Type": "application/json",
    "LEXRUNIT-API-KEY": LEXRUNIT_API_KEY,
}

def check_user_status(wa_id, name):
    try:
        url = f"{BASE_BACKEND_URL}/api/v1/whatsapp/user-status"
        # We assume the base backend might have /api/v1 appended to the base URL or not, 
        # so let's format it safely.
        clean_base = BASE_BACKEND_URL.rstrip('/')
        if not clean_base.endswith('/api/v1'):
            url = f"{clean_base}/api/v1/whatsapp/user-status"
        else:
            url = f"{clean_base}/whatsapp/user-status"
            
        res = requests.post(url, json={"wa_id": wa_id, "name": name}, timeout=10)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        logging.error(f"Failed to check user status: {e}")
        # Default fallback so the bot doesn't completely break
        return {"exists": True, "questionCount": 0, "isSubscribed": True, "checkoutUrl": "https://lexrunit.com/subscribe"}

def increment_question_count(wa_id):
    try:
        clean_base = BASE_BACKEND_URL.rstrip('/')
        if not clean_base.endswith('/api/v1'):
            url = f"{clean_base}/api/v1/whatsapp/increment-question"
        else:
            url = f"{clean_base}/whatsapp/increment-question"
            
        requests.post(url, json={"wa_id": wa_id}, timeout=5)
    except Exception as e:
        logging.error(f"Failed to increment question count: {e}")

def generate_response(message_body, wa_id, name):
    # Check user account and subscription status
    user_status = check_user_status(wa_id, name)
    
    if user_status.get("questionCount", 0) >= 5 and not user_status.get("isSubscribed", False):
        checkout_url = user_status.get("checkoutUrl", "https://lexrunit.com/subscribe")
        return f"You have reached your limit of 5 free questions.\n\nTo continue asking questions and get full access to Dr. Andre, please subscribe here: {checkout_url}"

    # Generate a UUID based on the wa_id
    session_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, wa_id))

    if message_body.startswith("/consult") or message_body.startswith("/drandre"):
        response = automated_resp(message_body, wa_id, name)
        increment_question_count(wa_id)
        return response

    url = URL

    payload = {
        "message": message_body,
        "session_id": session_uuid,

    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        ai_response = response.json().get("response")
        increment_question_count(wa_id)
    except Exception as e:
        logging.error(f"AI API call failed: {e}")
        ai_response = f"Sorry, I could not process your request at this time.{e}"

    if user_status.get("questionCount", 0) == 3 and not user_status.get("isSubscribed", False):
        checkout_url = user_status.get("checkoutUrl", "https://lexrunit.com/subscribe")
        ai_response += f"\n\n*Reminder:* You have 1 free question left! Please subscribe to continue using Dr. Andre: {checkout_url}"

    if not user_status.get("isRegistered", False):
        ai_response += "\n\n*Action Required:* You must register to get the full experience. Type 'register' to create your account directly here on WhatsApp."

    return ai_response
