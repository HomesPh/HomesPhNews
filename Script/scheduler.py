"""
HomesPh Global News Engine - Scheduler
Background job that runs every hour to scrape and process news.
Includes URL deduplication to avoid processing same articles.
"""

import time
import random
import asyncio
import uuid
import hashlib
import json
import requests
import os
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import List, Dict

from config import COUNTRIES, CATEGORIES
from scraper import NewsScraper, clean_html
from ai_service import AIProcessor, clean_markdown
from storage import StorageHandler
from database import redis_client, PREFIX


# ═══════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════

MAX_WORKERS = 4
ARTICLES_PER_COUNTRY = 1
DEDUP_TTL_DAYS = 30  # Keep URLs for 30 days


# ═══════════════════════════════════════════════════════════════
# JOB STATUS (Shared State)
# ═══════════════════════════════════════════════════════════════

job_status: Dict = {
    "last_run": None,
    "next_run": None,
    "is_running": False,
    "cancel_requested": False,
    "last_results": [],
    "total_runs": 0,
    "total_success": 0,
    "total_errors": 0,
    "total_skipped": 0
}

def get_job_status() -> Dict:
    """Get current news job status."""
    return job_status


def request_job_cancel() -> None:
    """Request the running news job to stop after the current batch."""
    job_status["cancel_requested"] = True


def update_next_run(next_run_time: str):
    """Update next scheduled run time for news."""
    job_status["next_run"] = next_run_time
    print(f"⏰ Next News run: {next_run_time}")


# ═══════════════════════════════════════════════════════════════
# DEDUPLICATION FUNCTIONS
# ═══════════════════════════════════════════════════════════════

def get_url_hash(url: str) -> str:
    """Generate MD5 hash of URL."""
    return hashlib.md5(url.lower().strip().encode()).hexdigest()


def get_title_hash(title: str) -> str:
    """Generate MD5 hash of normalized title."""
    normalized = title.lower().strip()
    # Remove common words for better matching
    for word in ['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for']:
        normalized = normalized.replace(f' {word} ', ' ')
    return hashlib.md5(normalized.encode()).hexdigest()


def is_duplicate(url: str, title: str) -> bool:
    """Check if article is duplicate (by URL or title)."""
    url_hash = get_url_hash(url)
    title_hash = get_title_hash(title)
    
    # Check URL
    if redis_client.sismember(f"{PREFIX}scraped_urls", url_hash):
        return True
    
    # Check title
    if redis_client.sismember(f"{PREFIX}title_hashes", title_hash):
        return True
    
    return False


def mark_as_processed(url: str, title: str):
    """Mark article as processed (add to dedup sets)."""
    url_hash = get_url_hash(url)
    title_hash = get_title_hash(title)
    
    # Add to sets
    redis_client.sadd(f"{PREFIX}scraped_urls", url_hash)
    redis_client.sadd(f"{PREFIX}title_hashes", title_hash)
    
    # Set TTL (refresh on each add)
    ttl_seconds = DEDUP_TTL_DAYS * 24 * 60 * 60
    redis_client.expire(f"{PREFIX}scraped_urls", ttl_seconds)
    redis_client.expire(f"{PREFIX}title_hashes", ttl_seconds)


def get_dedup_stats() -> Dict:
    """Get deduplication stats."""
    return {
        "urls_tracked": redis_client.scard(f"{PREFIX}scraped_urls"),
        "titles_tracked": redis_client.scard(f"{PREFIX}title_hashes")
    }


