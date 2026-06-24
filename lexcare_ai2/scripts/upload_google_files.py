#!/usr/bin/env python3
"""
Script to manage Google File Search stores and upload documents.
Supports separate stores for Ecommerce and Healthcare.
"""

import os
import sys
import time
import argparse
from typing import Optional
from google import genai
from google.genai import types

# Add project root to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.core.config import get_google_genai_config

# Store names
ECOMMERCE_STORE_NAME = "ecommerce-knowledge-store"
HEALTHCARE_STORE_NAME = "healthcare-knowledge-store"

def get_client():
    """Initialize Google GenAI client."""
    api_key = get_google_genai_config()
    return genai.Client(api_key=api_key)

def list_stores(client):
    """List all available file search stores."""
    print("Listing File Search Stores...")
    count = 0
    for store in client.file_search_stores.list():
        print(f"Name: {store.name}")
        print(f"Display Name: {store.display_name}")
        print("-" * 30)
        count += 1
    
    if count == 0:
        print("No file search stores found.")

def create_store(client, display_name: str):
    """Create a new file search store."""
    print(f"Creating store '{display_name}'...")
    store = client.file_search_stores.create(config={'display_name': display_name})
    print(f"✅ Store created: {store.name}")
    return store

def get_store_by_display_name(client, display_name: str):
    """Find a store by its display name."""
    for store in client.file_search_stores.list():
        if store.display_name == display_name:
            return store
    return None

def upload_file(client, store_name: str, file_path: str, display_name: Optional[str] = None):
    """Upload a file to a specific store."""
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return

    print(f"Uploading '{file_path}' to store '{store_name}'...")
    
    # Upload file
    file_upload = client.files.upload(
        file=file_path,
        config={'display_name': display_name or os.path.basename(file_path)}
    )
    
    print(f"File uploaded: {file_upload.name}. Waiting for processing...")
    
    # Wait for file to be active
    while file_upload.state.name == "PROCESSING":
        time.sleep(2)
        file_upload = client.files.get(name=file_upload.name)
        
    if file_upload.state.name != "ACTIVE":
        print(f"❌ File upload failed with state: {file_upload.state.name}")
        return

    # Import to store
    print(f"Importing file to store...")
    operation = client.file_search_stores.import_file(
        file_search_store_name=store_name,
        file_name=file_upload.name
    )

    # Wait for operation
    while not operation.done:
        time.sleep(2)
        operation = client.operations.get(operation)
        
    print(f"✅ File successfully added to store.")

def delete_store(client, store_name: str):
    """Delete a file search store."""
    print(f"Deleting store '{store_name}'...")
    client.file_search_stores.delete(name=store_name, config={'force': True})
    print(f"✅ Store deleted.")

def main():
    parser = argparse.ArgumentParser(description="Manage Google File Search Stores")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")

    # List command
    subparsers.add_parser("list", help="List all stores")

    # Create command
    create_parser = subparsers.add_parser("create", help="Create a store")
    create_parser.add_argument("--type", choices=["ecommerce", "healthcare"], required=True, help="Type of store to create")

    # Upload command
    upload_parser = subparsers.add_parser("upload", help="Upload a file to a store")
    upload_parser.add_argument("--type", choices=["ecommerce", "healthcare"], required=True, help="Target store type")
    upload_parser.add_argument("--file", required=True, help="Path to file to upload")
    upload_parser.add_argument("--name", help="Display name for the file")

    # Delete command
    delete_parser = subparsers.add_parser("delete", help="Delete a store")
    delete_parser.add_argument("--name", required=True, help="Resource name of the store to delete")

    args = parser.parse_args()

    try:
        client = get_client()
    except ValueError as e:
        print(f"❌ Configuration Error: {e}")
        return

    if args.command == "list":
        list_stores(client)

    elif args.command == "create":
        display_name = ECOMMERCE_STORE_NAME if args.type == "ecommerce" else HEALTHCARE_STORE_NAME
        existing = get_store_by_display_name(client, display_name)
        if existing:
            print(f"⚠️ Store '{display_name}' already exists: {existing.name}")
        else:
            create_store(client, display_name)

    elif args.command == "upload":
        target_display_name = ECOMMERCE_STORE_NAME if args.type == "ecommerce" else HEALTHCARE_STORE_NAME
        store = get_store_by_display_name(client, target_display_name)
        
        if not store:
            print(f"❌ Store '{target_display_name}' not found. Please create it first.")
            return
            
        upload_file(client, store.name, args.file, args.name)

    elif args.command == "delete":
        delete_store(client, args.name)

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
