"""
HomesPh Articles Service
FastAPI + APScheduler — Articles only, port 8011.

Usage:
    python main.py              # Start Articles Service (Port 8011)
    python main.py --port 8011  # Explicit port
"""

import argparse
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from database import ping_redis, get_total_articles, get_country_count
from models import HealthResponse
from routes import router as article_router
from scheduler import (
    run_hourly_job, get_job_status, update_next_run,
    run_targeted_job, request_job_cancel
)
from scheduler_control import (
    set_scheduler,
    turn_off as scheduler_turn_off,
    turn_on as scheduler_turn_on,
    is_enabled as scheduler_is_enabled
)


# ═══════════════════════════════════════════════════════════════
# SCHEDULER SETUP
# ═══════════════════════════════════════════════════════════════

scheduler = AsyncIOScheduler()
start_time = datetime.now()


# ═══════════════════════════════════════════════════════════════
# LIFESPAN (Startup/Shutdown)
# ═══════════════════════════════════════════════════════════════

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events."""

    # Schedule News: Run every hour
    scheduler.add_job(
        run_hourly_job,
        CronTrigger(minute=0),
        id='hourly_job',
        name='HomesPh Fresh News Engine (Hourly)',
        replace_existing=True
    )

    scheduler.start()
    set_scheduler(scheduler)

    news_job = scheduler.get_job('hourly_job')
    if news_job:
        update_next_run(news_job.next_run_time.isoformat())

    sched_status = "ON (hourly)" if scheduler_is_enabled() else "OFF (paused – use POST /scheduler/on to resume)"
    print("")
    print("=" * 60)
    print("📰 HOMESPH ARTICLES SERVICE STARTED")
    print("=" * 60)
    print(f"📡 API:      http://localhost:8011")
    print(f"📖 Docs:     http://localhost:8011/docs")
    print("-" * 60)
    print(f"⏰ Scheduler: {sched_status}")
    print("-" * 60)
    print("Press Ctrl+C to stop")
    print("=" * 60)

    yield

    scheduler.shutdown()
    print("\n👋 Articles Service stopped.")


# ═══════════════════════════════════════════════════════════════
# FASTAPI APP
# ═══════════════════════════════════════════════════════════════

app = FastAPI(
    title="HomesPh Articles API",
    description="AI-Powered Global Real Estate News — Articles Service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(article_router)


# ═══════════════════════════════════════════════════════════════
# SYSTEM ROUTES
# ═══════════════════════════════════════════════════════════════

@app.get("/", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Health check endpoint."""
    redis_ok = ping_redis()
    from database import check_mysql_connection
    mysql_ok = check_mysql_connection()

    uptime = datetime.now() - start_time
    hours, remainder = divmod(int(uptime.total_seconds()), 3600)
    minutes, seconds = divmod(remainder, 60)

    return {
        "status": "healthy" if (redis_ok and mysql_ok) else "degraded",
        "redis_connected": redis_ok,
        "mysql_connected": mysql_ok,
        "scheduler_running": scheduler.running,
        "timestamp": datetime.utcnow().isoformat(),
        "uptime": f"{hours}h {minutes}m {seconds}s"
    }


@app.get("/stats", tags=["System"])
async def stats():
    """Get database and scheduler statistics."""
    from database import check_mysql_connection
    news_status = get_job_status()

    return {
        "database": {
            "total_articles": get_total_articles(),
            "countries": get_country_count(),
            "mysql_ok": check_mysql_connection()
        },
        "scheduler": {
            "news": {
                "total_runs": news_status["total_runs"],
                "total_success": news_status["total_success"],
                "last_run": news_status["last_run"],
                "next_run": news_status["next_run"],
                "is_running": news_status["is_running"]
            }
        }
    }


@app.post("/scheduler/off", tags=["Scheduler"])
async def scheduler_off():
    """Turn off automatic scraper schedule. Manual trigger still works."""
    if not scheduler_turn_off():
        raise HTTPException(status_code=500, detail="Scheduler not initialized")
    return {"message": "Automatic schedule turned off. Manual trigger still works.", "scheduler_enabled": False}


@app.post("/scheduler/on", tags=["Scheduler"])
async def scheduler_on():
    """Turn on automatic scraper schedule."""
    if not scheduler_turn_on():
        raise HTTPException(status_code=500, detail="Scheduler not initialized")
    return {"message": "Automatic schedule turned on.", "scheduler_enabled": True}


@app.get("/scheduler", tags=["Scheduler"])
async def scheduler_status():
    """Get whether automatic schedule is on or off."""
    return {"scheduler_enabled": scheduler_is_enabled()}


class TargetedTriggerRequest(BaseModel):
    countries: list[str]
    categories: list[str]


@app.post("/trigger/targeted", tags=["Scheduler"])
async def trigger_targeted_job(req: TargetedTriggerRequest):
    """Manually trigger a targeted scrape for specific countries and categories."""
    if not req.countries:
        raise HTTPException(status_code=400, detail="At least one country is required")
    if not req.categories:
        raise HTTPException(status_code=400, detail="At least one category is required")
    status = get_job_status()
    if status["is_running"]:
        raise HTTPException(status_code=409, detail="A scraper job is already running")
    result = await run_targeted_job(req.countries, req.categories)
    return result


# ═══════════════════════════════════════════════════════════════
# ENTRY POINT
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn

    parser = argparse.ArgumentParser(description="HomesPh Articles Service")
    parser.add_argument("--port", type=int, default=8011, help="Port number")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host")
    args = parser.parse_args()

    uvicorn.run("main:app", host=args.host, port=args.port, reload=True)
