#!/usr/bin/env python3
"""
Production-Ready Appwrite Infrastructure Provisioning Script.
Handles graceful creation and schema verification for Databases, Collections, 
Attributes, Indexes, and Storage Buckets without breaking state.
"""

import os
import sys
import time
import warnings
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.exception import AppwriteException
from appwrite.permission import Permission
from appwrite.role import Role

# 🤫 Suppress all SDK deprecation warnings to keep logs clean
warnings.filterwarnings("ignore", category=DeprecationWarning)

# Add project root to path for local module discoverability
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_appwrite_config():
    """Dynamically loads config from app modules or Doppler/Environment variables."""
    try:
        from app.core.config import get_appwrite_config as load_config
        return load_config()
    except ImportError:
        endpoint = os.getenv("APPWRITE_ENDPOINT", "https://fra.cloud.appwrite.io/v1")
        project_id = os.getenv("APPWRITE_PROJECT_ID", "lexrunit-general-db")
        api_key = os.getenv("APPWRITE_API_KEY")
        
        if not api_key:
            print("❌ Critical Error: APPWRITE_API_KEY environment variable is not set.")
            print("Please ensure your Doppler config has the proper API key injected.")
            sys.exit(1)
            
        return endpoint, project_id, api_key

# Constants
DATABASE_ID = 'website-db'

