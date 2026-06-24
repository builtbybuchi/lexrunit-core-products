#!/usr/bin/env python3
"""
Test script for Chat Integration with RAG.
Simulates a call to call_groq_with_context to ensure it doesn't crash.
"""
import os
import sys
from unittest.mock import MagicMock, patch

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# Mock environment variables before importing app modules
os.environ["GROQ_API_KEY"] = "mock_key"
os.environ["SUPABASE_URL"] = "https://mock.supabase.co"
os.environ["SUPABASE_KEY"] = "mock_key"
os.environ["GOOGLE_API_KEY"] = "mock_key"

# Mock dependencies that might require network or valid keys
import app.utils.common # Ensure module is loaded
with patch("app.services.rag_system.get_medical_context") as mock_rag, \
     patch("app.utils.common.call_groq") as mock_groq, \
     patch("app.services.context_manager.ContextManager.update_session_history") as mock_update, \
     patch("app.services.context_manager.ContextManager.build_prompt_with_context") as mock_build_prompt:
    
    # Setup mocks
    mock_rag.return_value = "Diabetes is a chronic condition."
    mock_groq.return_value = "Based on the medical knowledge, diabetes is..."
    mock_build_prompt.return_value = [{"role": "system", "content": "You are a doctor."}]
    
    from app.utils.common import call_groq_with_context
    
    print("Testing call_groq_with_context...")
    try:
        response = call_groq_with_context("test_session", "What is diabetes?", "chat_patient")
        print(f"Response: {response}")
        print("✅ call_groq_with_context executed successfully.")
        
        # Verify RAG was called
        mock_rag.assert_called_once_with(query="What is diabetes?")
        print("✅ get_medical_context called correctly.")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
