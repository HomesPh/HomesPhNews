"""
HomesPh Global News Engine - Restaurant Service
FastAPI + APScheduler running on port 8002.
Runs specialized restaurant scraper job twice a day.
"""

import argparse
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

# Local imports
from database import ping_redis, get_country_count
from models import HealthResponse
from routes import router as article_router
from scheduler import run_restaurant_job, get_restaurant_job_status, update_restaurant_next_run


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
    # Schedule: Run twice a day (e.g., 06:00 and 18:00)
    # This aligns with the user's request for "2x ra siya mag run".
    scheduler.add_job(
        run_restaurant_job,
        CronTrigger(hour="6,18", minute=0), 
        id='restaurant_job',
        name='HomesPh Restaurant Scraper (Twice Daily)',
        replace_existing=True
    )
    scheduler.start()
    
    # Update next run time
    job = scheduler.get_job('restaurant_job')
    next_run = job.next_run_time if job else None
    
    if next_run:
        update_restaurant_next_run(next_run.isoformat())
        # Make timezone-naive for comparison
        next_run_naive = next_run.replace(tzinfo=None)
        time_until = next_run_naive - datetime.now()
        hours_until = int(time_until.total_seconds() / 3600)
        minutes_until = int((time_until.total_seconds() % 3600) / 60)
    else:
        hours_until = 0
        minutes_until = 0
    
    # Startup message
    print("")
    print("=" * 60)
    print("🍴 HOMESPH RESTAURANT SERVICE STARTED")
    print("=" * 60)
    print(f"📡 API:      http://localhost:8002")
    print(f"📖 Docs:     http://localhost:8002/docs")
    print("-" * 60)
    print(f"⏰ Schedule: TWICE DAILY (06:00, 18:00)")
    print(f"🔥 Mode:     STRUCTURED RESTAURANT DATA")
    print(f"📅 Next run: {next_run.strftime('%Y-%m-%d %H:%M:%S') if next_run else 'N/A'}")
    print(f"⏳ In:       {hours_until}h {minutes_until}m")
    print("=" * 60)
    print("Press Ctrl+C to stop")
    print("=" * 60)
    
    yield
    
    # ─── Shutdown ───
    scheduler.shutdown()
    print("\n👋 Restaurant service stopped.")


# ═══════════════════════════════════════════════════════════════
# FASTAPI APP
# ═══════════════════════════════════════════════════════════════

app = FastAPI(
    title="HomesPh Restaurant API",
    description="AI-Powered Global Filipino Restaurant Discovery",
    version="1.0.0",
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

# Include shared routes
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


@app.get("/status/restaurants", tags=["Scheduler"])
async def restaurant_status():
    """Get restaurant scheduler and job status."""
    return get_restaurant_job_status()


@app.post("/trigger/restaurants", tags=["Scheduler"])
async def trigger_restaurant_job_manual(background_tasks: BackgroundTasks):
    """Manually trigger the restaurant job."""
    status = get_restaurant_job_status()
    
    if status["is_running"]:
        raise HTTPException(status_code=409, detail="Restaurant job already running")
    
    background_tasks.add_task(run_restaurant_job)
    return {"message": "Restaurant job triggered", "status": "running"}


# ═══════════════════════════════════════════════════════════════
# ENTRY POINT
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    
    parser = argparse.ArgumentParser(description="HomesPh Restaurant Service")
    parser.add_argument("--port", type=int, default=8002, help="Port number")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host")
    args = parser.parse_args()
    
    uvicorn.run("main_restaurant:app", host=args.host, port=args.port, reload=True)