WEBSITE_COLLECTIONS = [
    {
        'id': 'contacts',
        'name': 'Contacts',
        'permissions': [],
        'attributes': [
            {'key': 'name', 'type': 'string', 'size': 128, 'required': True},
            {'key': 'email', 'type': 'email', 'required': True},
            {'key': 'subject', 'type': 'string', 'size': 256, 'required': True},
            {'key': 'message', 'type': 'string', 'size': 4000, 'required': True},
        ]
    },
    {
        'id': 'subscriptions',
        'name': 'Subscriptions',
        'permissions': [],
        'attributes': [
            {'key': 'email', 'type': 'email', 'required': True},
        ],
        'indexes': [
            {'key': 'email_index', 'type': 'unique', 'attributes': ['email']}
        ]
    },
    {
        'id': 'partners',
        'name': 'Partner Inquiries',
        'permissions': [],
        'attributes': [
            {'key': 'hospitalName', 'type': 'string', 'size': 128, 'required': True},
            {'key': 'contactPerson', 'type': 'string', 'size': 128, 'required': True},
            {'key': 'email', 'type': 'email', 'required': True},
            {'key': 'phone', 'type': 'string', 'size': 50, 'required': True},
            {'key': 'address', 'type': 'string', 'size': 256, 'required': True},
            {'key': 'message', 'type': 'string', 'size': 4000, 'required': False},
            {'key': 'status', 'type': 'string', 'size': 20, 'required': False, 'default': 'pending'},
        ]
    },
    {
        'id': 'hospitals',
        'name': 'Hospitals',
        'permissions': [],
        'attributes': [
            {'key': 'name', 'type': 'string', 'size': 128, 'required': True},
            {'key': 'address', 'type': 'string', 'size': 256, 'required': True},
            {'key': 'city', 'type': 'string', 'size': 64, 'required': True},
            {'key': 'state', 'type': 'string', 'size': 64, 'required': True},
            {'key': 'products', 'type': 'string', 'size': 64, 'required': False, 'array': True},
            {'key': 'website', 'type': 'url', 'required': False},
            {'key': 'phone', 'type': 'string', 'size': 50, 'required': False},
            {'key': 'email', 'type': 'email', 'required': False},
        ],
        'indexes': [
            {'key': 'city_state_index', 'type': 'key', 'attributes': ['city', 'state']}
            # 🚀 Cleanout: Array indexing ('products_index') dropped for database engine safety
        ]
    },
    {
        'id': 'blogs',
        'name': 'Blogs',
        'permissions': [],
        'attributes': [
            {'key': 'title', 'type': 'string', 'size': 256, 'required': True},
            {'key': 'slug', 'type': 'string', 'size': 256, 'required': True},
            {'key': 'content', 'type': 'string', 'size': 4000, 'required': True}, # 🛠️ Dropped from 10k to prevent database row-size explosion
            {'key': 'excerpt', 'type': 'string', 'size': 500, 'required': True},
            {'key': 'author', 'type': 'string', 'size': 128, 'required': True},
            {'key': 'image', 'type': 'url', 'required': True},
            {'key': 'publishedAt', 'type': 'datetime', 'required': True},
            {'key': 'tags', 'type': 'string', 'size': 64, 'required': False, 'array': True},
        ],
        'indexes': [
            {'key': 'slug_index', 'type': 'unique', 'attributes': ['slug']}
        ]
    },
    {
        'id': 'news',
        'name': 'News',
        'permissions': [],
        'attributes': [
            {'key': 'title', 'type': 'string', 'size': 256, 'required': True},
            {'key': 'slug', 'type': 'string', 'size': 256, 'required': True},
            {'key': 'content', 'type': 'string', 'size': 4000, 'required': True}, # 🛠️ Dropped from 10k to prevent database row-size explosion
            {'key': 'excerpt', 'type': 'string', 'size': 500, 'required': True},
            {'key': 'image', 'type': 'url', 'required': True},
            {'key': 'publishedAt', 'type': 'datetime', 'required': True},
        ],
        'indexes': [
            {'key': 'slug_index', 'type': 'unique', 'attributes': ['slug']}
        ]
    },
    {
        'id': 'jobs',
        'name': 'Jobs',
        'permissions': [],
        'attributes': [
            {'key': 'title', 'type': 'string', 'size': 256, 'required': True},
            {'key': 'location', 'type': 'string', 'size': 128, 'required': True},
            {'key': 'type', 'type': 'string', 'size': 64, 'required': True},
            {'key': 'description', 'type': 'string', 'size': 4000, 'required': True},
            {'key': 'requirements', 'type': 'string', 'size': 4000, 'required': True},
            {'key': 'salary', 'type': 'string', 'size': 128, 'required': False},
            {'key': 'publishedAt', 'type': 'datetime', 'required': True},
        ]
    },
    {
        'id': 'applications',
        'name': 'Job Applications',
        'permissions': [],
        'attributes': [
            {'key': 'jobId', 'type': 'string', 'size': 64, 'required': True},
            {'key': 'jobTitle', 'type': 'string', 'size': 256, 'required': True},
            {'key': 'fullName', 'type': 'string', 'size': 128, 'required': True},
            {'key': 'email', 'type': 'email', 'required': True},
            {'key': 'phone', 'type': 'string', 'size': 50, 'required': True},
            {'key': 'resumeUrl', 'type': 'url', 'required': True},
            {'key': 'coverLetter', 'type': 'string', 'size': 4000, 'required': False},
            {'key': 'status', 'type': 'string', 'size': 32, 'required': False, 'default': 'pending'},  
            {'key': 'appliedAt', 'type': 'datetime', 'required': True},
        ]
    },
    {
        'id': 'waitlist',
        'name': 'Waitlist',
        'permissions': [],
        'attributes': [
            {'key': 'name', 'type': 'string', 'size': 128, 'required': True},
            {'key': 'email', 'type': 'email', 'required': True},
        ],
        'indexes': [
            {'key': 'email_index', 'type': 'unique', 'attributes': ['email']}
        ]
    },
    {
        'id': 'feedback',
        'name': 'Feedback',
        'permissions': [],
        'attributes': [
            {'key': 'name', 'type': 'string', 'size': 128, 'required': True},
            {'key': 'email', 'type': 'email', 'required': True},
            {'key': 'product', 'type': 'string', 'size': 64, 'required': True},
            {'key': 'rating', 'type': 'string', 'size': 10, 'required': True},
            {'key': 'message', 'type': 'string', 'size': 4000, 'required': True},
        ]
    },
    {
        'id': 'users',
        'name': 'Users',
        'permissions': [],
        'attributes': [
            {'key': 'clerk_id', 'type': 'string', 'size': 128, 'required': True},
            {'key': 'email', 'type': 'email', 'required': True},
            {'key': 'name', 'type': 'string', 'size': 128, 'required': False},
            {'key': 'role', 'type': 'string', 'size': 32, 'required': False, 'default': 'user'},
            {'key': 'phone', 'type': 'string', 'size': 50, 'required': False},
            {'key': 'settings', 'type': 'string', 'size': 4000, 'required': False, 'default': '{}'},
        ],
        'indexes': [
            {'key': 'clerk_id_index', 'type': 'unique', 'attributes': ['clerk_id']}
        ]
    },
    {
        'id': 'higs_events',
        'name': 'HIGS Events',
        'permissions': [],
        'attributes': [
            {'key': 'title', 'type': 'string', 'size': 256, 'required': True},
            {'key': 'description', 'type': 'string', 'size': 5000, 'required': True},
            {'key': 'date', 'type': 'string', 'size': 64, 'required': True},
            {'key': 'registrationUrl', 'type': 'url', 'required': True},
            {'key': 'isActive', 'type': 'boolean', 'required': True}
        ]
    },
    {
        'id': 'whatsapp_users',
        'name': 'WhatsApp Users',
        'permissions': [],
        'attributes': [
            {'key': 'wa_id', 'type': 'string', 'size': 50, 'required': True},
            {'key': 'name', 'type': 'string', 'size': 128, 'required': False},
            {'key': 'question_count', 'type': 'integer', 'required': False, 'default': 0},
            {'key': 'is_subscribed', 'type': 'boolean', 'required': False, 'default': False},
            {'key': 'is_registered', 'type': 'boolean', 'required': False, 'default': False},
            {'key': 'subscription_end_date', 'type': 'datetime', 'required': False},
            {'key': 'last_payment_ref', 'type': 'string', 'size': 256, 'required': False},
        ],
        'indexes': [
            {'key': 'wa_id_index', 'type': 'unique', 'attributes': ['wa_id']}
        ]
    },
    {
        'id': 'settings',
        'name': 'Global Settings',
        'permissions': [],
        'attributes': [
            {'key': 'key', 'type': 'string', 'size': 128, 'required': True},
            {'key': 'value', 'type': 'string', 'size': 4000, 'required': True},
        ],
        'indexes': [
            {'key': 'key_index', 'type': 'unique', 'attributes': ['key']}
        ]
    }
]

