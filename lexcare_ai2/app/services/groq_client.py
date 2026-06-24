"""
Groq API client service
"""
import os
import requests
from typing import List, Dict
from dotenv import load_dotenv
from fastapi import HTTPException

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_EMBED_URL = "https://api.groq.com/openai/v1/embeddings"


class GroqClient:
    """Client for interacting with Groq API"""
    
    def __init__(self):
        self.api_key = GROQ_API_KEY
        self.chat_url = GROQ_API_URL
        self.embed_url = GROQ_EMBED_URL
        
        if not self.api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
    
    def chat_completion(self, model: str, messages: List[Dict]) -> str:
        """
        Call Groq chat completion API
        
        Args:
            model: Model name (e.g., "llama-3.1-8b-instant")
            messages: List of message dictionaries
            
        Returns:
            str: AI response content
        """
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {"model": model, "messages": messages}
        
        response = requests.post(self.chat_url, json=payload, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"Groq API Error: {response.text}"
            )
        
        return response.json()["choices"][0]["message"]["content"]
    
    def get_embedding(self, model: str, inputs: List[str]) -> List[float]:
        """
        Get embeddings from Groq API
        
        Args:
            model: Embedding model name
            inputs: List of texts to embed
            
        Returns:
            List[float]: Embedding vector
        """
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {"model": model, "input": inputs}
        
        response = requests.post(self.embed_url, json=payload, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=502, 
                detail=f"Groq Embedding API Error: {response.text}"
            )
        
        return response.json()["data"][0]["embedding"]


# Global instance
_groq_client = None


def get_groq_client() -> GroqClient:
    """Get singleton Groq client instance"""
    global _groq_client
    if _groq_client is None:
        _groq_client = GroqClient()
    return _groq_client