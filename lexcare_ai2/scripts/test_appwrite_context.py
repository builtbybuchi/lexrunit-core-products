#!/usr/bin/env python3
"""
Test script for Appwrite Context Management
"""

import sys
import uuid
import time
from app.services.context_manager import ContextManager

def test_healthcare_session():
    print("\n🧪 Testing Healthcare Session...")
    session_id = str(uuid.uuid4())
    print(f"Creating session: {session_id}")
    
    try:
        # Create
        ContextManager.create_session(session_id, "test_health")
        print("✅ Session created")
        
        # Retrieve
        session = ContextManager.get_session(session_id)
        if session and session["session_id"] == session_id:
            print("✅ Session retrieved")
        else:
            print("❌ Session retrieval failed")
            return False
            
        # Update History
        ContextManager.update_session_history(session_id, "Hello", "Hi there")
        print("✅ History updated")
        
        # Verify History
        history = ContextManager.get_conversation_history(session_id)
        if len(history) == 2:
            print("✅ History verified")
        else:
            print(f"❌ History verification failed: {len(history)}")
            return False
            
        return True
    except Exception as e:
        print(f"❌ Healthcare test failed: {str(e)}")
        return False

def test_ecommerce_session():
    print("\n🧪 Testing Ecommerce Session...")
    user_id = f"user_{uuid.uuid4()}"
    seller_id = "seller_123"
    product_name = "Test Product"
    
    try:
        # Create/Update
        history = [{"role": "system", "content": "init"}]
        ContextManager.create_or_update_ecommerce_session(
            user_id, seller_id, product_name,
            100.0, 80.0, 90.0, history
        )
        print("✅ Session created/updated")
        
        # Retrieve
        session = ContextManager.get_ecommerce_session(user_id, seller_id, product_name)
        if session and session["user_id"] == user_id:
            print("✅ Session retrieved")
        else:
            print("❌ Session retrieval failed")
            return False
            
        return True
    except Exception as e:
        print(f"❌ Ecommerce test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("Starting Appwrite Context Tests...")
    
    if test_healthcare_session() and test_ecommerce_session():
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n❌ Tests failed!")
        sys.exit(1)