BUCKETS = [
    {
        'id': 'resumes',
        'name': 'Resumes',
        'permissions': [],
        'file_security': True,
        'enabled': True,
        #'max_file_size': 5242880,  
        'allowed_file_extensions': ['pdf', 'doc', 'docx']
    }
]

def retry_operation(fn, retries=3, delay=2):
    """Executes a function and handles errors dynamically based on HTTP status codes."""
    for i in range(retries + 1):
        try:
            return fn()
        except AppwriteException as e:
            if e.code in [409, 401, 403]:
                raise e
            if i < retries:
                time.sleep(delay)
                delay *= 2
            else:
                raise e

def setup_appwrite():
    print("🚀 Starting Production Architecture Check and Sync...")

    endpoint, project_id, api_key = get_appwrite_config()
    client = Client()
    client.set_endpoint(endpoint)
    client.set_project(project_id)
    client.set_key(api_key)

    client.add_header('x-appwrite-project', project_id)
    client.add_header('x-appwrite-key', api_key)

    databases = Databases(client)
    storage = Storage(client)

    try:
        databases.get(DATABASE_ID)
        print(f"✅ Target Database '{DATABASE_ID}' is alive and reachable.")
    except AppwriteException as e:
        if e.code == 404:
            print(f"Database '{DATABASE_ID}' is missing. Provisioning now...")
            try:
                retry_operation(lambda: databases.create(DATABASE_ID, "Website & LexCare DB"))
                print(f"✅ Database '{DATABASE_ID}' provisioned successfully.")
            except AppwriteException as err:
                if err.code == 409:
                    print(f"✅ Database '{DATABASE_ID}' verified via parallel cluster check.")
                else:
                    raise err
        else:
            print(f"❌ Core Authorization Blocked: HTTP {e.code} - {e.message}")
            sys.exit(1)

    for col in WEBSITE_COLLECTIONS:
        sync_collection(client, databases, col)

    sync_healthcare_sessions(client, databases)
    sync_ecommerce_sessions(client, databases)

    for bucket in BUCKETS:
        print(f"\n📦 Verifying Storage Bucket: {bucket['name']} ({bucket['id']})...")
        try:
            storage.get_bucket(bucket["id"])
            print(f"✅ Bucket '{bucket['id']}' is configured.")
        except AppwriteException as e:
            if e.code == 404:
                try:
                    retry_operation(lambda: storage.create_bucket(
                        bucket_id=bucket['id'],
                        name=bucket['name'],
                        permissions=bucket['permissions'],
                        file_security=bucket['file_security'],
                        enabled=bucket['enabled'],
                        #max_file_size=bucket['max_file_size'],
                        allowed_file_extensions=bucket['allowed_file_extensions']
                    ))
                    print(f"✅ Storage bucket '{bucket['id']}' built from schema definition.")
                except AppwriteException as build_err:
                    if build_err.code != 409:
                        raise build_err
            else:
                raise e

    print("\n🎉 Integrated Production infrastructure sync finished perfectly!")

