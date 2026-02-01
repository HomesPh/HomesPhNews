"""
HomesPh Global News Engine - API Routes
FastAPI route handlers for articles and metadata.
"""

import json
import asyncio
from typing import List
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks

from models import Article, ArticleSummary, CountryStats, CategoryStats, ImageGenerationRequest
from database import redis_client, PREFIX


# ═══════════════════════════════════════════════════════════════
# ROUTER
# ═══════════════════════════════════════════════════════════════

router = APIRouter()


# ═══════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════

def get_articles_from_set(key: str, limit: int = 20, offset: int = 0) -> List[dict]:
    """Fetch articles from a Redis set, sorted by ID (desc)."""
    article_ids = redis_client.smembers(key)
    sorted_ids = sorted(list(article_ids), reverse=True)[offset:offset + limit]
    
    articles = []
    for aid in sorted_ids:
        data = redis_client.get(f"{PREFIX}article:{aid}")
        if data:
            articles.append(json.loads(data))
    return articles


def format_summary(article: dict) -> dict:
    """Format article as summary."""
    return {
        "id": article["id"],
        "country": article.get("country", ""),
        "category": article.get("category", ""),
        "title": article.get("title", ""),
        "image_url": article.get("image_url", "")
    }


# ═══════════════════════════════════════════════════════════════
# ARTICLE ROUTES
# ═══════════════════════════════════════════════════════════════

@router.get("/articles", response_model=List[ArticleSummary], tags=["Articles"])
async def get_all_articles(
    limit: int = Query(20, ge=1, le=100, description="Max articles"),
    offset: int = Query(0, ge=0, description="Offset for pagination")
):
    """Get all articles with pagination."""
    articles = get_articles_from_set(f"{PREFIX}all_articles", limit, offset)
    return [format_summary(a) for a in articles]


@router.get("/articles/{article_id}", response_model=Article, tags=["Articles"])
async def get_article(article_id: str):
    """Get a single article by ID."""
    data = redis_client.get(f"{PREFIX}article:{article_id}")
    if not data:
        raise HTTPException(status_code=404, detail="Article not found")
    return json.loads(data)


@router.delete("/articles/{article_id}", tags=["Articles"])
async def delete_article(article_id: str):
    """Delete an article and its associated cloud storage image."""
    from storage import StorageHandler
    storage = StorageHandler()
    
    success = storage.delete_article(article_id)
    if not success:
        raise HTTPException(status_code=404, detail="Article not found or could not be deleted")
        
    return {"message": f"Article {article_id} deleted successfully"}


@router.post("/articles/clear-all", tags=["Articles"])
async def clear_all_articles():
    """Wipe ALL articles from Redis and Cloud Storage."""
    from storage import StorageHandler
    storage = StorageHandler()
    
    deleted_count = storage.clear_all_articles()
    return {"message": f"Successfully deleted {deleted_count} articles and images. Database is clean."}


@router.get("/articles/country/{country}", response_model=List[ArticleSummary], tags=["Articles"])
async def get_articles_by_country(
    country: str,
    limit: int = Query(20, ge=1, le=100)
):
    """Get articles filtered by country."""
    key = f"{PREFIX}country:{country.lower().replace(' ', '_')}"
    articles = get_articles_from_set(key, limit)
    
    if not articles:
        raise HTTPException(status_code=404, detail=f"No articles for: {country}")
    
    return [format_summary(a) for a in articles]


@router.get("/articles/category/{category}", response_model=List[ArticleSummary], tags=["Articles"])
async def get_articles_by_category(
    category: str,
    limit: int = Query(20, ge=1, le=100)
):
    """Get articles filtered by category."""
    key = f"{PREFIX}category:{category.lower().replace(' ', '_')}"
    articles = get_articles_from_set(key, limit)
    
    if not articles:
        raise HTTPException(status_code=404, detail=f"No articles for: {category}")
    
    return [format_summary(a) for a in articles]


@router.get("/latest", response_model=List[ArticleSummary], tags=["Articles"])
async def get_latest_articles(limit: int = Query(10, ge=1, le=50)):
    """Get the most recent articles."""
    article_ids = redis_client.zrevrange(f"{PREFIX}articles_by_time", 0, limit - 1)
    
    articles = []
    for aid in article_ids:
        data = redis_client.get(f"{PREFIX}article:{aid}")
        if data:
            articles.append(json.loads(data))
    
    return [format_summary(a) for a in articles]


