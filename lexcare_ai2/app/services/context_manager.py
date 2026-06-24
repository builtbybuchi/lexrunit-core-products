"""
Context Management System for LexCare AI
Handles session context storage and retrieval with Appwrite backend.
Privacy-compliant implementation without PII storage.
"""

from datetime import datetime, timezone
from typing import List, Dict, Optional, Any
import json
import logging
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.exception import AppwriteException
from appwrite.query import Query
from appwrite.id import ID
from app.core.config import get_appwrite_config
from app.core.prompts import get_system_prompt

logger = logging.getLogger(__name__)

_databases: Optional[Databases] = None
_local_healthcare_sessions: Dict[str, Dict[str, Any]] = {}
_local_ecommerce_sessions: Dict[str, Dict[str, Any]] = {}

DATABASE_ID = "website-db"
HEALTHCARE_COLLECTION_ID = "healthcare_sessions"
ECOMMERCE_COLLECTION_ID = "ecommerce_sessions"


def _get_databases() -> Databases:
    global _databases

    if _databases is None:
        endpoint, project_id, api_key = get_appwrite_config()
        client = Client()
        client.set_endpoint(endpoint)
        client.set_project(project_id)
        client.set_key(api_key)
        _databases = Databases(client)

    return _databases


def _parse_json_field(value: Any) -> Any:
    if isinstance(value, str):
        try:
            return json.loads(value)
        except Exception:
            return value
    return value


def _normalize_session_document(doc: Dict[str, Any]) -> Dict[str, Any]:
    normalized = dict(doc)
    normalized["history"] = _parse_json_field(normalized.get("history", {}))
    normalized["metadata"] = _parse_json_field(normalized.get("metadata", {}))

    history = normalized.get("history", {})
    if "session_type" not in normalized:
        normalized["session_type"] = history.get("session_type", "general") if isinstance(history, dict) else "general"
    if "created_at" not in normalized:
        created_at = history.get("created_at") if isinstance(history, dict) else None
        normalized["created_at"] = created_at or normalized.get("last_activity") or datetime.now(timezone.utc).isoformat()

    return normalized


def _build_healthcare_session_record(session_id: str, session_type: str, metadata: Optional[Dict]) -> Dict[str, Any]:
    timestamp = datetime.now(timezone.utc).isoformat()
    return {
        "$id": session_id,
        "session_id": session_id,
        "session_type": session_type,
        "created_at": timestamp,
        "user_id": None,
        "history": {
            "messages": [],
            "session_type": session_type,
            "created_at": timestamp,
        },
        "status": "in_progress",
        "last_activity": timestamp,
        "metadata": metadata or {},
    }


def _store_healthcare_session_locally(session_record: Dict[str, Any]) -> None:
    _local_healthcare_sessions[session_record["session_id"]] = dict(session_record)


def _build_ecommerce_session_record(
    user_id: str,
    seller_id: str,
    product_name: str,
    actual_price: float,
    target_price: float,
    last_price: float,
    history: List[Dict],
    status: str = "active",
) -> Dict[str, Any]:
    timestamp = datetime.now(timezone.utc).isoformat()
    return {
        "$id": f"{user_id}:{seller_id}:{product_name}",
        "user_id": user_id,
        "seller_id": seller_id,
        "product_name": product_name,
        "actual_price": actual_price,
        "target_price": target_price,
        "last_price": last_price,
        "history": history,
        "status": status,
        "last_activity": timestamp,
    }


def _store_ecommerce_session_locally(session_record: Dict[str, Any]) -> None:
    key = f'{session_record["user_id"]}:{session_record["seller_id"]}:{session_record["product_name"]}'
    _local_ecommerce_sessions[key] = dict(session_record)


