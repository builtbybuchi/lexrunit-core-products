import logging
from typing import Optional, List
from google import genai
from google.genai import types
from app.core.config import get_google_genai_config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Store names (must match those in upload_google_files.py)
ECOMMERCE_STORE_NAME = "ecommerce-knowledge-store"
HEALTHCARE_STORE_NAME = "healthcare-knowledge-store"

class GoogleRAGService:
    """
    Service to handle RAG using Google File Search.
    """
    
    def __init__(self):
        try:
            self.api_key = get_google_genai_config()
            self.client = genai.Client(api_key=self.api_key)
            self.model_name = "gemini-2.0-flash-exp" # Using a capable model
            self._ecommerce_store = None
            self._healthcare_store = None
        except Exception as e:
            logger.error(f"Failed to initialize GoogleRAGService: {e}")
            self.client = None

    def _get_store_by_display_name(self, display_name: str):
        """Find a store by its display name."""
        if not self.client:
            return None
            
        try:
            for store in self.client.file_search_stores.list():
                if store.display_name == display_name:
                    return store
        except Exception as e:
            logger.error(f"Error listing stores: {e}")
        return None

    @property
    def ecommerce_store(self):
        if not self._ecommerce_store:
            self._ecommerce_store = self._get_store_by_display_name(ECOMMERCE_STORE_NAME)
        return self._ecommerce_store

    @property
    def healthcare_store(self):
        if not self._healthcare_store:
            self._healthcare_store = self._get_store_by_display_name(HEALTHCARE_STORE_NAME)
        return self._healthcare_store

    def generate_content(self, query: str, context_type: str = "healthcare", system_instruction: Optional[str] = None, history: Optional[List[dict]] = None) -> str:
        """
        Generate content using RAG based on the context type.
        
        Args:
            query: The user's question.
            context_type: 'healthcare' or 'ecommerce'.
            system_instruction: Optional system instruction.
            history: Optional chat history (list of dicts with 'role' and 'content').
            
        Returns:
            str: The generated response.
        """
        if not self.client:
            return "Error: Google GenAI client not initialized."

        store = None
        if context_type == "ecommerce":
            store = self.ecommerce_store
        elif context_type == "healthcare":
            store = self.healthcare_store
        
        tools = []
        if store:
            logger.info(f"Using file search store: {store.display_name} ({store.name})")
            tools = [
                types.Tool(
                    file_search=types.FileSearch(
                        file_search_store_names=[store.name]
                    )
                )
            ]
        else:
            logger.warning(f"No file search store found for context: {context_type}")

        # Prepare contents from history
        contents = []
        if history:
            for msg in history:
                role = "user" if msg["role"] == "user" else "model"
                contents.append(types.Content(role=role, parts=[types.Part(text=msg["content"])]))
        
        # Add current query
        contents.append(types.Content(role="user", parts=[types.Part(text=query)]))

        config = types.GenerateContentConfig(
            tools=tools,
            system_instruction=system_instruction
        )

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=contents,
                config=config
            )
            return response.text
        except Exception as e:
            logger.error(f"Error generating content: {e}")
            return f"Error generating response: {str(e)}"

# Global instance
_google_rag_service = None

def get_google_rag_service() -> GoogleRAGService:
    global _google_rag_service
    if _google_rag_service is None:
        _google_rag_service = GoogleRAGService()
    return _google_rag_service
