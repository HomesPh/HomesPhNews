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
    "last_results": [],
    "total_runs": 0,
    "total_success": 0,
    "total_errors": 0,
    "total_skipped": 0
}


def get_job_status() -> Dict:
    """Get current job status."""
    return job_status


def update_next_run(next_run_time: str):
    """Update next scheduled run time."""
    job_status["next_run"] = next_run_time
    print(f"⏰ Next scheduled run: {next_run_time}")


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


# ═══════════════════════════════════════════════════════════════
# COUNTRY PROCESSOR
# ═══════════════════════════════════════════════════════════════

def process_single_country(country: str) -> Dict:
    """
    Process one country:
    1. Pick random category
    2. Scrape articles
    3. Check for duplicates
    4. AI processing (rewrite + image)
    5. Save to Redis
    
    Returns dict with status and results.
    """
    # Initialize services (thread-safe)
    scraper = NewsScraper()
    ai = AIProcessor()
    storage = StorageHandler()
    
    start_time = time.time()
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
        
        # Step 4: AI Processing
        detected_country = ai.detect_country(article['title'], full_text)
        
        # Detect sub-topics (AI-powered)
        detected_topics = ai.detect_topics(
            article['title'],
            full_text,
            category
        )
        
        new_title, new_content, keywords = ai.rewrite_cnn_style(
            article['title'], 
            full_text, 
            detected_country, 
            category
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
            "content": clean_markdown(clean_html(new_content)),
            "keywords": clean_markdown(clean_html(keywords)),
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
    - Runs every hour
    - Processes all countries in parallel
    - Skips duplicate articles
    - Updates job status
    """
    global job_status
    
    # Skip if already running
    if job_status["is_running"]:
        print("⚠️ Previous job still running, skipping...")
        return
    
    # Mark as running
    job_status["is_running"] = True
    job_status["last_run"] = datetime.now().isoformat()
    
    # Header
    print("\n" + "=" * 70)
    print(f"🚀 SCHEDULED JOB STARTED")
    print(f"📅 Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    countries = list(COUNTRIES.keys())
    dedup_stats = get_dedup_stats()
    
    print(f"📋 Countries: {len(countries)} | Workers: {MAX_WORKERS}")
    print(f"🔍 Dedup: {dedup_stats['urls_tracked']} URLs | {dedup_stats['titles_tracked']} titles tracked")
    print("-" * 70)
    
    # Process countries in parallel using ThreadPoolExecutor
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [
            loop.run_in_executor(executor, process_single_country, country)
            for country in countries
        ]
        results = await asyncio.gather(*futures)
    
    # Calculate stats
    success_count = sum(1 for r in results if r["status"] == "success")
    error_count = sum(1 for r in results if r["status"] == "error")
    duplicate_count = sum(1 for r in results if r["status"] == "all_duplicates")
    total_skipped = sum(r.get("skipped", 0) for r in results)
    
    # Update job status
    job_status["total_runs"] += 1
    job_status["total_success"] += success_count
    job_status["total_errors"] += error_count
    job_status["total_skipped"] += total_skipped
    job_status["last_results"] = results
    job_status["is_running"] = False
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 JOB SUMMARY")
    print("=" * 70)
    print(f"✅ Success:    {success_count}/{len(countries)}")
    print(f"❌ Errors:     {error_count}")
    print(f"🔄 Duplicates: {duplicate_count} countries had no new articles")
    print(f"⏭️ Skipped:    {total_skipped} duplicate articles")
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
    
    return results
