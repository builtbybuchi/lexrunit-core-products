from fastapi import APIRouter
from app.services.appwrite_client import get_databases, DATABASE_ID
from appwrite.query import Query

router = APIRouter()

@router.get("/")
def get_careers():
    db = get_databases()
    try:
        response = db.list_documents(
            database_id=DATABASE_ID,
            collection_id="jobs",
            queries=[Query.order_desc("publishedAt")]
        )
        return response.get("documents", [])
    except Exception as e:
        print(f"Error fetching careers: {e}")
        return []
