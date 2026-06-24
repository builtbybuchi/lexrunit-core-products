#!/usr/bin/env python3
"""
Test script for Google File Search RAG.
"""
import os
import sys
import argparse

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.services.rag_system import get_rag_system

def main():
    parser = argparse.ArgumentParser(description="Test Google File Search RAG")
    parser.add_argument("--type", choices=["healthcare", "ecommerce"], default="healthcare", help="Store type to test")
    parser.add_argument("--query", required=True, help="Query to ask")
    
    args = parser.parse_args()
    
    print(f"Testing {args.type} RAG with query: '{args.query}'")
    
    rag = get_rag_system(args.type)
    
    # Check health
    health = rag.health_check()
    print(f"Health Check: {health}")
    
    if health["status"] != "healthy":
        print("⚠️ Store not found or not configured. Please use 'scripts/upload_google_files.py' to create the store and upload files.")
        return

    # Query
    print("\nQuerying...")
    response = rag.query(args.query)
    print("\nResponse:")
    print("-" * 50)
    print(response)
    print("-" * 50)

if __name__ == "__main__":
    main()
