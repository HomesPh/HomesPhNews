"""
HomesPh Global News Engine - Main Service
FastAPI + APScheduler running on port 8000.

Usage:
    python main.py                 # Start News Service (Port 8001)
    python main_restaurant.py      # Start Restaurant Service (Port 8002)
"""

import argparse
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

# Local imports
from database import ping_redis, get_total_articles, get_country_count
from models import HealthResponse, UnifiedStatus
from config import COUNTRIES
from routes import router as article_router
from scheduler import (
    run_hourly_job, get_job_status, update_next_run,
    run_restaurant_job, get_restaurant_job_status, update_restaurant_next_run
)
from scheduler_control import set_scheduler, turn_off as scheduler_turn_off, turn_on as scheduler_turn_on, is_enabled as scheduler_is_enabled


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
    
    # ─── Startup ───
    # 1. Schedule News: Run every hour to ensure news stays fresh
    scheduler.add_job(
        run_hourly_job,
        CronTrigger(minute=0), 
        id='hourly_job',
        name='HomesPh Fresh News Engine (Hourly)',
        replace_existing=True
    )
    
    # 2. Schedule Restaurants: Run twice a day (06:00 and 18:00)
    # This runs in parallel with the news task via APScheduler
    scheduler.add_job(
        run_restaurant_job,
        CronTrigger(hour="6,18", minute=0), 
        id='restaurant_job',
        name='HomesPh Restaurant Scraper (Twice Daily)',
        replace_existing=True
    )
    
    scheduler.start()
    set_scheduler(scheduler)
    
    # Update next run for News
    news_job = scheduler.get_job('hourly_job')
    if news_job:
        update_next_run(news_job.next_run_time.isoformat())
        
    # Update next run for Restaurants
    rest_job = scheduler.get_job('restaurant_job')
    if rest_job:
        update_restaurant_next_run(rest_job.next_run_time.isoformat())
    
    # Startup message
    from scheduler_control import is_enabled as scheduler_is_enabled
    sched_status = "ON (hourly + twice daily)" if scheduler_is_enabled() else "OFF (paused – use POST /scheduler/on to resume)"
    print("")
    print("=" * 60)
    print("🚀 HOMESPH UNIFIED ENGINE STARTED")
    print("=" * 60)
    print(f"📡 API:      http://localhost:8001")
    print(f"📖 Docs:     http://localhost:8001/docs")
    print("-" * 60)
    print(f"⏰ Scheduler: {sched_status}")
    print("-" * 60)
    print("Press Ctrl+C to stop")
    print("=" * 60)
    
    yield
    
    # ─── Shutdown ───
    scheduler.shutdown()
    print("\n👋 Service stopped.")


# ═══════════════════════════════════════════════════════════════
# FASTAPI APP
# ═══════════════════════════════════════════════════════════════

app = FastAPI(
    title="HomesPh Unified News & Restaurant API",
    description="AI-Powered Platform for Global Real Estate News & Filipino Restaurants",
    version="2.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include article routes
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


@app.get("/status", response_model=UnifiedStatus, tags=["Scheduler"])
async def status():
    """Get unified scheduler and job status for both news and restaurants."""
    return {
        "news": get_job_status(),
        "restaurants": get_restaurant_job_status()
    }


@app.post("/trigger", tags=["Scheduler"])
async def trigger_news_job(background_tasks: BackgroundTasks):
    """Manually trigger the hourly news job."""
    status = get_job_status()
    if status["is_running"]:
        raise HTTPException(status_code=409, detail="News job already running")
    background_tasks.add_task(run_hourly_job)
    return {"message": "News job triggered", "status": "running"}


@app.post("/trigger/restaurants", tags=["Scheduler"])
async def trigger_restaurant_job_manual(background_tasks: BackgroundTasks):
    """Manually trigger the restaurant job."""
    status = get_restaurant_job_status()
    if status["is_running"]:
        raise HTTPException(status_code=409, detail="Restaurant job already running")
    background_tasks.add_task(run_restaurant_job)
    return {"message": "Restaurant job triggered", "status": "running"}


@app.post("/scheduler/off", tags=["Scheduler"])
async def scheduler_off():
    """Turn off automatic scraper schedule (hourly news + twice-daily restaurants). Manual trigger still works."""
    if not scheduler_turn_off():
        raise HTTPException(status_code=500, detail="Scheduler not initialized")
    return {"message": "Automatic scraper schedule turned off. Manual 'Run scraper now' still works.", "scheduler_enabled": False}


@app.post("/scheduler/on", tags=["Scheduler"])
async def scheduler_on():
    """Turn on automatic scraper schedule again."""
    if not scheduler_turn_on():
        raise HTTPException(status_code=500, detail="Scheduler not initialized")
    return {"message": "Automatic scraper schedule turned on.", "scheduler_enabled": True}


@app.get("/scheduler", tags=["Scheduler"])
async def scheduler_status():
    """Get whether automatic schedule is on or off."""
    return {"scheduler_enabled": scheduler_is_enabled()}


@app.get("/stats", tags=["System"])
async def stats():
    """Get database and scheduler statistics."""
    from database import check_mysql_connection
    news_status = get_job_status()
    restaurant_status = get_restaurant_job_status()
    
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
            },
            "restaurants": {
                "total_runs": restaurant_status["total_runs"],
                "total_success": restaurant_status["total_success"],
                "last_run": restaurant_status["last_run"],
                "next_run": restaurant_status["next_run"],
                "is_running": restaurant_status["is_running"]
            }
        }
    }


# ═══════════════════════════════════════════════════════════════
# ENTRY POINT
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    
    parser = argparse.ArgumentParser(description="HomesPh News Service")
    parser.add_argument("--port", type=int, default=8001, help="Port number")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host")
    args = parser.parse_args()
    
    uvicorn.run("main:app", host=args.host, port=args.port, reload=True)
