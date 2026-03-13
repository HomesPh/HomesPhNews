"""
HomesPh Restaurants Service - Scheduler
Background job that runs daily at 06:00 to fetch restaurant data.
Uses Google Places API as primary source.

This is the restaurants-only scheduler. For the unified service, use root scheduler.py.
"""

import os
import json
import hashlib
import asyncio
import random
import requests
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import List, Dict

from config import COUNTRIES, RESTAURANT_CATEGORIES
from database import redis_client, PREFIX
from places_client import fetch_locations, fetch_restaurants_for_location


# ═══════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════

MAX_WORKERS = 4
DEDUP_TTL_DAYS = 30

# Redis key for tracking already-stored place IDs (Places API dedup)
RESTAURANT_PLACE_IDS_KEY = f"{PREFIX}restaurant_place_ids"


# ═══════════════════════════════════════════════════════════════
# JOB STATUS
# ═══════════════════════════════════════════════════════════════

restaurant_job_status: Dict = {
    "last_run": None,
    "next_run": None,
    "is_running": False,
    "cancel_requested": False,
    "last_results": [],
    "total_runs": 0,
    "total_success": 0,
    "total_errors": 0
}


def get_restaurant_job_status() -> Dict:
    """Get current restaurant job status."""
    return restaurant_job_status


def request_restaurant_job_cancel() -> None:
    """Request the running restaurant job to stop after the current batch."""
    restaurant_job_status["cancel_requested"] = True


def update_restaurant_next_run(next_run_time: str):
    """Update next scheduled run time for restaurants."""
    restaurant_job_status["next_run"] = next_run_time
    print(f"🍴 Next Restaurant run: {next_run_time}")


# ═══════════════════════════════════════════════════════════════
# DEDUPLICATION FUNCTIONS
# (Copied here so the restaurants module is self-contained)
# ═══════════════════════════════════════════════════════════════

def get_url_hash(url: str) -> str:
    """Generate MD5 hash of URL."""
    return hashlib.md5(url.lower().strip().encode()).hexdigest()


def get_title_hash(title: str) -> str:
    """Generate MD5 hash of normalized title."""
    normalized = title.lower().strip()
    for word in ['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for']:
        normalized = normalized.replace(f' {word} ', ' ')
    return hashlib.md5(normalized.encode()).hexdigest()


def is_duplicate(url: str, title: str) -> bool:
    """Check if item is duplicate (by URL or title)."""
    url_hash = get_url_hash(url)
    title_hash = get_title_hash(title)

    if redis_client.sismember(f"{PREFIX}scraped_urls", url_hash):
        return True

    if redis_client.sismember(f"{PREFIX}title_hashes", title_hash):
        return True

    return False


def mark_as_processed(url: str, title: str):
    """Mark item as processed (add to dedup sets)."""
    url_hash = get_url_hash(url)
    title_hash = get_title_hash(title)

    redis_client.sadd(f"{PREFIX}scraped_urls", url_hash)
    redis_client.sadd(f"{PREFIX}title_hashes", title_hash)

    ttl_seconds = DEDUP_TTL_DAYS * 24 * 60 * 60
    redis_client.expire(f"{PREFIX}scraped_urls", ttl_seconds)
    redis_client.expire(f"{PREFIX}title_hashes", ttl_seconds)


# ═══════════════════════════════════════════════════════════════
# LOCATION PROCESSOR (Primary — Google Places API)
# ═══════════════════════════════════════════════════════════════

