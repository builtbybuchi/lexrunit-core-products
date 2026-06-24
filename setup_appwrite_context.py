#!/usr/bin/env python3
"""
Appwrite Database setup script for LexCare AI Context Management
Creates the database and collections for healthcare and ecommerce sessions.
"""

import os
import sys
import time
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.exception import AppwriteException

# Add project root to path so the script can import app modules when run directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import get_appwrite_config

# Constants
DATABASE_ID = "website-db"
HEALTHCARE_COLLECTION_ID = "healthcare_sessions"
ECOMMERCE_COLLECTION_ID = "ecommerce_sessions"

def setup_appwrite():
    """Set up Appwrite database and collections."""
    print("Setting up LexCare AI Context Management on Appwrite...")

    try:
        endpoint, project_id, api_key = get_appwrite_config()
        client = Client()
        client.set_endpoint(endpoint)
        client.set_project(project_id)
        client.set_key(api_key)

        databases = Databases(client)

        # 1. Create Database
        try:
            databases.get(DATABASE_ID)
            print(f"✅ Database '{DATABASE_ID}' already exists.")
        except AppwriteException as e:
            if e.code == 404:
                print(f"Creating database '{DATABASE_ID}'...")
                databases.create(DATABASE_ID, "LexCare Context")
                print(f"✅ Database '{DATABASE_ID}' created.")
            else:
                raise e

        # 2. Create Healthcare Collection
        setup_healthcare_collection(databases)

        # 3. Create Ecommerce Collection
        setup_ecommerce_collection(databases)

        print("\n🎉 Appwrite setup completed successfully!")
        return True

    except Exception as e:
        print(f"\n❌ Setup failed: {str(e)}")
        return False

def setup_healthcare_collection(databases):
    """Setup healthcare sessions collection."""
    try:
        databases.get_collection(DATABASE_ID, HEALTHCARE_COLLECTION_ID)
        print(f"✅ Collection '{HEALTHCARE_COLLECTION_ID}' already exists.")
    except AppwriteException as e:
        if e.code == 404:
            print(f"Creating collection '{HEALTHCARE_COLLECTION_ID}'...")
            databases.create_collection(DATABASE_ID, HEALTHCARE_COLLECTION_ID, "Healthcare Sessions")
            print(f"✅ Collection '{HEALTHCARE_COLLECTION_ID}' created.")
            
            # Create Attributes
            print("Creating attributes for healthcare sessions...")
            databases.create_string_attribute(DATABASE_ID, HEALTHCARE_COLLECTION_ID, "session_id", 255, required=True)
            databases.create_string_attribute(DATABASE_ID, HEALTHCARE_COLLECTION_ID, "user_id", 255, required=False)
            databases.create_string_attribute(DATABASE_ID, HEALTHCARE_COLLECTION_ID, "history", 1000000, required=True) # Large string for JSON
            databases.create_string_attribute(DATABASE_ID, HEALTHCARE_COLLECTION_ID, "status", 255, required=True)
            databases.create_string_attribute(DATABASE_ID, HEALTHCARE_COLLECTION_ID, "last_activity", 255, required=True)
            databases.create_string_attribute(DATABASE_ID, HEALTHCARE_COLLECTION_ID, "metadata", 1000000, required=False) # Large string for JSON
            
            # Wait for attributes to be created (Appwrite is async)
            print("Waiting for attributes to be processed...")
            time.sleep(2)

            # Create Indexes
            print("Creating indexes...")
            databases.create_index(DATABASE_ID, HEALTHCARE_COLLECTION_ID, "idx_session_id", "unique", ["session_id"])
            print(f"✅ Attributes and indexes created for '{HEALTHCARE_COLLECTION_ID}'.")
        else:
            raise e

def setup_ecommerce_collection(databases):
    """Setup ecommerce sessions collection."""
    try:
        databases.get_collection(DATABASE_ID, ECOMMERCE_COLLECTION_ID)
        print(f"✅ Collection '{ECOMMERCE_COLLECTION_ID}' already exists.")
    except AppwriteException as e:
        if e.code == 404:
            print(f"Creating collection '{ECOMMERCE_COLLECTION_ID}'...")
            databases.create_collection(DATABASE_ID, ECOMMERCE_COLLECTION_ID, "Ecommerce Sessions")
            print(f"✅ Collection '{ECOMMERCE_COLLECTION_ID}' created.")
            
            # Create Attributes
            print("Creating attributes for ecommerce sessions...")
            databases.create_string_attribute(DATABASE_ID, ECOMMERCE_COLLECTION_ID, "user_id", 255, required=True)
            databases.create_string_attribute(DATABASE_ID, ECOMMERCE_COLLECTION_ID, "seller_id", 255, required=True)
            databases.create_string_attribute(DATABASE_ID, ECOMMERCE_COLLECTION_ID, "product_name", 255, required=True)
            databases.create_float_attribute(DATABASE_ID, ECOMMERCE_COLLECTION_ID, "actual_price", required=True)
            databases.create_float_attribute(DATABASE_ID, ECOMMERCE_COLLECTION_ID, "target_price", required=True)
            databases.create_float_attribute(DATABASE_ID, ECOMMERCE_COLLECTION_ID, "last_price", required=True)
            databases.create_string_attribute(DATABASE_ID, ECOMMERCE_COLLECTION_ID, "history", 1000000, required=True)
            databases.create_string_attribute(DATABASE_ID, ECOMMERCE_COLLECTION_ID, "status", 255, required=False)
            databases.create_string_attribute(DATABASE_ID, ECOMMERCE_COLLECTION_ID, "last_activity", 255, required=True)
            
            # Wait for attributes
            print("Waiting for attributes to be processed...")
            time.sleep(2)

            # Create Indexes
            print("Creating indexes...")
            databases.create_index(DATABASE_ID, ECOMMERCE_COLLECTION_ID, "idx_negotiation", "key", ["user_id", "seller_id", "product_name"])
            print(f"✅ Attributes and indexes created for '{ECOMMERCE_COLLECTION_ID}'.")
        else:
            raise e

if __name__ == "__main__":
    setup_appwrite()