def send_discord_notification(results: List[Dict]):
    """
    Send a beautiful, well-formatted Discord notification.
    Uses Discord embeds with proper styling.
    """
    webhook_url = os.getenv("DISCORD_WEBHOOK_URL")
    if not webhook_url:
        print("⚠️ DISCORD_WEBHOOK_URL not set, skipping notification")
        return
    
    try:
        success = sum(1 for r in results if r["status"] == "success")
        errors = sum(1 for r in results if r["status"] == "error")
        duplicates = sum(1 for r in results if r["status"] == "all_duplicates")
        total_countries = len(results)
        
        # Determine embed color based on results
        if errors == 0 and success > 0:
            color = 0x00D166  # Green - all good
            status_emoji = "✅"
        elif errors > success:
            color = 0xED4245  # Red - mostly errors
            status_emoji = "❌"
        else:
            color = 0xFEE75C  # Yellow - mixed results
            status_emoji = "⚠️"
        
        # Build country results with flag emojis
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
        
        # Format country results
        country_lines = []
        for r in results:
            country = r.get("country", "Unknown")
            flag = country_flags.get(country, "🌍")
            
            if r["status"] == "success":
                country_lines.append(f"{flag} {country}: 1 ✅")
            elif r["status"] == "error":
                err_msg = r.get("error", "Unknown error")[:30]
                country_lines.append(f"{flag} {country}: ❌ `{err_msg}`")
            elif r["status"] == "all_duplicates":
                country_lines.append(f"{flag} {country}: ⏭️ Skipped (duplicates)")
        
        # Split into columns if too many countries
        country_text = "\n".join(country_lines) if country_lines else "No countries processed"
        
        # Collect successful article titles
        article_titles = []
        for r in results:
            if r["status"] == "success" and r.get("title"):
                title = r["title"][:60] + "..." if len(r.get("title", "")) > 60 else r.get("title", "")
                article_titles.append(f"• {title}")
        
        articles_text = "\n".join(article_titles[:5]) if article_titles else "No articles generated"
        if len(article_titles) > 5:
            articles_text += f"\n...and {len(article_titles) - 5} more"
        
        # Get next run time
        next_run_text = "Not scheduled"
        if job_status.get("next_run"):
            try:
                next_dt = datetime.fromisoformat(job_status["next_run"])
                next_run_text = next_dt.strftime("%b %d, %Y at %I:%M %p")
            except:
                next_run_text = job_status["next_run"]
        
        # Build the embed
        embed = {
            "title": f"{status_emoji} News Scraper Job Complete",
            "description": f"Processed {total_countries} countries with {success} successful articles.",
            "color": color,
            "fields": [
                {
                    "name": "📊 Results Summary",
                    "value": f"```\n✅ Success:    {success}\n❌ Errors:     {errors}\n⏭️ Duplicates: {duplicates}\n```",
                    "inline": True
                },
                {
                    "name": "📈 Stats",
                    "value": f"```\nTotal Runs: {job_status.get('total_runs', 1)}\nAll-time:   {job_status.get('total_success', 0)} articles\n```",
                    "inline": True
                },
                {
                    "name": "🌏 Countries Processed",
                    "value": country_text,
                    "inline": False
                },
                {
                    "name": "📰 New Articles",
                    "value": articles_text,
                    "inline": False
                },
            ],
            "footer": {
                "text": f"HomesPh News Engine • {total_countries} Countries • Next: {next_run_text}",
                "icon_url": "https://cdn-icons-png.flaticon.com/512/2965/2965879.png"
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        
        payload = {
            "username": "HomesPh News Bot",
            "avatar_url": "https://cdn-icons-png.flaticon.com/512/2965/2965879.png",
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
# COUNTRY PROCESSOR
# ═══════════════════════════════════════════════════════════════

def process_single_country(country: str, category: str = None) -> Dict:
    """
    Process one country:
    1. Pick random category (if not provided)
    2. Scrape articles
    ...
    """
    # Initialize services (thread-safe)
    scraper = NewsScraper()
    ai = AIProcessor()
    storage = StorageHandler()
    
    start_time = time.time()
    
    # Use provided category or pick a random one
    if not category:
        category = random.choice(CATEGORIES)
    
    result = {
        "country": country,
        "category": category,
        "status": "pending",
        "article_id": None,
        "title": None,
        "error": None,
        "duration": 0,
        "skipped": 0
    }
    
    try:
        print(f"🌍 [{country}] Starting... Category: {category}")
        
        # Step 1: Scrape articles
        articles = scraper.fetch_news(category, country)
        if not articles:
            result["status"] = "no_articles"
            result["error"] = "No articles found"
            print(f"⚠️ [{country}] No articles found")
            return result
        
        # Step 2: Find non-duplicate article
        article = None
        skipped_count = 0
        
        for art in articles:
            if is_duplicate(art['link'], art['title']):
                skipped_count += 1
                continue
            article = art
            break
        
        result["skipped"] = skipped_count
        
        if not article:
            result["status"] = "all_duplicates"
            result["error"] = f"All {len(articles)} articles are duplicates"
            print(f"⚠️ [{country}] All articles are duplicates (skipped {skipped_count})")
            return result
        
        if skipped_count > 0:
            print(f"📋 [{country}] Skipped {skipped_count} duplicates")
        
        # Step 3: Extract full content
        full_text = scraper.extract_article_content(article['link'])
        if not full_text:
            full_text = article.get('description', 'No content available.')

        # Step 3.5: Validate category against actual article content
        actual_category = ai.detect_category(article['title'], full_text, fallback_category=category)
        if actual_category != category:
            print(f"📂 [{country}] Category corrected: {category} → {actual_category}")
            category = actual_category

        # Step 4: AI Processing
        detected_country = ai.detect_country(article['title'], full_text)
        
        # Detect sub-topics (AI-powered)
        detected_topics = ai.detect_topics(
            article['title'],
            full_text,
            category
        )
        
        new_title, new_content, keywords, summary, citations = ai.rewrite_cnn_style(
            article['title'], 
            full_text, 
            detected_country, 
            category,
            article['link']
        )
        
        # Step 5: Generate Image
        article_id = str(uuid.uuid4())
        img_prompt = ai.generate_image_prompt(
            new_title, new_content, detected_country, category
        )
        img_path = ai.generate_image(img_prompt, article_id)
        
        # Step 6: Upload image if local file
        if img_path and not img_path.startswith("http"):
            img_url = storage.upload_image(img_path, f"news/{article_id}.png")
        else:
            img_url = img_path
        
        # Step 7: Save to Redis (Clean HTML and Markdown)
        article_data = {
            "id": article_id,
            "country": detected_country,
            "category": category,
            "topics": detected_topics,  # NEW: AI-detected sub-topics
            "title": clean_markdown(clean_html(new_title)),
            "summary": clean_markdown(clean_html(summary)),
            "content": clean_markdown(clean_html(new_content)),
            "keywords": clean_markdown(clean_html(keywords)),
            "citations": citations,
            "original_url": article['link'],
            "image_url": img_url,
            "timestamp": time.time(),
        }
        storage.save_article(article_data)
        
        # Step 8: Mark as processed (dedup)
        mark_as_processed(article['link'], article['title'])
        
        # Success
        result["status"] = "success"
        result["article_id"] = article_id
        result["title"] = new_title[:60] + "..."
        print(f"✅ [{country}] Published: {new_title[:50]}...")
        
    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)
        print(f"❌ [{country}] Error: {e}")
    
    result["duration"] = round(time.time() - start_time, 2)
    return result


# ═══════════════════════════════════════════════════════════════
# MAIN JOB (Hourly)
# ═══════════════════════════════════════════════════════════════

async def run_hourly_job():
    """
    Main scheduled job:
    - Runs 10 times per day
    - Processes ALL countries per run (parallel)
    - Each country: 1 article per run
    - PURGES old news (older than 24h) to keep feed fresh.
    """
    global job_status
    
    # Skip if already running
    if job_status["is_running"]:
        print("⚠️ Previous job still running, skipping...")
        return
    
    # Mark as running and clear any previous cancel request
    job_status["is_running"] = True
    job_status["cancel_requested"] = False
    job_status["last_run"] = datetime.now().isoformat()
    
    # Header
    print("\n" + "=" * 70)
    print(f"🚀 SCHEDULED JOB STARTED (FRESH NEWS MODE)")
    print(f"📅 Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    # Step 0: CLEANUP OLD NEWS (User Request: "mawala nana ig ugma")
    storage = StorageHandler()
    print("🧹 Cleaning up outdated news...")
    purged_count = storage.purge_old_articles(max_age_hours=24)
    if purged_count > 0:
        print(f"✨ Purged {purged_count} old articles.")

    # Process ALL countries (not rotating, all at once)
    all_countries = list(COUNTRIES.keys())
    countries = all_countries

    dedup_stats = get_dedup_stats()
    
    print(f"📍 Countries: {len(countries)} (Processing ALL in parallel)")
    print(f"📊 Articles per country: {ARTICLES_PER_COUNTRY}")
    print(f"📈 Total articles this run: {len(countries) * ARTICLES_PER_COUNTRY}")
    print(f"🔍 Dedup: {dedup_stats['urls_tracked']} URLs | {dedup_stats['titles_tracked']} titles tracked")
    print("-" * 70)
    
    # Process countries in batches so we can check cancel_requested between batches
    BATCH_SIZE = 5
    results = []
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        for i in range(0, len(countries), BATCH_SIZE):
            if job_status.get("cancel_requested"):
                print("\n🛑 Cancel requested. Stopping after current batch...")
                break
            batch = countries[i : i + BATCH_SIZE]
            futures = [
                loop.run_in_executor(executor, process_single_country, country)
                for country in batch
            ]
            batch_results = await asyncio.gather(*futures)
            results.extend(batch_results)
    
    cancelled = job_status.get("cancel_requested", False)
    if cancelled:
        print(f"⏹️ Job stopped by user. Processed {len(results)}/{len(countries)} countries.")
    
    # Calculate stats
    success_count = sum(1 for r in results if r["status"] == "success")
    error_count = sum(1 for r in results if r["status"] == "error")
    duplicate_count = sum(1 for r in results if r["status"] == "all_duplicates")
    no_fresh_count = sum(1 for r in results if r["status"] == "no_articles")
    total_skipped = sum(r.get("skipped", 0) for r in results)
    
    # Update job status
    job_status["total_runs"] += 1
    job_status["total_success"] += success_count
    job_status["total_errors"] += error_count
    job_status["total_skipped"] += total_skipped
    job_status["last_results"] = results
    job_status["is_running"] = False
    job_status["cancel_requested"] = False
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 JOB SUMMARY" + (" (CANCELLED)" if cancelled else ""))
    print("=" * 70)
    print(f"✅ Success:    {success_count}/{len(results)}" + (f" (of {len(countries)} planned)" if cancelled else ""))
    print(f"❌ Errors:     {error_count}")
    print(f"🔄 Duplicates: {duplicate_count} countries had no new articles")
    print(f"⏳ Stale/None: {no_fresh_count} countries had no fresh news")
    if cancelled:
        print(f"🛑 Cancelled:  {len(countries) - len(results)} countries not processed")
    print(f"⏭️ Skipped:    {total_skipped} duplicate articles")
    print(f"🧹 Purged:     {purged_count} old articles")
    print("-" * 70)
    
    # Show next run time
    if job_status["next_run"]:
        next_dt = datetime.fromisoformat(job_status["next_run"])
        # Make timezone-naive for comparison
        next_dt_naive = next_dt.replace(tzinfo=None)
        time_until = next_dt_naive - datetime.now()
        minutes = int(time_until.total_seconds() / 60)
        print(f"⏰ Next run: {next_dt.strftime('%Y-%m-%d %H:%M:%S')} ({minutes} min)")
    
    print("=" * 70 + "\n")
    
    # Send Discord notification
    if results and success_count > 0:
        send_discord_notification(results)

    return results


async def run_targeted_job(countries: list, categories: list) -> dict:
    """
    Manually triggered targeted job:
    - Runs process_single_country() for each country×category pair in parallel.
    - Does NOT affect global job_status (one-off manual run).
    - Returns same structure as TriggerScraperResponse.
    """
    start_time = time.time()
    pairs = [(country, category) for country in countries for category in categories]

    print(f"\n🎯 TARGETED SCRAPE: {len(countries)} countries × {len(categories)} categories = {len(pairs)} combinations")

    results = []
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [
            loop.run_in_executor(executor, process_single_country, country, category)
            for country, category in pairs
        ]
        results = list(await asyncio.gather(*futures))

    success_count = sum(1 for r in results if r["status"] == "success")
    error_count = sum(1 for r in results if r["status"] == "error")
    duration = round(time.time() - start_time, 2)

    print(f"✅ Targeted scrape done: {success_count}/{len(pairs)} success in {duration}s")

    return {
        "status": "completed",
        "message": f"Targeted scrape finished: {success_count} articles scraped",
        "duration_seconds": duration,
        "success_count": success_count,
        "error_count": error_count,
        "results": [
            {
                "country": r.get("country"),
                "category": r.get("category"),
                "status": r["status"],
                "count": 1 if r["status"] == "success" else 0,
                "message": r.get("title") or r.get("error") or r["status"],
            }
            for r in results
        ],
        "timestamp": datetime.now().isoformat(),
    }


async def run_sports_job():
    """Trigger job specifically for category: Sports."""
    print("\n" + "=" * 70)
    print(f"⚽ SPORTS GENERATION JOB STARTED")
    print("=" * 70)
    
    all_countries = list(COUNTRIES.keys())
    # Process all countries for Sports
    countries = all_countries 
    
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [
            loop.run_in_executor(executor, process_single_country, country, "Sports")
            for country in countries
        ]
        results = await asyncio.gather(*futures)
        
    success_count = sum(1 for r in results if r["status"] == "success")
    print(f"\n⚽ Sports Summary: {success_count} articles published.")
    return results
