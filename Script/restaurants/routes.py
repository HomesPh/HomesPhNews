"""
HomesPh Restaurants Service - API Routes
FastAPI route handlers for restaurants and admin triggers.

This is the restaurants-only router. For the unified service, use root routes.py.
"""

import json
import time
from typing import List
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session

from models import (
    Restaurant, RestaurantSummary,
    CountryStats, CategoryStats,
    CategoryDB, CountryDB, CityDB, DBCategory, DBCountry, DBCity
)
from database import redis_client, PREFIX, get_db


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

def format_restaurant_summary(restaurant: dict) -> dict:
    """Format restaurant as summary. Handles None values."""
    return {
        "id": restaurant.get("id", ""),
        "name": restaurant.get("name") or "Unknown Restaurant",
        "country": restaurant.get("country") or "",
        "cuisine_type": restaurant.get("cuisine_type") or "Restaurant",
        "image_url": restaurant.get("image_url") or ""
    }


# ═══════════════════════════════════════════════════════════════
# RESTAURANT ROUTES
# ═══════════════════════════════════════════════════════════════

@router.get("/restaurants", response_model=List[RestaurantSummary], tags=["Restaurants"])
async def get_all_restaurants(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get all restaurants with pagination."""
    restaurant_ids = redis_client.smembers(f"{PREFIX}all_restaurants")
    sorted_ids = sorted(list(restaurant_ids), reverse=True)[offset:offset + limit]

    restaurants = []
    for rid in sorted_ids:
        data = redis_client.get(f"{PREFIX}restaurant:{rid}")
        if data:
            restaurants.append(json.loads(data))

    return [format_restaurant_summary(r) for r in restaurants]


@router.get("/restaurants/{restaurant_id}", response_model=Restaurant, tags=["Restaurants"])
async def get_restaurant(restaurant_id: str):
    """Get a single restaurant by ID."""
    data = redis_client.get(f"{PREFIX}restaurant:{restaurant_id}")
    if not data:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return json.loads(data)


@router.get("/restaurants/country/{country}", response_model=List[RestaurantSummary], tags=["Restaurants"])
async def get_restaurants_by_country(
    country: str,
    limit: int = Query(20, ge=1, le=100)
):
    """Get restaurants filtered by country."""
    key = f"{PREFIX}country:{country.lower().replace(' ', '_')}:restaurants"
    restaurant_ids = redis_client.smembers(key)
    sorted_ids = sorted(list(restaurant_ids), reverse=True)[:limit]

    restaurants = []
    for rid in sorted_ids:
        data = redis_client.get(f"{PREFIX}restaurant:{rid}")
        if data:
            restaurants.append(json.loads(data))

    return [format_restaurant_summary(r) for r in restaurants]


@router.post("/restaurants/clear-all", tags=["Restaurants"])
async def clear_all_restaurants():
    """Wipe ALL restaurants from Redis AND their S3 images."""
    from storage import StorageHandler
    storage = StorageHandler()

    restaurant_ids = redis_client.smembers(f"{PREFIX}all_restaurants")
    deleted_count = 0
    deleted_images = 0

    for rid in restaurant_ids:
        data = redis_client.get(f"{PREFIX}restaurant:{rid}")
        if data:
            restaurant = json.loads(data)
            image_url = restaurant.get("image_url", "")

            if image_url and "amazonaws.com" in image_url:
                storage._delete_cloud_image(image_url)
                deleted_images += 1

            redis_client.delete(f"{PREFIX}restaurant:{rid}")
            deleted_count += 1

    redis_client.delete(f"{PREFIX}all_restaurants")

    country_keys = redis_client.keys(f"{PREFIX}country:*:restaurants")
    for key in country_keys:
        redis_client.delete(key)

    return {
        "message": f"Successfully deleted {deleted_count} restaurants and {deleted_images} S3 images.",
        "restaurants_deleted": deleted_count,
        "images_deleted": deleted_images
    }


# ═══════════════════════════════════════════════════════════════
# ADMIN/TRIGGER ROUTES
# ═══════════════════════════════════════════════════════════════

@router.post("/trigger/restaurants", tags=["Admin"])
async def trigger_restaurant_job():
    """
    Manually trigger the restaurant scraper job.
    SYNCHRONOUS: Waits for job to complete before returning.
    """
    from scheduler import run_restaurant_job, get_restaurant_job_status
    import time
    
    # Check if already running
    status = get_restaurant_job_status()
    if status["is_running"]:
        raise HTTPException(status_code=409, detail="Job is already running. Please wait for it to complete.")
    
    start_time = time.time()
    results = await run_restaurant_job()
    duration = round(time.time() - start_time, 2)

    success = sum(1 for r in (results or []) if r.get("status") == "success")
    errors = sum(1 for r in (results or []) if r.get("status") == "error")

    return {
        "status": "completed",
        "message": f"Restaurant Job completed in {duration}s. {success} restaurants found.",
        "duration_seconds": duration,
        "success_count": success,
        "error_count": errors,
        "results": results,
        "timestamp": str(__import__('datetime').datetime.now())
    }


@router.get("/status/restaurants", tags=["Admin"])
async def get_restaurant_status():
    """Get current restaurant job status and statistics."""
    from scheduler import get_restaurant_job_status
    from scheduler_control import is_enabled as scheduler_is_enabled
    status = get_restaurant_job_status()

    return {
        "is_running": status["is_running"],
        "cancel_requested": status.get("cancel_requested", False),
        "scheduler_enabled": scheduler_is_enabled(),
        "total_runs": status["total_runs"],
        "total_success": status["total_success"],
        "total_errors": status["total_errors"],
        "last_run": status["last_run"],
        "next_run": status["next_run"],
        "last_results": status["last_results"]
    }


@router.post("/trigger/cancel", tags=["Admin"])
async def cancel_job():
    """Request the running restaurant scraper job to stop."""
    from scheduler import get_restaurant_job_status, request_restaurant_job_cancel
    status = get_restaurant_job_status()
    if not status["is_running"]:
        return {"message": "No job is currently running.", "cancelled": False}
    request_restaurant_job_cancel()
    return {"message": "Cancel requested. The scraper will stop after the current batch.", "cancelled": True}


# ═══════════════════════════════════════════════════════════════
# METADATA ROUTES
# ═══════════════════════════════════════════════════════════════

@router.get("/countries", response_model=List[CountryStats], tags=["Metadata"])
async def get_countries():
    """Get list of all countries with restaurant counts."""
    keys = redis_client.keys(f"{PREFIX}country:*:restaurants")

    countries = []
    for key in sorted(keys):
        name = key.split(":")[-2].replace("_", " ").title()
        count = redis_client.scard(key)
        countries.append({"name": name, "count": count})

    return sorted(countries, key=lambda x: x["count"], reverse=True)


@router.get("/categories", response_model=List[CategoryStats], tags=["Metadata"])
async def get_categories():
    """Get list of all restaurant categories with counts."""
    from config import RESTAURANT_CATEGORIES

    # Count restaurants by cuisine_type
    restaurant_ids = redis_client.smembers(f"{PREFIX}all_restaurants")
    counts = {}
    
    for rid in restaurant_ids:
        data = redis_client.get(f"{PREFIX}restaurant:{rid}")
        if data:
            restaurant = json.loads(data)
            cuisine_type = restaurant.get("cuisine_type", "Other")
            counts[cuisine_type] = counts.get(cuisine_type, 0) + 1

    results = []
    seen_names = set()

    for cat_name in RESTAURANT_CATEGORIES:
        name = cat_name.title()
        count = counts.get(name, 0)
        results.append({"name": name, "count": count})
        seen_names.add(name)

    for name, count in counts.items():
        if name not in seen_names:
            results.append({"name": name.title(), "count": count})

    return sorted(results, key=lambda x: x["count"], reverse=True)
