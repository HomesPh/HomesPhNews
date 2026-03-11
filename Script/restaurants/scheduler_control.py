"""
Shared state for turning the automatic scheduler (hourly news, twice-daily restaurants) on/off.
Persists to Redis so the choice survives restarts/redeploys.
"""

from database import redis_client, PREFIX

SCHEDULER_KEY = f"{PREFIX}scheduler_enabled"

_scheduler = None
_enabled = True


def _read_from_redis() -> bool:
    """Read scheduler_enabled from Redis. Default True if key missing or Redis down."""
    if not redis_client:
        return True
    try:
        val = redis_client.get(SCHEDULER_KEY)
        return val != "0"
    except Exception:
        return True


def _write_to_redis(enabled: bool) -> None:
    if not redis_client:
        return
    try:
        redis_client.set(SCHEDULER_KEY, "1" if enabled else "0")
    except Exception:
        pass


def set_scheduler(scheduler):
    """Called from main.py after creating the scheduler."""
    global _scheduler, _enabled
    _scheduler = scheduler
    _enabled = _read_from_redis()
    if not _enabled:
        scheduler.pause()
        print("⏸️  Scheduler started PAUSED (was turned off before restart). Use POST /scheduler/on to resume.")


def is_enabled() -> bool:
    """Whether the automatic schedule is on (jobs will run at their cron times)."""
    return _enabled


def turn_off() -> bool:
    """Pause the scheduler so no automatic jobs run. Manual trigger still works. Persists to Redis."""
    global _enabled
    if _scheduler is None:
        return False
    _scheduler.pause()
    _enabled = False
    _write_to_redis(False)
    return True


def turn_on() -> bool:
    """Resume the scheduler so hourly/twice-daily jobs run again. Persists to Redis."""
    global _enabled
    if _scheduler is None:
        return False
    _scheduler.resume()
    _enabled = True
    _write_to_redis(True)
    return True
