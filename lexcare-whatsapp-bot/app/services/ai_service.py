import os
import logging
import requests
from dotenv import load_dotenv
from .automated_resp import automated_resp
import uuid
load_dotenv()
LEXRUNIT_API_KEY = os.getenv("LEXRUNIT_API_KEY")
URL = "https://lexcare-ai2.fly.dev/lexcare/v1/chat/patient"
CONSULT_URL = "https://lexcare-ai2.fly.dev/lexcare/v1/chat/consultation"

headers = {
    "Content-Type": "application/json",
    "LEXRUNIT-API-KEY": LEXRUNIT_API_KEY,
}

def generate_response(message_body, wa_id, name):
    # Generate a UUID based on the wa_id
    session_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, wa_id))

    if message_body.startswith("/consult") or message_body.startswith("/drandre"):
        response = automated_resp(message_body, wa_id, name)
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
    except Exception as e:
        logging.error(f"AI API call failed: {e}")
        ai_response = f"Sorry, I could not process your request at this time.{e}"

    return ai_response
