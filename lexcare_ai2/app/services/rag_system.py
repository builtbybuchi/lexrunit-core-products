import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_upstash_context(query: str, top_k: int = 3) -> str:
    """Query Upstash Vector for AI knowledgebase."""
    url = os.environ.get("UPSTASH_VECTOR_REST_URL")
    token = os.environ.get("UPSTASH_VECTOR_REST_TOKEN")
    
    if not url or not token:
        return ""
        
    try:
        from upstash_vector import Index
        index = Index(url=url, token=token)
        
        try:
            results = index.query(data=query, top_k=top_k, include_metadata=True)
        except Exception as e:
            logger.warning(f"Upstash query by data failed: {e}. Trying raw embedding...")
            from app.utils.common import call_groq_embedding
            vector = call_groq_embedding("nomic-embed-text-v1.5", [query])
            results = index.query(vector=vector, top_k=top_k, include_metadata=True)
            
        context_parts = []
        for r in results:
            if hasattr(r, 'score') and r.score < 0.3:
                continue
            if r.metadata:
                text = r.metadata.get('text') or r.metadata.get('content') or r.metadata.get('chunk') or str(r.metadata)
                context_parts.append(str(text))
                
        if context_parts:
            return "\n\n---\n\n".join(context_parts)
    except Exception as e:
        logger.error(f"Error querying Upstash Vector: {e}")
        
    return ""
