import os
from dotenv import load_dotenv

load_dotenv()


def get_appwrite_config():
    """
    Get Appwrite configuration from the environment variables.

    Returns:
        tuple: (endpoint, project_id, api_key) for Appwrite client

    Raises:
        ValueError: If required environment variables are missing
    """

    endpoint = os.environ.get("APPWRITE_ENDPOINT")
    project_id = os.environ.get("APPWRITE_PROJECT_ID")
    api_key = os.environ.get("APPWRITE_API_KEY")

    if not endpoint or not project_id or not api_key:
        raise ValueError(
            "APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, and APPWRITE_API_KEY environment variables must be set. "
            "Please add them to your .env file"
        )

    return endpoint, project_id, api_key
