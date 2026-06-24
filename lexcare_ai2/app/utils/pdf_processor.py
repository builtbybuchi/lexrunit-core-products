"""
DEPRECATED: This module has been replaced by rag_system.py
The new RAG system uses Chroma database instead of FAISS for better performance.

Use rag_system.get_medical_context(query) for retrieving medical knowledge.
"""

import warnings
from rag_system import get_medical_context

def retrieve_context(query, index_path="vector_index"):
    """
    DEPRECATED: Use rag_system.get_medical_context() instead.
    This function is kept for backward compatibility.
    """
    warnings.warn(
        "retrieve_context() is deprecated. Use rag_system.get_medical_context() instead.",
        DeprecationWarning,
        stacklevel=2
    )
    return get_medical_context(query)

def load_and_index_pdfs(folder_path="medical_documents", index_path="vector_index"):
    """
    DEPRECATED: PDFs should now be processed using Chroma database.
    See medical_text_indexing.ipynb for the current indexing process.
    """
    warnings.warn(
        "load_and_index_pdfs() is deprecated. Use Chroma database for indexing.",
        DeprecationWarning,
        stacklevel=2
    )
    print("This function is deprecated. PDFs should be indexed using Chroma database.")
    print("Please refer to medical_text_indexing.ipynb for the current process.")
