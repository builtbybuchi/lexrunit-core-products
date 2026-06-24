from fastapi import APIRouter
from app.services.appwrite_client import get_databases, DATABASE_ID
from appwrite.query import Query

router = APIRouter()

@router.get("/")
def get_active_higs_event():
    db = get_databases()
    try:
        response = db.list_documents(
            DATABASE_ID,
            "higs_events",
            [
                Query.equal("isActive", True),
                Query.order_desc("$createdAt"),
                Query.limit(1)
            ]
        )
        docs = response.get("documents", [])
        if docs:
            return {
                "date": docs[0].get("date"),
                "registrationUrl": docs[0].get("registrationUrl")
            }
        return {
            "date": "TBA",
            "registrationUrl": "https://luma.com/oyyhm42g"
        }
    except Exception as e:
        print(f"Error fetching HIGS event: {e}")
        return {
            "date": "TBA",
            "registrationUrl": "https://luma.com/oyyhm42g"
        }
