"""
HomesPh Global News Engine - Database Module
Convenience functions for Redis connectivity and statistics.
"""

import os
import redis
from dotenv import load_dotenv

load_dotenv()

# Initialize Redis client using your exact URL format (no prefix modification)
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_prefix = os.getenv("REDIS_PREFIX", "homesph:")

# Export PREFIX for routes.py compatibility
PREFIX = redis_prefix

try:
    redis_client = redis.from_url(redis_url, decode_responses=True)
except Exception as e:
    print(f"⚠️ Redis connection error: {e}")
    redis_client = None


def ping_redis() -> bool:
    """Check if Redis is connected and responsive."""
    if not redis_client:
        return False
    try:
        return redis_client.ping()
    except Exception:
        return False


def get_total_articles() -> int:
    """Get total number of articles stored in Redis."""
    if not redis_client:
        return 0
    try:
        return redis_client.scard(f"{redis_prefix}all_articles")
    except Exception:
        return 0


def get_country_count() -> int:
    """Get count of unique countries with articles."""
    if not redis_client:
        return 0
    try:
        keys = redis_client.keys(f"{redis_prefix}country:*")
        return len(keys)
    except Exception:
        return 0


if __name__ == "__main__":
    print(f"Redis Connected: {ping_redis()}")
    print(f"Total Articles: {get_total_articles()}")
    print(f"Countries: {get_country_count()}")
