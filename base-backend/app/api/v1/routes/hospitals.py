from fastapi import APIRouter
from app.services.appwrite_client import get_databases, DATABASE_ID
from appwrite.query import Query
from typing import Optional

router = APIRouter()

@router.get("/")
def get_hospitals(state: Optional[str] = None, city: Optional[str] = None, product: Optional[str] = None):
    db = get_databases()
    queries = []
    if state:
        queries.append(Query.equal("state", state))
    if city:
        queries.append(Query.equal("city", city))
    if product:
        queries.append(Query.search("products", product))
        
    try:
        response = db.list_documents(
            database_id=DATABASE_ID,
            collection_id="hospitals",
            queries=queries
        )
        return response.get("documents", [])
    except Exception as e:
        print(f"Error fetching hospitals: {e}")
        return []
