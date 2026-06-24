import os
from appwrite.client import Client
from appwrite.services.databases import Databases

DATABASE_ID = "website-db"

def get_appwrite_client():
    client = Client()
    # Assuming local Appwrite or cloud.
    endpoint = os.getenv("APPWRITE_ENDPOINT", "https://cloud.appwrite.io/v1")
    project_id = os.getenv("APPWRITE_PROJECT_ID", "db")
    api_key = os.getenv("APPWRITE_API_KEY", "your-api-key")
    
    client.set_endpoint(endpoint)
    client.set_project(project_id)
    client.set_key(api_key)
    
    return client

def get_databases():
    return Databases(get_appwrite_client())
