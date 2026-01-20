"""
HomesPh Global News Engine - Database
Redis connection and configuration.
"""

import os
import redis
from dotenv import load_dotenv

load_dotenv()


# ═══════════════════════════════════════════════════════════════
# REDIS CONNECTION
# ═══════════════════════════════════════════════════════════════

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
PREFIX = os.getenv("REDIS_PREFIX", "homesph:")

# Create Redis client
redis_client = redis.from_url(REDIS_URL, decode_responses=True)


def ping_redis() -> bool:
    """Check if Redis is connected."""
    try:
        redis_client.ping()
        return True
    except Exception:
        return False


def get_total_articles() -> int:
    """Get total article count."""
    return redis_client.scard(f"{PREFIX}all_articles")


def get_country_count() -> int:
    """Get number of countries with articles."""
    keys = redis_client.keys(f"{PREFIX}country:*")
    return len(keys)