def process_single_restaurant_location(loc: Dict) -> Dict:
    """
    Process one (country, city) using Google Places API.
    Fetches restaurants for the location, dedupes by place_id, saves to Redis.
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    start_time = __import__('time').time()
    result = {
        "country_id": loc.get("country_id"),
        "country_name": loc.get("country_name"),
        "city_id": loc.get("city_id"),
        "city_name": loc.get("city_name"),
        "status": "pending",
        "saved": 0,
        "skipped_duplicate": 0,
        "error": None,
        "duration": 0,
    }
    if not api_key:
        result["status"] = "error"
        result["error"] = "GOOGLE_MAPS_API_KEY not set"
        result["duration"] = round(__import__('time').time() - start_time, 2)
        return result

    try:
        if not redis_client:
            result["status"] = "error"
            result["error"] = "Redis not connected"
            result["duration"] = round(__import__('time').time() - start_time, 2)
            return result

        city_name = loc.get("city_name", "")
        country_name = loc.get("country_name", "")
        print(f"🍴 [{country_name}] [{city_name}] Places search...")
        restaurants = fetch_restaurants_for_location(loc, api_key)
        if not restaurants:
            result["status"] = "no_restaurants"
            result["duration"] = round(__import__('time').time() - start_time, 2)
            return result

        saved = 0
        skipped = 0
        for rest in restaurants:
            place_id = rest.get("place_id")
            if not place_id:
                continue
            if redis_client and redis_client.sismember(RESTAURANT_PLACE_IDS_KEY, place_id):
                skipped += 1
                continue
            rid = rest["id"]
            redis_client.set(f"{PREFIX}restaurant:{rid}", json.dumps(rest))
            redis_client.sadd(f"{PREFIX}all_restaurants", rid)
            country_slug = (rest.get("country") or country_name or "").lower().replace(" ", "_")
            redis_client.sadd(f"{PREFIX}country:{country_slug}:restaurants", rid)
            redis_client.sadd(RESTAURANT_PLACE_IDS_KEY, place_id)
            saved += 1
            print(f"   ✅ Saved: {rest.get('name', '')}")

        result["status"] = "success"
        result["saved"] = saved
        result["skipped_duplicate"] = skipped
        if saved:
            print(f"✅ [{country_name}] [{city_name}] Saved {saved} restaurants ({skipped} duplicates skipped)")

    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)
        print(f"❌ [{loc.get('city_name')}] Restaurant Places Error: {e}")

    result["duration"] = round(__import__('time').time() - start_time, 2)
    return result


def process_single_restaurant_country(country: str) -> Dict:
    """
    Fallback: Process one country for restaurants using news-based scraping.
    NOTE: This requires restaurant_scraper.py which has been removed.
    TODO: Replace with a new implementation or remove this fallback.
    Primary path is process_single_restaurant_location (Google Places API).
    """
    # TODO: restaurant_scraper.py was removed from the project.
    # This fallback path is non-functional until replaced.
    # The primary path (process_single_restaurant_location via Places API) still works.
    print(f"⚠️ [{country}] Fallback scraper unavailable (restaurant_scraper.py removed). Skipping.")
    return {
        "country": country,
        "status": "error",
        "error": "Fallback scraper (restaurant_scraper.py) not available. Use Google Places API path.",
        "duration": 0
    }


# ═══════════════════════════════════════════════════════════════
# DISCORD NOTIFICATIONS
# ═══════════════════════════════════════════════════════════════

def send_discord_notification(results: List[Dict]):
    """
    Send a beautiful, well-formatted Discord notification for restaurant scraping.
    Uses Discord embeds with proper styling.
    """
    webhook_url = os.getenv("DISCORD_WEBHOOK_URL")
    if not webhook_url:
        print("⚠️ DISCORD_WEBHOOK_URL not set, skipping notification")
        return

    try:
        locations_ok = sum(1 for r in results if r["status"] == "success")
        errors = sum(1 for r in results if r["status"] == "error")
        total_saved = sum(r.get("saved", 0) for r in results)
        total_locations = len(results)

        # Success = new restaurants actually saved (not locations count)
        if errors == 0 and total_saved > 0:
            color = 0x00D166
            status_emoji = "✅"
        elif errors > 0:
            color = 0xED4245
            status_emoji = "❌"
        else:
            color = 0xFEE75C
            status_emoji = "⚠️"

        country_flags = {
            "Philippines": "🇵🇭",
            "Saudi Arabia": "🇸🇦",
            "United Arab Emirates": "🇦🇪",
            "Singapore": "🇸🇬",
            "Hong Kong": "🇭🇰",
            "Qatar": "🇶🇦",
            "Kuwait": "🇰🇼",
            "Taiwan": "🇹🇼",
            "Japan": "🇯🇵",
            "Australia": "🇦🇺",
            "Malaysia": "🇲🇾",
            "Canada": "🇨🇦",
            "United States": "🇺🇸",
            "United Kingdom": "🇬🇧",
            "Italy": "🇮🇹",
            "South Korea": "🇰🇷",
        }

        location_lines = []
        for r in results[:20]:  # Limit to first 20 locations
            country_name = r.get("country_name") or r.get("country", "Unknown")
            city_name = r.get("city_name", "")
            flag = country_flags.get(country_name, "🌍")

            if r["status"] == "success":
                saved = r.get("saved", 0)
                skipped = r.get("skipped_duplicate", 0)
                location_lines.append(f"{flag} {country_name} - {city_name}: {saved} saved ({skipped} skipped)")
            elif r["status"] == "error":
                err_msg = r.get("error", "Unknown error")[:30]
                location_lines.append(f"{flag} {country_name} - {city_name}: ❌ `{err_msg}`")
            elif r["status"] == "no_restaurants":
                location_lines.append(f"{flag} {country_name} - {city_name}: ⏭️ No restaurants found")

        location_text = "\n".join(location_lines) if location_lines else "No locations processed"
        if len(results) > 20:
            location_text += f"\n...and {len(results) - 20} more locations"

        next_run_text = "Not scheduled"
        if restaurant_job_status.get("next_run"):
            try:
                next_dt = datetime.fromisoformat(restaurant_job_status["next_run"])
                next_run_text = next_dt.strftime("%b %d, %Y at %I:%M %p")
            except:
                next_run_text = restaurant_job_status["next_run"]

        embed = {
            "title": f"{status_emoji} Restaurant Scraper Job Complete",
            "description": f"Processed {total_locations} locations with {total_saved} new restaurants saved.",
            "color": color,
            "fields": [
                {
                    "name": "📊 Results Summary",
                    "value": f"```\n🍴 New Saved:  {total_saved}\n📍 Locations: {locations_ok} OK\n❌ Errors:    {errors}\n```",
                    "inline": True
                },
                {
                    "name": "📈 Stats",
                    "value": f"```\nTotal Runs: {restaurant_job_status.get('total_runs', 1)}\nAll-time:   {restaurant_job_status.get('total_success', 0)} locations\n```",
                    "inline": True
                },
                {
                    "name": "📍 Locations Processed",
                    "value": location_text,
                    "inline": False
                },
            ],
            "footer": {
                "text": f"HomesPh Restaurants Service • {total_locations} Locations • Next: {next_run_text}",
                "icon_url": "https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
            },
            "timestamp": datetime.utcnow().isoformat()
        }

        payload = {
            "username": "HomesPh Restaurants Bot",
            "avatar_url": "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
            "embeds": [embed]
        }

        response = requests.post(webhook_url, json=payload, timeout=10)
        if response.status_code == 204:
            print("📨 Discord notification sent successfully")
        else:
            print(f"⚠️ Discord webhook failed: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"⚠️ Discord notification error: {e}")


# ═══════════════════════════════════════════════════════════════
# MAIN JOB (Daily: 06:00)
# ═══════════════════════════════════════════════════════════════

async def run_restaurant_job():
    """
    Restaurant job: uses (country, city) from DB API + Google Places when available,
    else falls back to news-based scraper per country.
    """
    global restaurant_job_status

    if restaurant_job_status["is_running"]:
        print("⚠️ Previous restaurant job still running, skipping...")
        return

    restaurant_job_status["is_running"] = True
    restaurant_job_status["cancel_requested"] = False
    restaurant_job_status["last_run"] = datetime.now().isoformat()

    print("\n" + "=" * 70)
    print(f"🍴 RESTAURANT JOB STARTED")
    print(f"📅 Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)

    locations = fetch_locations()
    if locations:
        print(f"📍 Using Places API for {len(locations)} locations (country+city from DB)")
        loop = asyncio.get_event_loop()
        BATCH_SIZE = 10
        results = []
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            for i in range(0, len(locations), BATCH_SIZE):
                if restaurant_job_status.get("cancel_requested"):
                    print("\n🛑 Cancel requested. Stopping after current batch...")
                    break
                batch = locations[i:i + BATCH_SIZE]
                futures = [
                    loop.run_in_executor(executor, process_single_restaurant_location, loc)
                    for loc in batch
                ]
                batch_results = await asyncio.gather(*futures)
                results.extend(batch_results)
        success_count = sum(1 for r in results if r["status"] == "success")
        total_saved = sum(r.get("saved", 0) for r in results)
        error_count = sum(1 for r in results if r["status"] == "error")
        cancelled = restaurant_job_status.get("cancel_requested", False)
        if cancelled:
            print(f"⏹️ Job stopped by user. Processed {len(results)}/{len(locations)} locations.")
        print(f"🍴 Restaurant Summary: {total_saved} new restaurants saved ({success_count} locations with results).")
    else:
        print("📍 No DB locations; falling back to country-based processing.")
        all_countries = list(COUNTRIES.keys())
        loop = asyncio.get_event_loop()
        BATCH_SIZE = 5
        results = []
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            for i in range(0, len(all_countries), BATCH_SIZE):
                if restaurant_job_status.get("cancel_requested"):
                    print("\n🛑 Cancel requested. Stopping after current batch...")
                    break
                batch = all_countries[i:i + BATCH_SIZE]
                futures = [
                    loop.run_in_executor(executor, process_single_restaurant_country, country)
                    for country in batch
                ]
                batch_results = await asyncio.gather(*futures)
                results.extend(batch_results)
        success_count = sum(1 for r in results if r["status"] == "success")
        error_count = sum(1 for r in results if r["status"] == "error")
        cancelled = restaurant_job_status.get("cancel_requested", False)
        if cancelled:
            print(f"⏹️ Job stopped by user. Processed {len(results)}/{len(all_countries)} countries.")
        print(f"🍴 Restaurant Summary: {success_count} restaurants found.")

    restaurant_job_status["total_runs"] += 1
    restaurant_job_status["total_success"] += success_count
    restaurant_job_status["total_errors"] += error_count
    restaurant_job_status["last_results"] = results
    restaurant_job_status["is_running"] = False
    restaurant_job_status["cancel_requested"] = False

    cancelled = restaurant_job_status.get("cancel_requested", False)
    if cancelled:
        print("⏹️ Job cancelled by user request.")
    print("=" * 70 + "\n")

    if results and success_count > 0:
        send_discord_notification(results)

    return results
