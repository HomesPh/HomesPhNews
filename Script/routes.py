"""
HomesPh Global News Engine - API Routes
FastAPI route handlers for articles and metadata.
"""

import json
import asyncio
from typing import List
from fastapi import APIRouter, HTTPException, Query

from models import (
    Article, ArticleSummary, Restaurant, RestaurantSummary, 
    CountryStats, CategoryStats, ImageGenerationRequest,
    CategoryDB, CountryDB, CityDB, DBCategory, DBCountry, DBCity
)
from database import redis_client, PREFIX, get_db
from sqlalchemy.orm import Session
from fastapi import Depends



# ═══════════════════════════════════════════════════════════════
# ROUTER
# ═══════════════════════════════════════════════════════════════

router = APIRouter()

# ═══════════════════════════════════════════════════════════════
# DATABASE ROUTES (MYSQL)
# ═══════════════════════════════════════════════════════════════

@router.get("/db/categories", response_model=List[DBCategory], tags=["Database"])
async def get_db_categories(db: Session = Depends(get_db)):
    """Fetch all categories from the MySQL database."""
    categories = db.query(CategoryDB).all()
    return categories

@router.get("/db/countries", response_model=List[DBCountry], tags=["Database"])
async def get_db_countries(db: Session = Depends(get_db)):
    """Fetch all countries from the MySQL database."""
    countries = db.query(CountryDB).all()
    return countries

@router.get("/db/cities", response_model=List[DBCity], tags=["Database"])
async def get_db_cities(db: Session = Depends(get_db)):
    """Fetch all cities from the MySQL database."""
    cities = db.query(CityDB).all()
    return cities





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
    from config import CATEGORIES
    
    # 1. Get counts from Redis
    keys = redis_client.keys(f"{PREFIX}category:*")
    counts = {}
    for key in keys:
        raw_name = key.split(":")[-1].replace("_", " ").title()
        counts[raw_name] = redis_client.scard(key)
    
    # 2. Build list from master CATEGORIES list
    results = []
    seen_names = set()
    
    for cat_name in CATEGORIES:
        name = cat_name.title()
        count = counts.get(name, 0)
        results.append({"name": name, "count": count})
        seen_names.add(name)
    
    # 3. Add any categories found in Redis but NOT in config (just in case)
    for name, count in counts.items():
        if name not in seen_names:
            results.append({"name": name, "count": count})
    
    return sorted(results, key=lambda x: x["count"], reverse=True)


# ═══════════════════════════════════════════════════════════════
# ADMIN/TRIGGER ROUTES
# ═══════════════════════════════════════════════════════════════

@router.post("/trigger", tags=["Admin"])
async def trigger_job():
    """
    Manually trigger the scheduled scraper job.
    SYNCHRONOUS: Waits for job to complete before returning.
    This keeps the Cloud Run instance alive during processing.
    Timeout: Up to 60 minutes (set via --timeout 3600)
    """
    from scheduler import run_hourly_job, job_status
    import time
    
    # Check if already running
    if job_status["is_running"]:
        raise HTTPException(status_code=409, detail="Job is already running. Please wait for it to complete.")
    
    start_time = time.time()
    
    # Run the job SYNCHRONOUSLY (await it)
    results = await run_hourly_job()
    
    duration = round(time.time() - start_time, 2)
    
    # Calculate summary
    success = sum(1 for r in (results or []) if r.get("status") == "success")
    errors = sum(1 for r in (results or []) if r.get("status") == "error")
    
    return {
        "status": "completed",
        "message": f"Job completed in {duration}s. {success} success, {errors} errors.",
        "duration_seconds": duration,
        "success_count": success,
        "error_count": errors,
        "results": results,
        "timestamp": str(__import__('datetime').datetime.now())
    }


@router.post("/trigger/sports", tags=["Admin"])
async def trigger_sports_job():
    """
    Manually trigger the sports-specific generation job.
    """
    from scheduler import run_sports_job
    import time
    
    start_time = time.time()
    results = await run_sports_job()
    duration = round(time.time() - start_time, 2)
    
    success = sum(1 for r in results if r["status"] == "success")
    
    return {
        "status": "completed",
        "message": f"Sports Job completed in {duration}s. {success} articles published.",
        "duration_seconds": duration,
        "success_count": success,
        "results": results,
        "timestamp": str(__import__('datetime').datetime.now())
    }


@router.post("/trigger/cancel", tags=["Admin"])
async def cancel_job():
    """
    Request the running news scraper job to stop.
    The job will stop after finishing the current batch of countries (up to 5).
    """
    from scheduler import get_job_status, request_job_cancel
    status = get_job_status()
    if not status["is_running"]:
        return {"message": "No job is currently running.", "cancelled": False}
    request_job_cancel()
    return {"message": "Cancel requested. The scraper will stop after the current batch.", "cancelled": True}


@router.get("/status", tags=["Admin"])
async def get_status():
    """Get current job status and statistics."""
    from scheduler import get_job_status
    from scheduler_control import is_enabled as scheduler_is_enabled
    status = get_job_status()
    
    return {
        "is_running": status["is_running"],
        "cancel_requested": status.get("cancel_requested", False),
        "scheduler_enabled": scheduler_is_enabled(),
        "total_runs": status["total_runs"],
        "total_success": status["total_success"],
        "total_errors": status["total_errors"],
        "total_skipped": status["total_skipped"],
        "last_run": status["last_run"],
        "next_run": status["next_run"],
        "last_results": status["last_results"]
    }
