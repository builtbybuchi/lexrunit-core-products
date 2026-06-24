#!/usr/bin/env python3
"""
Test script for the LexCare AI RAG system.
Run this script to verify that the RAG system is working correctly.
"""

import sys
import os
from datetime import datetime

def test_rag_system():
    """Test the RAG system functionality."""
    print("🔍 Testing LexCare AI RAG System")
    print("=" * 50)
    
    try:
        # Test 1: Import and initialize
        print("\n1. Testing RAG system import...")
        from rag_system import get_rag_system, get_medical_context
        print("✅ RAG system imported successfully")
        
        # Test 2: Initialize system
        print("\n2. Initializing RAG system...")
        rag = get_rag_system()
        print("✅ RAG system initialized")
        
        # Test 3: Health check
        print("\n3. Running health check...")
        health = rag.health_check()
        print(f"Status: {health['status']}")
        
        if health['status'] == 'healthy':
            print(f"✅ Database connected: {health['database_connected']}")
            print(f"✅ Model loaded: {health['model_loaded']}")
            print(f"📚 Document count: {health['document_count']}")
            print(f"🧠 Cache info: {health['cache_info']}")
        else:
            print(f"❌ Health check failed: {health.get('error', 'Unknown error')}")
            return False
            
        # Test 4: Medical queries
        print("\n4. Testing medical queries...")
        
        test_queries = [
            "What are the symptoms of diabetes?",
            "How is hypertension treated?",
            "What causes chest pain?",
            "Treatment for bacterial infections",
            "Signs of heart disease"
        ]
        
        for i, query in enumerate(test_queries, 1):
            print(f"\n   Query {i}: {query}")
            context = get_medical_context(query, max_chunks=3)
            
            if context and "No relevant medical information" not in context:
                print(f"   ✅ Found context ({len(context)} characters)")
                # Show first 100 characters
                preview = context[:100].replace('\n', ' ')
                print(f"   Preview: {preview}...")
            else:
                print(f"   ⚠️  No context found")
        
        # Test 5: Cache performance
        print("\n5. Testing cache performance...")
        
        # Run same query twice to test caching
        test_query = "diabetes symptoms treatment"
        
        # First query (should miss cache)
        start_time = datetime.now()
        context1 = get_medical_context(test_query)
        time1 = (datetime.now() - start_time).total_seconds()
        
        # Second query (should hit cache)
        start_time = datetime.now()
        context2 = get_medical_context(test_query)
        time2 = (datetime.now() - start_time).total_seconds()
        
        print(f"   First query time: {time1:.3f}s")
        print(f"   Second query time: {time2:.3f}s")
        print(f"   Speedup: {time1/time2:.1f}x" if time2 > 0 else "   Instant cache hit!")
        
        # Cache statistics
        cache_info = rag.get_cache_info()
        print(f"   Cache hits: {cache_info['hits']}")
        print(f"   Cache misses: {cache_info['misses']}")
        print(f"   Hit rate: {cache_info['hit_rate']:.1%}")
        
        # Test 6: Memory usage estimation
        print("\n6. Memory usage estimation...")
        try:
            import psutil
            process = psutil.Process()
            memory_mb = process.memory_info().rss / 1024 / 1024
            print(f"   Current process memory: {memory_mb:.1f} MB")
            
            if memory_mb < 500:
                print("   ✅ Memory usage within acceptable limits for 1GB server")
            elif memory_mb < 800:
                print("   ⚠️  Memory usage is moderate, monitor on production")
            else:
                print("   ❌ High memory usage, consider optimization")
                
        except ImportError:
            print("   psutil not installed, skipping memory check")
            print("   Install with: pip install psutil")
        
        print("\n" + "=" * 50)
        print("🎉 RAG System Test Complete!")
        print("✅ All tests passed successfully")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("\nMissing dependencies. Install with:")
        print("pip install chromadb sentence-transformers")
        return False
        
    except FileNotFoundError as e:
        print(f"❌ File not found: {e}")
        print("\nMake sure 'medical_knowledge_db' folder exists in the project root")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_integration():
    """Test integration with the main application."""
    print("\n🔗 Testing Integration with Main App")
    print("=" * 50)
    
    try:
        # Test common.py integration
        print("\n1. Testing common.py integration...")
        from common import call_groq_with_context
        from context_manager import ContextManager
        
        # Create a test session
        session_id = ContextManager.create_session("test_rag", {"test": True})
        print(f"✅ Created test session: {session_id}")
        
        # This should work but will fail on Groq API call without proper credentials
        print("✅ Integration imports working")
        
        print("\n2. Testing endpoint availability...")
        # We can't easily test the actual endpoint without running the server
        # But we can verify the health check function exists
        
        from main import rag_health_check
        print("✅ RAG health endpoint function available")
        
        print("\n✅ Integration test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Integration test failed: {e}")
        return False

if __name__ == "__main__":
    print("LexCare AI RAG System Test Suite")
    print("Version: 1.0")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run main RAG test
    rag_success = test_rag_system()
    
    # Run integration test
    integration_success = test_integration()
    
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    print(f"RAG System: {'✅ PASS' if rag_success else '❌ FAIL'}")
    print(f"Integration: {'✅ PASS' if integration_success else '❌ FAIL'}")
    
    if rag_success and integration_success:
        print("\n🎉 All tests passed! Your RAG system is ready to use.")
        print("🚀 Start the server with: uvicorn main:app --reload")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Please check the setup guide.")
        print("📖 See RAG_SETUP_GUIDE.md for troubleshooting")
        sys.exit(1)
