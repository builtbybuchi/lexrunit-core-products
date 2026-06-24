import os
import requests
import json
from uuid import uuid4
from dotenv import load_dotenv
from pprint import pprint

# Load environment variables and set up configuration
load_dotenv()
API_KEY = os.getenv("API_KEY")
BASE_LOCAL_URL = "http://127.0.0.1:6000"  # Change this to your API server URL
BASE_DEPLOYED_URL = "https://ai.lexrunit.com"
deployed = False

if deployed:
    BASE_URL = BASE_DEPLOYED_URL
else:
    BASE_URL = BASE_LOCAL_URL


# Test audio URL - replace with a real audio URL for testing listen-consultation
TEST_AUDIO_URL = "https://example.com/sample-consultation.mp3"

# Common headers with authentication
headers = {"Content-Type": "application/json", "LEXRUNIT-API-KEY": API_KEY}


def test_patient_chat():
    """Test the patient chat endpoint."""
    print("\n=== Testing Patient Chat ===")

    message = input("Enter patient message: ")

    endpoint = f"{BASE_URL}/chat/patient"
    payload = {
        "message": message,
        # "user_id": "test-user-123",
        "session_id": "0453581f-252c-42bb-959d-25b793eac574"
    }

    try:
        response = requests.post(endpoint, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        print(f"Status: {response.status_code}")
        print(f"Session ID: {result.get('session_id')}")
        print(f"Response: {result.get('response')}")

        # Return session ID for continuation tests if needed
        return result.get("session_id")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        if hasattr(e, "response"):
            print(f"Response: {e.response.text}")
        return None


def test_doctor_chat():
    """Test the doctor chat endpoint."""
    print("\n=== Testing Doctor Chat ===")

    message = input("Enter question: ")

    endpoint = f"{BASE_URL}/chat/doctor"
    payload = {
        "message": message,
        "user_id": "doctor-456",
    }

    try:
        response = requests.post(endpoint, headers=headers, json=payload)
        response.raise_for_status()
        result = response.text  # Direct response for doctor chat

        print(f"Status: {response.status_code}")
        print(f"Response: {result}")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        if hasattr(e, "response"):
            print(f"Response: {e.response.text}")


def test_consultation(continue_session=None):
    """Test the diagnostic consultation endpoint.

    Args:
        continue_session: Optional session ID to continue an existing consultation
    """
    print("\n=== Testing Consultation ===")

    endpoint = f"{BASE_URL}/consult"
    payload = {
        "message": "I've had a persistent cough, chest pain, and difficulty breathing for the past week."
    }

    if continue_session:
        payload["session_id"] = continue_session
        print(f"Continuing session: {continue_session}")

    try:
        response = requests.post(endpoint, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        print(f"Status: {response.status_code}")
        print(f"Session ID: {result.get('session_id')}")

        if result.get("done"):
            print("Consultation completed!")
            print(
                f"Diagnosis: {result.get('disease', {}).get('name')} "
                + f"(confidence: {result.get('disease', {}).get('confidence')})"
            )
            print(f"Advice: {result.get('advice')}")
        else:
            print("Consultation continuing...")
            print(f"Follow-up question: {result.get('question')}")
            print("Candidate diagnoses:")
            for candidate in result.get("candidates", [])[:3]:  # Show top 3
                print(f"  - {candidate.get('name')}: {candidate.get('confidence')}")

        return result.get("session_id"), result.get("done", False)
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        if hasattr(e, "response"):
            print(f"Response: {e.response.text}")
        return None, False


def test_listen_consultation():
    """Test the consultation recording endpoint."""
    print("\n=== Testing Listen Consultation ===")

    # WARNING: This won't work with the example URL - replace with a real audio URL
    # for actual testing

    endpoint = f"{BASE_URL}/listen-consultation"
    consultation_id = str(uuid4())
    payload = {"audio_url": TEST_AUDIO_URL, "consultation_id": consultation_id}

    print(
        f"WARNING: Using example audio URL. Replace TEST_AUDIO_URL with a real URL for actual testing."
    )
    print(f"Consultation ID: {consultation_id}")

    try:
        response = requests.post(endpoint, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        print(f"Status: {response.status_code}")
        print("Transcript excerpt:", result.get("transcript", "")[:100] + "...")
        print("Summary excerpt:", result.get("summary", "")[:100] + "...")
        print("Recommendation excerpt:", result.get("recommendation", "")[:100] + "...")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        if hasattr(e, "response"):
            print(f"Response: {e.response.text}")


def run_consult_dialog():
    """Run a multi-turn consultation to complete the diagnosis."""
    print("\n=== Running Complete Consultation Dialog ===")

    session_id, is_done = test_consultation()

    if not session_id:
        print("Failed to start consultation")
        return

    # Continue the consultation with follow-up answers until done
    follow_up_answers = [
        "Yes, I've had a fever of about 101°F.",
        "No, I haven't had any significant exposure that I know of.",
        "Yes, I'm experiencing fatigue and some muscle aches.",
        "It started quite suddenly.",
        "Yes, my breathing gets worse when lying down.",
    ]

    turn = 1
    for answer in follow_up_answers:
        if is_done:
            break

        print(f"\n--- Follow-up Turn {turn} ---")
        print(f"User answer: {answer}")

        payload = {"session_id": session_id, "message": answer}

        try:
            response = requests.post(
                f"{BASE_URL}/consult", headers=headers, json=payload
            )
            response.raise_for_status()
            result = response.json()

            if result.get("done"):
                print("Consultation completed!")
                print(
                    f"Diagnosis: {result.get('disease', {}).get('name')} "
                    + f"(confidence: {result.get('disease', {}).get('confidence')})"
                )
                print(f"Advice: {result.get('advice')}")
                is_done = True
            else:
                print(f"Follow-up question: {result.get('question')}")
                print("Top candidates:")
                for candidate in result.get("candidates", [])[:3]:  # Show top 3
                    print(f"  - {candidate.get('name')}: {candidate.get('confidence')}")

            turn += 1
        except requests.exceptions.RequestException as e:
            print(f"Error: {e}")
            if hasattr(e, "response"):
                print(f"Response: {e.response.text}")
            break

    if not is_done:
        print("\nConsultation did not reach a conclusion after all follow-ups.")


def main():
    """Run all tests."""
    print("Starting LexCare AI API Tests")
    print("=============================")

    if not API_KEY:
        print("ERROR: API_KEY not set in .env file. Set API_KEY and try again.")
        return

    # Run individual endpoint tests
    test_patient_chat()
    # test_doctor_chat()
    # test_consultation()
    # Uncomment to test with real audio URL:
    # test_listen_consultation()

    # Run multi-turn consultation simulation
    # run_consult_dialog()


if __name__ == "__main__":
    main()
