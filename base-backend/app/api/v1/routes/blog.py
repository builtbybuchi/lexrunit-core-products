from fastapi import APIRouter
from app.services.appwrite_client import get_databases, DATABASE_ID
from appwrite.query import Query

router = APIRouter()

@router.get("/")
def get_blogs():
    db = get_databases()
    try:
        response = db.list_documents(
            database_id=DATABASE_ID,
            collection_id="blogs",
            queries=[Query.order_desc("publishedAt")]
        )
        return response.get("documents", [])
    except Exception as e:
        print(f"Error fetching blogs: {e}")
        return []

@router.get("/{slug}")
def get_blog_post(slug: str):
    db = get_databases()
    try:
        response = db.list_documents(
            database_id=DATABASE_ID,
            collection_id="blogs",
            queries=[Query.equal("slug", slug)]
        )
        docs = response.get("documents", [])
        if docs:
            return docs[0]
        return None
    except Exception as e:
        print(f"Error fetching blog post: {e}")
        return None