@router.get("/search", response_model=List[ArticleSummary], tags=["Articles"])
async def search_articles(
    q: str = Query(..., min_length=2, description="Search query"),
    limit: int = Query(20, ge=1, le=100)
):
    """Search articles by title or content."""
    all_ids = redis_client.smembers(f"{PREFIX}all_articles")
    results = []
    query_lower = q.lower()
    
    for aid in all_ids:
        data = redis_client.get(f"{PREFIX}article:{aid}")
        if data:
            article = json.loads(data)
            title = article.get("title", "").lower()
            content = article.get("content", "").lower()
            
            if query_lower in title or query_lower in content:
                results.append(format_summary(article))
                if len(results) >= limit:
                    break
    
    return results


@router.post("/generate-images", tags=["AI"])
async def generate_images(payload: ImageGenerationRequest):
    """
    Generate images using AI based on a text prompt.
    Directly uploads to Cloud Storage and returns public URLs.
    """
    from ai_service import AIProcessor
    ai = AIProcessor()
    
    generated_urls = []
    
    # Run generation 'n' times
    # Note: Sequential for now to avoid rapid API limit hits on free tier
    for i in range(payload.n):
        # We pass None as article_id so it generates a random one
        url = ai.generate_image(payload.prompt, None, upload=True)
        if url and "placehold.co" not in url:
            generated_urls.append(url)
            
    if not generated_urls:
        raise HTTPException(status_code=500, detail="Failed to generate images. AI model might be busy or quota exceeded.")
        
    return {"urls": generated_urls}


# ═══════════════════════════════════════════════════════════════
# METADATA ROUTES
# ═══════════════════════════════════════════════════════════════

@router.get("/countries", response_model=List[CountryStats], tags=["Metadata"])
async def get_countries():
    """Get list of all countries with article counts."""
    keys = redis_client.keys(f"{PREFIX}country:*")
    
    countries = []
    for key in sorted(keys):
        name = key.split(":")[-1].replace("_", " ").title()
        count = redis_client.scard(key)
        countries.append({"name": name, "count": count})
    
    return sorted(countries, key=lambda x: x["count"], reverse=True)


@router.get("/categories", response_model=List[CategoryStats], tags=["Metadata"])
async def get_categories():
    """Get list of all categories with article counts."""
    keys = redis_client.keys(f"{PREFIX}category:*")
    
    categories = []
    for key in sorted(keys):
        name = key.split(":")[-1].replace("_", " ").title()
        count = redis_client.scard(key)
        categories.append({"name": name, "count": count})
    
    return sorted(categories, key=lambda x: x["count"], reverse=True)


# ═══════════════════════════════════════════════════════════════
# ADMIN/TRIGGER ROUTES
# ═══════════════════════════════════════════════════════════════

@router.post("/trigger", tags=["Admin"])
async def trigger_job(background_tasks: BackgroundTasks):
    """
    Manually trigger the scheduled scraper job.
    Useful for testing and manual runs.
    """
    from scheduler import run_hourly_job, job_status
    
    # Check if already running
    if job_status["is_running"]:
        raise HTTPException(status_code=409, detail="Job is already running. Please wait for it to complete.")
    
    # Add coroutine to background tasks
    background_tasks.add_task(run_hourly_job)
    
    return {
        "status": "triggered",
        "message": "Job has been triggered. Check Discord webhook and logs for results.",
        "timestamp": str(__import__('datetime').datetime.now())
    }


@router.get("/status", tags=["Admin"])
async def get_status():
    """Get current job status and statistics."""
    from scheduler import job_status
    
    return {
        "is_running": job_status["is_running"],
        "total_runs": job_status["total_runs"],
        "total_success": job_status["total_success"],
        "total_errors": job_status["total_errors"],
        "total_skipped": job_status["total_skipped"],
        "last_run": job_status["last_run"],
        "next_run": job_status["next_run"],
        "last_results": job_status["last_results"]
    }
