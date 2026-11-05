from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timezone
from app.services.news_service import fetch_live_india_food_news

router = APIRouter(prefix="/api/news", tags=["Food Safety News"])

@router.get("")
def get_food_safety_news(
    force_refresh: bool = Query(False, description="Bypass cache and fetch fresh live updates"),
    category: Optional[str] = Query(None, description="Filter by category (fssai, labeling, health, general)"),
):
    """
    Returns live, daily-updating Indian food safety news, FSSAI alerts,
    and packaged food industry intelligence.
    """
    articles = fetch_live_india_food_news(force_refresh=force_refresh)

    if category and category != "all":
        articles = [a for a in articles if a.get("category") == category]

    return {
        "status": "success",
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "total": len(articles),
        "articles": articles,
    }

