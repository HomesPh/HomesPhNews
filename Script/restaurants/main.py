"""
HomesPh Restaurants Service
FastAPI + APScheduler — Restaurants only, port 8012.

Runs daily at 06:00 — restaurant data is stable and Google Places API has quota limits.

Usage:
    python main.py              # Start Restaurants Service (Port 8012)
    python main.py --port 8012  # Explicit port
"""

import argparse
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from database import ping_redis
from models import HealthResponse
from routes import router as restaurant_router
from scheduler import (
    run_restaurant_job, get_restaurant_job_status, update_restaurant_next_run
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

    # Schedule Restaurants: Run daily at 06:00
    scheduler.add_job(
        run_restaurant_job,
        CronTrigger(hour=6, minute=0),
        id='restaurant_job',
        name='HomesPh Restaurant Scraper (Daily)',
        replace_existing=True
    )

    scheduler.start()
    set_scheduler(scheduler)

    rest_job = scheduler.get_job('restaurant_job')
    if rest_job:
        update_restaurant_next_run(rest_job.next_run_time.isoformat())

    sched_status = "ON (Daily at 06:00)" if scheduler_is_enabled() else "OFF (paused – use POST /scheduler/on to resume)"
    print("")
    print("=" * 60)
    print("🍴 HOMESPH RESTAURANTS SERVICE STARTED")
    print("=" * 60)
    print(f"📡 API:      http://localhost:8012")
    print(f"📖 Docs:     http://localhost:8012/docs")
    print("-" * 60)
    print(f"⏰ Scheduler: {sched_status}")
    print("-" * 60)
    print("Press Ctrl+C to stop")
    print("=" * 60)

    yield

    scheduler.shutdown()
    print("\n👋 Restaurants Service stopped.")


# ═══════════════════════════════════════════════════════════════
# FASTAPI APP
# ═══════════════════════════════════════════════════════════════

app = FastAPI(
    title="HomesPh Restaurants API",
    description="Filipino-Owned Restaurants Discovery — Restaurants Service",
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

app.include_router(restaurant_router)


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
    """Get scheduler statistics."""
    rest_status = get_restaurant_job_status()

    return {
        "scheduler": {
            "restaurants": {
                "total_runs": rest_status["total_runs"],
                "total_success": rest_status["total_success"],
                "last_run": rest_status["last_run"],
                "next_run": rest_status["next_run"],
                "is_running": rest_status["is_running"]
            }
        }
    }


@app.post("/scheduler/off", tags=["Scheduler"])
async def scheduler_off():
    """Turn off automatic restaurant schedule. Manual trigger still works."""
    if not scheduler_turn_off():
        raise HTTPException(status_code=500, detail="Scheduler not initialized")
    return {"message": "Automatic schedule turned off. Manual trigger still works.", "scheduler_enabled": False}


@app.post("/scheduler/on", tags=["Scheduler"])
async def scheduler_on():
    """Turn on automatic restaurant schedule."""
    if not scheduler_turn_on():
        raise HTTPException(status_code=500, detail="Scheduler not initialized")
    return {"message": "Automatic schedule turned on.", "scheduler_enabled": True}


@app.get("/scheduler", tags=["Scheduler"])
async def scheduler_status():
    """Get whether automatic schedule is on or off."""
    return {"scheduler_enabled": scheduler_is_enabled()}


# ═══════════════════════════════════════════════════════════════
# ENTRY POINT
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn

    parser = argparse.ArgumentParser(description="HomesPh Restaurants Service")
    parser.add_argument("--port", type=int, default=8012, help="Port number")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host")
    args = parser.parse_args()

    uvicorn.run("main:app", host=args.host, port=args.port, reload=True)
