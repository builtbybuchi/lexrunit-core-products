# Google File Search RAG Guide

This guide explains how to use the Google File Search RAG system in LexCare AI.

## Overview

The system uses Google's GenAI File Search (formerly AQA) to provide accurate answers based on uploaded documents. It supports two separate knowledge stores:
- **Healthcare**: For medical guidelines, protocols, and research.
- **Ecommerce**: For product information, policies, and inventory.

## Prerequisites

Ensure you have the `GOOGLE_API_KEY` set in your `.env` file.

## Managing Knowledge Stores

Use the `scripts/upload_google_files.py` script to manage your stores and files.

### 1. List Stores
Check existing stores:
```bash
python scripts/upload_google_files.py list
```

### 2. Create a Store
If a store doesn't exist, create it:
```bash
# For Healthcare
python scripts/upload_google_files.py create --type healthcare

# For Ecommerce
python scripts/upload_google_files.py create --type ecommerce
```

### 3. Upload Files
Upload PDF or text files to the appropriate store:
```bash
# Upload a medical guideline
python scripts/upload_google_files.py upload --type healthcare --file /path/to/guideline.pdf --name "Clinical Guideline 2024"

# Upload a product manual
python scripts/upload_google_files.py upload --type ecommerce --file /path/to/manual.pdf --name "Product Manual"
```

### 4. Delete a Store (Caution!)
```bash
python scripts/upload_google_files.py delete --name projects/YOUR_PROJECT/locations/us/corpora/YOUR_STORE_ID
```

## Testing the RAG System

You can test the RAG system using the provided test script:

```bash
# Test Healthcare RAG
python scripts/test_scripts/test_google_rag.py --type healthcare --query "What is the protocol for diabetes management?"

# Test Ecommerce RAG
python scripts/test_scripts/test_google_rag.py --type ecommerce --query "What is the return policy?"
```

## Integration in Code

To use the RAG system in your application code:

```python
from app.services.rag_system import get_rag_system

# Get the healthcare RAG system
rag = get_rag_system("healthcare")
answer = rag.query("Your medical question here")

# Get the ecommerce RAG system
rag = get_rag_system("ecommerce")
answer = rag.query("Your product question here")
```
python scripts/upload_google_files.py upload --type healthcare --file "/home/buchi/projects/lexcare_ai2/scripts/Harrison_s Principles of Internal Medicine.pdf" --name "Harrison's Principles of Internal Medicine"


