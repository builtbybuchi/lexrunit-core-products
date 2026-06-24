from fastapi import APIRouter
from app.services.appwrite_client import get_databases, DATABASE_ID
from appwrite.query import Query

router = APIRouter()

@router.get("/")
def get_news():
    db = get_databases()
    try:
        response = db.list_documents(
            database_id=DATABASE_ID,
            collection_id="news",
            queries=[Query.order_desc("publishedAt")]
        )
        return response.get("documents", [])
    except Exception as e:
        print(f"Error fetching news: {e}")
        return []

@router.get("/{slug}")
def get_news_article(slug: str):
    db = get_databases()
    try:
        response = db.list_documents(
            database_id=DATABASE_ID,
            collection_id="news",
            queries=[Query.equal("slug", slug)]
        )
        docs = response.get("documents", [])
        if docs:
            return docs[0]
        return None
    except Exception as e:
        print(f"Error fetching news article: {e}")
        return None
