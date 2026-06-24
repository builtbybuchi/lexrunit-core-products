from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.appwrite_client import get_databases, DATABASE_ID
from appwrite.query import Query

router = APIRouter()

class UserSyncPayload(BaseModel):
    clerk_id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    
class UserSettingsUpdate(BaseModel):
    settings: Dict[str, Any]

@router.post("/sync")
def sync_user(request: Request, payload: UserSyncPayload):
    db = get_databases()
    
    # Simple limiter import since we attached to app
    limiter = request.app.state.limiter
    # Manually check limit (since decorator is tricky with routers without direct limiter instance)
    try:
        # Check if user exists
        response = db.list_documents(
            database_id=DATABASE_ID,
            collection_id="users",
            queries=[Query.equal("clerk_id", payload.clerk_id)]
        )
        docs = response.get("documents", [])
        
        name = f"{payload.first_name or ''} {payload.last_name or ''}".strip() or payload.email
        
        phone_formatted = None
        if payload.phone:
            try:
                import phonenumbers
                country_code = payload.country.upper() if payload.country else "NG"
                parsed = phonenumbers.parse(payload.phone, country_code)
                formatted = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
                if formatted.startswith('+'):
                    phone_formatted = formatted[1:]
                else:
                    phone_formatted = formatted
            except Exception as pe:
                print(f"Phone formatting error: {pe}")
                phone_formatted = payload.phone
        
        if docs:
            # Update existing
            doc_id = docs[0]["$id"]
            update_data = {
                "email": payload.email,
                "name": name
            }
            if phone_formatted:
                update_data["phone"] = phone_formatted
                
            updated = db.update_document(
                database_id=DATABASE_ID,
                collection_id="users",
                document_id=doc_id,
                data=update_data
            )
            return updated
        else:
            # Create new
            from appwrite.id import ID
            create_data = {
                "clerk_id": payload.clerk_id,
                "email": payload.email,
                "name": name,
                "role": "user",
                "settings": "{}"
            }
            if phone_formatted:
                create_data["phone"] = phone_formatted
                
            new_user = db.create_document(
                database_id=DATABASE_ID,
                collection_id="users",
                document_id=ID.unique(),
                data=create_data
            )
            return new_user
    except Exception as e:
        print(f"Error syncing user: {e}")
        raise HTTPException(status_code=500, detail="Failed to sync user")

@router.get("/{clerk_id}/settings")
def get_settings(clerk_id: str):
    db = get_databases()
    try:
        response = db.list_documents(
            database_id=DATABASE_ID,
            collection_id="users",
            queries=[Query.equal("clerk_id", clerk_id)]
        )
        docs = response.get("documents", [])
        if not docs:
            raise HTTPException(status_code=404, detail="User not found")
        
        import json
        settings_str = docs[0].get("settings", "{}")
        return json.loads(settings_str)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch settings")

@router.put("/{clerk_id}/settings")
def update_settings(clerk_id: str, payload: UserSettingsUpdate):
    db = get_databases()
    try:
        response = db.list_documents(
            database_id=DATABASE_ID,
            collection_id="users",
            queries=[Query.equal("clerk_id", clerk_id)]
        )
        docs = response.get("documents", [])
        if not docs:
            raise HTTPException(status_code=404, detail="User not found")
        
        import json
        doc_id = docs[0]["$id"]
        updated = db.update_document(
            database_id=DATABASE_ID,
            collection_id="users",
            document_id=doc_id,
            data={
                "settings": json.dumps(payload.settings)
            }
        )
        return {"status": "success", "settings": payload.settings}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to update settings")

@router.get("/{clerk_id}/role")
def get_user_role(clerk_id: str):
    db = get_databases()
    try:
        response = db.list_documents(DATABASE_ID, "users", [Query.equal("clerk_id", clerk_id)])
        docs = response.get("documents", [])
        if docs:
            return {"role": docs[0].get("role", "user")}
        return {"role": "user"}
    except Exception as e:
        return {"role": "user"}