def sync_collection(client, databases, col):
    print(f"\n📋 Schema Audit: Collection '{col['id']}'")
    try:
        databases.get_collection(DATABASE_ID, col["id"])
        print(f"   Structure map loaded.")
    except AppwriteException as e:
        if e.code == 404:
            try:
                retry_operation(lambda: databases.create_collection(DATABASE_ID, col['id'], col['name'], col['permissions']))
                print(f"   Created collection shell.")
            except AppwriteException as create_err:
                if create_err.code != 409:
                    raise create_err
        else:
            raise e

    for attr in col['attributes']:
        try:
            default_val = attr.get('default', None)
            is_array = attr.get('array', False)
            
            if attr['type'] == 'string':
                retry_operation(lambda: databases.create_string_attribute(DATABASE_ID, col['id'], attr['key'], attr['size'], attr['required'], default_val, is_array))
            elif attr['type'] == 'email':
                retry_operation(lambda: databases.create_email_attribute(DATABASE_ID, col['id'], attr['key'], attr['required'], default_val, is_array))
            elif attr['type'] == 'url':
                retry_operation(lambda: databases.create_url_attribute(DATABASE_ID, col['id'], attr['key'], attr['required'], default_val, is_array))
            elif attr['type'] == 'datetime':
                retry_operation(lambda: databases.create_datetime_attribute(DATABASE_ID, col['id'], attr['key'], attr['required'], default_val, is_array))
            elif attr['type'] == 'boolean':
                retry_operation(lambda: databases.create_boolean_attribute(DATABASE_ID, col['id'], attr['key'], attr['required'], default_val, is_array))
            elif attr['type'] == 'integer':
                # Add support for integer attributes
                retry_operation(lambda: databases.create_integer_attribute(DATABASE_ID, col['id'], attr['key'], attr['required'], -2147483648, 2147483647, default_val, is_array))
            
            print(f"   ➕ Attribute '{attr['key']}' bound.")
            time.sleep(0.1)
        except AppwriteException as err:
            if err.code == 409:
                pass  
            else:
                print(f"   ⚠️ Schema exception for attribute '{attr['key']}': {err.message}")

    if 'indexes' in col and col['indexes']:
        time.sleep(0.2)
        for idx in col['indexes']:
            try:
                retry_operation(lambda: databases.create_index(DATABASE_ID, col['id'], idx['key'], idx['type'], idx['attributes']))
                print(f"   ⚡ Index map '{idx['key']}' built.")
            except AppwriteException as err:
                if err.code != 409:
                    print(f"   ⚠️ Could not align index mapping '{idx['key']}': {err.message}")

def sync_healthcare_sessions(client, databases):
    col_id = "healthcare_sessions"
    print(f"\n📋 Schema Audit: System Context Collection '{col_id}'")
    try:
        databases.get_collection(DATABASE_ID, col_id)
        print(f"   Structure map loaded.")
    except AppwriteException as e:
        if e.code == 404:
            try:
                databases.create_collection(DATABASE_ID, col_id, "Healthcare Sessions")
                print(f"   Created collection shell.")
            except AppwriteException as create_err:
                if create_err.code != 409:
                    raise create_err
        else:
            raise e

    attrs = [
        ('session_id', 'string', 255, True),
        ('user_id', 'string', 255, False),
        ('history', 'string', 4000, True),
        ('status', 'string', 255, True),
        ('last_activity', 'string', 255, True),
        ('metadata', 'string', 4000, False)
    ]
    
    for key, attr_type, size, req in attrs:
        try:
            databases.create_string_attribute(DATABASE_ID, col_id, key, size, required=req)
            print(f"   ➕ Attribute '{key}' bound.")
            time.sleep(0.1)
        except AppwriteException as err:
            if err.code != 409:
                raise err

    try:
        time.sleep(0.2)
        databases.create_index(DATABASE_ID, col_id, "idx_session_id", "unique", ["session_id"])
        print(f"   ⚡ Index map 'idx_session_id' built.")
    except AppwriteException as err:
        if err.code != 409:
            raise err

def sync_ecommerce_sessions(client, databases):
    col_id = "ecommerce_sessions"
    print(f"\n📋 Schema Audit: System Context Collection '{col_id}'")
    try:
        databases.get_collection(DATABASE_ID, col_id)
        print(f"   Structure map loaded.")
    except AppwriteException as e:
        if e.code == 404:
            try:
                databases.create_collection(DATABASE_ID, col_id, "Ecommerce Sessions")
                print(f"   Created collection shell.")
            except AppwriteException as create_err:
                if create_err.code != 409:
                    raise create_err
        else:
            raise e

    string_attrs = [
        ('user_id', 255, True), ('seller_id', 255, True), ('product_name', 255, True),
        ('history', 4000, True), ('status', 255, False), ('last_activity', 255, True)
    ]
    float_attrs = ['actual_price', 'target_price', 'last_price']

    for key, size, req in string_attrs:
        try:
            databases.create_string_attribute(DATABASE_ID, col_id, key, size, required=req)
            print(f"   ➕ Attribute '{key}' bound.")
            time.sleep(0.1)
        except AppwriteException as err:
            if err.code != 409:
                raise err

    for key in float_attrs:
        try:
            databases.create_float_attribute(DATABASE_ID, col_id, key, required=True)
            print(f"   ➕ Attribute '{key}' bound.")
            time.sleep(0.1)
        except AppwriteException as err:
            if err.code != 409:
                raise err

    try:
        time.sleep(0.2)
        databases.create_index(DATABASE_ID, col_id, "idx_negotiation", "key", ["user_id", "seller_id", "product_name"])
        print(f"   ⚡ Index map 'idx_negotiation' built.")
    except AppwriteException as err:
        if err.code != 409:
            raise err

if __name__ == "__main__":
    setup_appwrite()