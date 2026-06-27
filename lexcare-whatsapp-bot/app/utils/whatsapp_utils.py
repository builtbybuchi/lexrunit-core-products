import logging
from flask import current_app, jsonify
import json
import requests

from app.services.ai_service import generate_response
import re


def log_http_response(response):
    logging.info(f"Status: {response.status_code}")
    logging.info(f"Content-type: {response.headers.get('content-type')}")
    logging.info(f"Body: {response.text}")


def get_text_message_input(recipient, text):
    return json.dumps(
        {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": recipient,
            "type": "text",
            "text": {"preview_url": False, "body": text},
        }
    )

def get_interactive_menu_input(recipient):
    return json.dumps(
        {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": recipient,
            "type": "interactive",
            "interactive": {
                "type": "list",
                "header": {
                    "type": "text",
                    "text": "LexCare Services"
                },
                "body": {
                    "text": "Welcome to LexCare! Please select an option below to manage your account or request a service:"
                },
                "footer": {
                    "text": "Powered by Lexrunit"
                },
                "action": {
                    "button": "Main Menu",
                    "sections": [
                        {
                            "title": "Account & Services",
                            "rows": [
                                {
                                    "id": "menu_my_account",
                                    "title": "My Account",
                                    "description": "View and manage your account"
                                },
                                {
                                    "id": "menu_book_consult",
                                    "title": "Book Consultation",
                                    "description": "Schedule a visit with a doctor"
                                },
                                {
                                    "id": "menu_order_drug",
                                    "title": "Order Drug",
                                    "description": "Get medication delivered"
                                },
                                {
                                    "id": "menu_order_lab",
                                    "title": "Order Lab Test",
                                    "description": "Schedule a lab test"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    )


def get_flow_button_input(recipient, flow_id, flow_token, header_text, body_text, button_text, screen="REGISTER_SCREEN"):
    return json.dumps({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": recipient,
        "type": "interactive",
        "interactive": {
            "type": "flow",
            "header": {
                "type": "text",
                "text": header_text
            },
            "body": {
                "text": body_text
            },
            "footer": {
                "text": "Powered by Lexrunit"
            },
            "action": {
                "name": "flow",
                "parameters": {
                    "flow_message_version": "3",
                    "flow_token": flow_token,
                    "flow_id": flow_id,
                    "flow_cta": button_text,
                    "flow_action": "navigate",
                    "flow_action_payload": {
                        "screen": screen,
                    }
                }
            }
        }
    })

def send_message(data):
    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {current_app.config['ACCESS_TOKEN']}",
    }

    url = (
        f"https://graph.facebook.com/"
        f"{current_app.config['VERSION']}/"
        f"{current_app.config['PHONE_NUMBER_ID']}/messages"
    )

    try:
        response = requests.post(
            url, data=data, headers=headers, timeout=10
        )  # 10 seconds timeout as an example
        response.raise_for_status()
    except requests.Timeout:
        logging.error("Timeout occurred while sending message")
        return jsonify({"status": "error", "message": "Request timed out"}), 408
    except (
        requests.RequestException
    ) as e:  # This will catch any general request exception
        logging.error(f"Request failed due to: {e}")
        return jsonify({"status": "error", "message": "Failed to send message"}), 500
    else:
        # Process the response as normal
        log_http_response(response)
        return response


def process_text_for_whatsapp(text):
    # Remove brackets
    pattern = r"\【.*?\】"
    # Substitute the pattern with an empty string
    text = re.sub(pattern, "", text).strip()

    # Pattern to find double asterisks including the word(s) in between
    pattern = r"\*\*(.*?)\*\*"

    # Replacement pattern with single asterisks
    replacement = r"*\1*"

    # Substitute occurrences of the pattern with the replacement
    whatsapp_style_text = re.sub(pattern, replacement, text)

    return whatsapp_style_text


def process_whatsapp_message(body):
    wa_id = body["entry"][0]["changes"][0]["value"]["contacts"][0]["wa_id"]
    name = body["entry"][0]["changes"][0]["value"]["contacts"][0]["profile"]["name"]

    message = body["entry"][0]["changes"][0]["value"]["messages"][0]
    
    # Handle interactive replies (Menu clicks)
    if message.get("type") == "interactive":
        interactive_type = message["interactive"].get("type")
        if interactive_type == "list_reply":
            reply_id = message["interactive"]["list_reply"]["id"]
            if reply_id == "menu_my_account":
                from app.services.ai_service import check_user_status
                user_status = check_user_status(wa_id, name)
                
                info = (
                    f"👤 *Your Account Info*\n"
                    f"Name: {name}\n"
                    f"Questions Asked: {user_status.get('questionCount', 0)}\n"
                    f"Subscribed: {'✅ Yes' if user_status.get('isSubscribed') else '❌ No'}\n\n"
                    f"To manage your settings or update your preferences, visit: https://lexrunit.com/account"
                )
                data = get_text_message_input(wa_id, info)
                send_message(data)
                return
            elif reply_id == "menu_book_consult":
                data = get_flow_button_input(
                    recipient=wa_id,
                    flow_id="1546323520196726",
                    flow_token="book_consult_flow",
                    header_text="Book Consultation",
                    body_text="Please provide the details for your appointment.",
                    button_text="Open Form",
                    screen="book_consultation"
                )
                send_message(data)
                return
            elif reply_id == "menu_order_drug":
                data = get_flow_button_input(
                    recipient=wa_id,
                    flow_id="2106749493243947",
                    flow_token="order_drug_flow",
                    header_text="Pharmacy Order",
                    body_text="Please fill out this form to request your prescription or refill.",
                    button_text="Open Form",
                    screen="order_drug"
                )
                send_message(data)
                return
            elif reply_id == "menu_order_lab":
                data = get_flow_button_input(
                    recipient=wa_id,
                    flow_id="1023272653393135",
                    flow_token="order_lab_flow",
                    header_text="Order Lab Test",
                    body_text="Please select the test you need and your preferred location.",
                    button_text="Open Form",
                    screen="order_lab"
                )
                send_message(data)
                return
            else:
                response = "Invalid selection."
                data = get_text_message_input(wa_id, response)
                send_message(data)
                return
            
        elif interactive_type == "nfm_reply":
            response_json_str = message["interactive"]["nfm_reply"]["response_json"]
            response_data = json.loads(response_json_str)
            
            action = response_data.get("action")
            
            if action == "book_consultation":
                response = f"Your consultation has been booked for {response_data.get('date')} at {response_data.get('time')}. Reason: {response_data.get('symptoms')}. Our team will contact you shortly."
                data = get_text_message_input(wa_id, response)
                send_message(data)
                return
            elif action == "order_drug":
                response = f"Your order for {response_data.get('medication')} to be delivered to {response_data.get('address')} has been received."
                data = get_text_message_input(wa_id, response)
                send_message(data)
                return
            elif action == "order_lab_test":
                response = f"Your request for a {response_data.get('test')} ({response_data.get('location')}) has been received."
                data = get_text_message_input(wa_id, response)
                send_message(data)
                return
            else:
                # Registration flow
                full_name = response_data.get("full_name", name)
                
                # Send to backend to register
            try:
                backend_url = f"{current_app.config['BASE_BACKEND_URL']}/api/v1/whatsapp/register"
                requests.post(backend_url, json={"wa_id": wa_id, "name": full_name}, timeout=10)
                response = f"Thank you, {full_name}! Your account has been created successfully. You can now start asking Dr. Andre questions."
            except Exception as e:
                logging.error(f"Failed to register user: {e}")
                response = "Sorry, we could not create your account at this time. Please try again."
                
            data = get_text_message_input(wa_id, response)
            send_message(data)
            return

    # Normal text handling
    if message.get("type") == "text":
        message_body = message["text"]["body"]
        
        # Trigger Menu
        trigger_text = message_body.strip().lower()
        if trigger_text in ["menu", "/menu", "drandre", "/drandre"]:
            data = get_interactive_menu_input(wa_id)
            send_message(data)
            return
            
        # Trigger Register
        if message_body.strip().lower() == "register":
            data = get_flow_button_input(
                recipient=wa_id,
                flow_id="1345904660411257",
                flow_token="register_flow",
                header_text="Account Setup",
                body_text="Please complete your registration to access LexCare features.",
                button_text="Create Account"
            )
            send_message(data)
            return

        response = generate_response(message_body, wa_id, name)
        response = process_text_for_whatsapp(response)

        data = get_text_message_input(wa_id, response)
        send_message(data)


def is_valid_whatsapp_message(body):
    """
    Check if the incoming webhook event has a valid WhatsApp message structure.
    """
    return (
        body.get("object")
        and body.get("entry")
        and body["entry"][0].get("changes")
        and body["entry"][0]["changes"][0].get("value")
        and body["entry"][0]["changes"][0]["value"].get("messages")
        and body["entry"][0]["changes"][0]["value"]["messages"][0]
    )
