from fastapi import APIRouter, HTTPException, Depends
from app.services.appwrite_client import get_databases, DATABASE_ID
from appwrite.query import Query

router = APIRouter()

def verify_admin(clerk_id: str):
    db = get_databases()
    try:
        response = db.list_documents(DATABASE_ID, "users", [Query.equal("clerk_id", clerk_id)])
        docs = response.get("documents", [])
        if not docs or docs[0].get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not authorized as admin")
    except Exception as e:
        raise HTTPException(status_code=403, detail="Not authorized as admin")

@router.get("/{clerk_id}/collections/{collection_id}")
def get_admin_collection(clerk_id: str, collection_id: str):
    verify_admin(clerk_id)
    db = get_databases()
    try:
        response = db.list_documents(DATABASE_ID, collection_id, [Query.order_desc("$createdAt")])
        return response.get("documents", [])
    except Exception as e:
        # Some collections don't have $createdAt, fallback to default order
        try:
            response = db.list_documents(DATABASE_ID, collection_id)
            return response.get("documents", [])
        except Exception as e2:
            print(f"Error fetching {collection_id}: {e2}")
            return []

@router.delete("/{clerk_id}/collections/{collection_id}/{doc_id}")
def delete_admin_doc(clerk_id: str, collection_id: str, doc_id: str):
    verify_admin(clerk_id)
    db = get_databases()
    db.delete_document(DATABASE_ID, collection_id, doc_id)
    return {"status": "success"}

@router.patch("/{clerk_id}/collections/{collection_id}/{doc_id}")
def update_admin_doc(clerk_id: str, collection_id: str, doc_id: str, payload: dict):
    verify_admin(clerk_id)
    db = get_databases()
    db.update_document(DATABASE_ID, collection_id, doc_id, payload)
    return {"status": "success"}

@router.post("/{clerk_id}/collections/{collection_id}")
def create_admin_doc(clerk_id: str, collection_id: str, payload: dict):
    verify_admin(clerk_id)
    db = get_databases()
    from appwrite.id import ID
    doc = db.create_document(DATABASE_ID, collection_id, ID.unique(), payload)
    return doc