class ContextManager:
    """Manages session context with Appwrite backend."""
    
    @staticmethod
    def create_session(session_id: str, session_type: str = "general", metadata: Optional[Dict] = None) -> str:
        """
        Create a new healthcare session in the database.
        
        Args:
            session_id: Session identifier
            session_type: Type of session (consultation, chat_patient, etc.)
            metadata: Optional metadata for the session
            
        Returns:
            str: New session ID
        """
        session_id = str(session_id)

        session_record = _build_healthcare_session_record(session_id, session_type, metadata)
        _store_healthcare_session_locally(session_record)
        
        try:
            databases = _get_databases()
            appwrite_payload = {
                "session_id": session_record["session_id"],
                "user_id": session_record["user_id"],
                "history": json.dumps(session_record["history"]),
                "status": session_record["status"],
                "last_activity": session_record["last_activity"],
                "metadata": json.dumps(session_record["metadata"]),
            }

            created = databases.create_document(
                DATABASE_ID,
                HEALTHCARE_COLLECTION_ID,
                ID.unique(),
                appwrite_payload
            )
            created_document_id = getattr(created, "id", None) or (created.get("$id") if isinstance(created, dict) else None)
            if created_document_id:
                session_record["$id"] = created_document_id
                _store_healthcare_session_locally(session_record)
            return session_id
        except AppwriteException as e:
            logger.warning("Appwrite session create failed, using local storage: %s", e)
            return session_id
        except Exception as e:
            logger.warning("Session create fell back to local storage after error: %s", e)
            return session_id
    
    @staticmethod
    def get_session(session_id: str) -> Optional[Dict]:
        """
        Retrieve healthcare session data from database.
        
        Args:
            session_id: Session identifier
            
        Returns:
            Dict: Session data or None if not found
        """
        try:
            databases = _get_databases()
            response = databases.list_documents(
                DATABASE_ID,
                HEALTHCARE_COLLECTION_ID,
                [Query.equal("session_id", session_id)]
            )
            
            if response["documents"]:
                doc = _normalize_session_document(response["documents"][0])
                _store_healthcare_session_locally(doc)
                return doc
            return _local_healthcare_sessions.get(session_id)
        except AppwriteException as e:
            logger.warning("Appwrite session lookup failed, using local storage: %s", e)
            return _local_healthcare_sessions.get(session_id)
        except Exception as e:
            if session_id in _local_healthcare_sessions:
                return _local_healthcare_sessions[session_id]
            logger.warning("Session lookup fell back to no data after error: %s", e)
            return None
    
    @staticmethod
    def update_session_history(session_id: str, user_message: str, ai_response: str) -> None:
        """
        Update session history with new message exchange.
        
        Args:
            session_id: Session identifier
            user_message: User's message
            ai_response: AI's response
        """
        try:
            # Get current session
            session = ContextManager.get_session(session_id)
            if not session:
                session = ContextManager.create_session(session_id=session_id)
                session = ContextManager.get_session(session_id)
            if not session:
                raise Exception(f"Session {session_id} not found")
            
            # Update history
            history = session.get("history", {"messages": []})
            if not isinstance(history, dict):
                history = {"messages": []}
            timestamp = datetime.now(timezone.utc).isoformat()
            
            # Add user message
            history["messages"].append({
                "role": "user",
                "content": user_message,
                "timestamp": timestamp
            })
            
            # Add AI response
            history["messages"].append({
                "role": "assistant", 
                "content": ai_response,
                "timestamp": timestamp
            })

            session["history"] = history
            session["last_activity"] = timestamp
            _store_healthcare_session_locally(session)
            
            # Update in database
            databases = _get_databases()
            databases.update_document(
                DATABASE_ID,
                HEALTHCARE_COLLECTION_ID,
                session["$id"],
                {
                    "history": json.dumps(history),
                    "last_activity": timestamp
                }
            )
            
        except AppwriteException as e:
            logger.warning("Appwrite history update failed, keeping local session state: %s", e)
        except Exception as e:
            logger.warning("History update fell back to local session state after error: %s", e)
    
    @staticmethod
    def get_conversation_history(session_id: str) -> List[Dict]:
        """
        Get conversation history for a session.
        
        Args:
            session_id: Session identifier
            
        Returns:
            List[Dict]: Messages in format compatible with AI APIs
        """
        session = ContextManager.get_session(session_id)
        if not session:
            return []
        
        history = session.get("history", {})
        messages = history.get("messages", [])
        
        # Return in format expected by AI APIs (without timestamps)
        return [{"role": msg["role"], "content": msg["content"]} for msg in messages]
    
    @staticmethod
    def build_prompt_with_context(session_id: str, session_type: str = "general") -> List[Dict]:
        """
        Build complete prompt including system prompts and conversation history.
        
        Args:
            session_id: Session identifier
            session_type: Type of session for appropriate system prompt
            
        Returns:
            List[Dict]: Complete message history with system prompts
        """
        # Start with system prompts
        messages = [
            {"role": "system", "content": get_system_prompt("general")},
            {"role": "system", "content": get_system_prompt(session_type)}
        ]
        
        # Add conversation history
        history = ContextManager.get_conversation_history(session_id)
        messages.extend(history)
        
        return messages
    
    @staticmethod
    def update_session_status(session_id: str, status: str, metadata_update: Optional[Dict] = None) -> None:
        """
        Update session status and optionally metadata.
        
        Args:
            session_id: Session identifier
            status: New status (in_progress, completed, etc.)
            metadata_update: Optional metadata updates
        """
        try:
            session = ContextManager.get_session(session_id)
            if not session:
                session = ContextManager.create_session(session_id=session_id)
                session = ContextManager.get_session(session_id)
            if not session:
                raise Exception(f"Session {session_id} not found")

            update_data = {
                "status": status,
                "last_activity": datetime.now(timezone.utc).isoformat()
            }
            
            if metadata_update:
                current_metadata = session.get("metadata", {})
                if not isinstance(current_metadata, dict):
                    current_metadata = {}
                current_metadata.update(metadata_update)
                update_data["metadata"] = json.dumps(current_metadata)
                session["metadata"] = current_metadata

            session.update(update_data)
            _store_healthcare_session_locally(session)
            
            databases = _get_databases()
            databases.update_document(
                DATABASE_ID,
                HEALTHCARE_COLLECTION_ID,
                session["$id"],
                update_data
            )
            
        except AppwriteException as e:
            logger.warning("Appwrite status update failed, keeping local session state: %s", e)
        except Exception as e:
            logger.warning("Status update fell back to local session state after error: %s", e)
    
    @staticmethod
    def cleanup_old_sessions(days_old: int = 30) -> int:
        """
        Clean up old sessions for privacy compliance.
        
        Args:
            days_old: Delete sessions older than this many days
            
        Returns:
            int: Number of sessions deleted
        """
        cutoff_date = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        cutoff_date = cutoff_date.replace(day=cutoff_date.day - days_old)
        
        try:
            # Appwrite list_documents has a limit, so we might need pagination for full cleanup
            # For now, we'll just delete the first batch found
            databases = _get_databases()
            response = databases.list_documents(
                DATABASE_ID,
                HEALTHCARE_COLLECTION_ID,
                [Query.less_than("last_activity", cutoff_date.isoformat())]
            )
            
            deleted_count = 0
            for doc in response["documents"]:
                databases.delete_document(DATABASE_ID, HEALTHCARE_COLLECTION_ID, doc["$id"])
                _local_healthcare_sessions.pop(doc.get("session_id", doc["$id"]), None)
                deleted_count += 1
                
            return deleted_count
        except AppwriteException as e:
            logger.warning("Appwrite cleanup failed, clearing local stale sessions only: %s", e)
            deleted_count = 0
            for session_id, session in list(_local_healthcare_sessions.items()):
                last_activity = session.get("last_activity")
                if last_activity and last_activity < cutoff_date.isoformat():
                    _local_healthcare_sessions.pop(session_id, None)
                    deleted_count += 1
            return deleted_count
        except Exception as e:
            logger.warning("Cleanup fell back to local session cleanup after error: %s", e)
            return 0

    # Ecommerce Methods

    @staticmethod
    def get_ecommerce_session(user_id: str, seller_id: str, product_name: str) -> Optional[Dict]:
        """
        Retrieve ecommerce session data.
        """
        try:
            databases = _get_databases()
            response = databases.list_documents(
                DATABASE_ID,
                ECOMMERCE_COLLECTION_ID,
                [
                    Query.equal("user_id", user_id),
                    Query.equal("seller_id", seller_id),
                    Query.equal("product_name", product_name)
                ]
            )
            
            if response["documents"]:
                doc = response["documents"][0]
                doc["history"] = _parse_json_field(doc.get("history", []))
                _store_ecommerce_session_locally(doc)
                return doc
            return _local_ecommerce_sessions.get(f"{user_id}:{seller_id}:{product_name}")
        except AppwriteException as e:
            logger.warning("Appwrite ecommerce lookup failed, using local storage: %s", e)
            return _local_ecommerce_sessions.get(f"{user_id}:{seller_id}:{product_name}")
        except Exception as e:
            return _local_ecommerce_sessions.get(f"{user_id}:{seller_id}:{product_name}")

    @staticmethod
    def create_or_update_ecommerce_session(
        user_id: str, 
        seller_id: str, 
        product_name: str, 
        actual_price: float,
        target_price: float,
        last_price: float,
        history: List[Dict],
        status: str = "active"
    ) -> None:
        """
        Create or update an ecommerce session.
        """
        try:
            existing = ContextManager.get_ecommerce_session(user_id, seller_id, product_name)
            
            data = _build_ecommerce_session_record(
                user_id=user_id,
                seller_id=seller_id,
                product_name=product_name,
                actual_price=actual_price,
                target_price=target_price,
                last_price=last_price,
                history=history,
                status=status,
            )

            _store_ecommerce_session_locally(data)

            appwrite_payload = dict(data)
            appwrite_payload["history"] = json.dumps(history)

            if existing:
                databases = _get_databases()
                databases.update_document(
                    DATABASE_ID,
                    ECOMMERCE_COLLECTION_ID,
                    existing["$id"],
                    appwrite_payload
                )
            else:
                databases = _get_databases()
                created = databases.create_document(
                    DATABASE_ID,
                    ECOMMERCE_COLLECTION_ID,
                    ID.unique(),
                    appwrite_payload
                )
                created_document_id = getattr(created, "id", None) or (created.get("$id") if isinstance(created, dict) else None)
                if created_document_id:
                    data["$id"] = created_document_id
                    _store_ecommerce_session_locally(data)
        except AppwriteException as e:
            logger.warning("Appwrite ecommerce save failed, keeping local session state: %s", e)
        except Exception as e:
            logger.warning("Ecommerce save fell back to local session state after error: %s", e)
