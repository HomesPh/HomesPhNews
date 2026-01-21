"""
HomesPh Global News Engine - Main Service
FastAPI + APScheduler running on port 8000.

Usage:
    python main.py                 # Start on port 8000
    python main.py --port 9000     # Custom port
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
from models import HealthResponse, JobStatus
from routes import router as article_router
from scheduler import run_hourly_job, get_job_status, update_next_run


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
    scheduler.add_job(
        run_hourly_job,
        CronTrigger(minute=0),  # Every hour at :00
        id='hourly_job',
        name='Hourly News Scraper',
        replace_existing=True
    )
    scheduler.start()
    
    # Update next run time
    next_run = scheduler.get_job('hourly_job').next_run_time
    if next_run:
        update_next_run(next_run.isoformat())
        # Make timezone-naive for comparison
        next_run_naive = next_run.replace(tzinfo=None)
        time_until = next_run_naive - datetime.now()
        minutes_until = int(time_until.total_seconds() / 60)
    else:
        minutes_until = 0
    
    # Startup message
    print("")
    print("=" * 60)
    print("🚀 HOMESPH NEWS SERVICE STARTED")
    print("=" * 60)
    print(f"📡 API:      http://localhost:8000")
    print(f"📖 Docs:     http://localhost:8000/docs")
    print("-" * 60)
    print(f"⏰ Schedule: Every hour at :00")
    print(f"📅 Next run: {next_run.strftime('%Y-%m-%d %H:%M:%S') if next_run else 'N/A'}")
    print(f"⏳ In:       {minutes_until} minutes")
    print("=" * 60)
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
    title="HomesPh News API",
    description="AI-Powered Global Real Estate News Platform",
    version="2.0.0",
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
    
    uptime = datetime.now() - start_time
    hours, remainder = divmod(int(uptime.total_seconds()), 3600)
    minutes, seconds = divmod(remainder, 60)
    
    return {
        "status": "healthy" if redis_ok else "degraded",
        "redis_connected": redis_ok,
        "scheduler_running": scheduler.running,
        "timestamp": datetime.utcnow().isoformat(),
        "uptime": f"{hours}h {minutes}m {seconds}s"
    }


@app.get("/status", response_model=JobStatus, tags=["Scheduler"])
async def status():
    """Get scheduler and job status."""
    return get_job_status()


@app.post("/trigger", tags=["Scheduler"])
async def trigger_job(background_tasks: BackgroundTasks):
    """Manually trigger the hourly job."""
    job_status = get_job_status()
    
    if job_status["is_running"]:
        raise HTTPException(status_code=409, detail="Job already running")
    
    background_tasks.add_task(run_hourly_job)
    return {"message": "Job triggered", "status": "running"}


@app.get("/stats", tags=["System"])
async def stats():
    """Get database and scheduler statistics."""
    job_status = get_job_status()
    
    return {
        "database": {
            "total_articles": get_total_articles(),
            "countries": get_country_count()
        },
        "scheduler": {
            "total_runs": job_status["total_runs"],
            "total_success": job_status["total_success"],
            "total_errors": job_status["total_errors"],
            "last_run": job_status["last_run"],
            "next_run": job_status["next_run"],
            "is_running": job_status["is_running"]
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
    
    uvicorn.run(app, host=args.host, port=args.port)
