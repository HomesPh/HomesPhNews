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

from config import COUNTRIES, CATEGORIES, RESTAURANT_CATEGORIES
from scraper import NewsScraper, clean_html
from restaurant_scraper import RestaurantScraper
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
                country_lines.append(f"{flag} **{country}**: 1 ✅")
            elif r["status"] == "error":
                err_msg = r.get("error", "Unknown error")[:30]
                country_lines.append(f"{flag} **{country}**: ❌ `{err_msg}`")
            elif r["status"] == "all_duplicates":
                country_lines.append(f"{flag} **{country}**: ⏭️ Skipped (duplicates)")
        
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
            articles_text += f"\n*...and {len(article_titles) - 5} more*"
        
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
            "description": f"Processed **{total_countries} countries** with **{success} successful** articles.",
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


def process_single_restaurant_country(country: str) -> Dict:
    """
    Process one country for restaurants:
    1. Scrape restaurant links
    2. Extract and structure data with AI
    3. Save to Redis
    """
    scraper = RestaurantScraper()
    ai = AIProcessor()
    storage = StorageHandler()
    
    start_time = time.time()
    # Pick a random restaurant category
    category = random.choice(RESTAURANT_CATEGORIES)
    
    result = {
        "country": country,
        "category": category,
        "status": "pending",
        "restaurant_id": None,
        "name": None,
        "error": None,
        "duration": 0
    }
    
    try:
        print(f"🍴 [{country}] Searching Restaurants... Category: {category}")
        
        # Step 1: Scrape potential restaurants
        raw_items = scraper.fetch_restaurant_data(category, country)
        if not raw_items:
            result["status"] = "no_restaurants"
            result["error"] = "No restaurants found"
            return result
            
        # Step 2: Pick one and process
        # For simplicity, we pick the first one not already processed (dedup)
        target_item = None
        for item in raw_items:
            if not is_duplicate(item["url"], item["raw_title"]):
                target_item = item
                break
        
        if not target_item:
            result["status"] = "all_duplicates"
            return result

        # Step 3: AI extraction - Try multiple items until we find a REAL restaurant
        restaurant_data = None
        processed_count = 0
        max_attempts = min(5, len(raw_items))  # Try up to 5 items
        
        for item in raw_items:
            if is_duplicate(item["url"], item["raw_title"]):
                continue
            
            processed_count += 1
            if processed_count > max_attempts:
                break
                
            restaurant_data = scraper.process_with_ai(item)
            
            # If we got real restaurant data, use this item
            if restaurant_data:
                target_item = item
                break
        
        # Skip if no real restaurant found in any article
        if not restaurant_data:
            result["status"] = "no_real_restaurant"
            result["error"] = "No specific restaurant found in articles"
            return result
        
        # Step 4: Save to Redis
        rid = restaurant_data["id"]
        
        # Save structured data
        redis_client.set(f"{PREFIX}restaurant:{rid}", json.dumps(restaurant_data))
        # Add to global list
        redis_client.sadd(f"{PREFIX}all_restaurants", rid)
        # Add to country list
        redis_client.sadd(f"{PREFIX}country:{country.lower().replace(' ', '_')}:restaurants", rid)
        
        # Mark as processed (dedup)
        mark_as_processed(target_item["url"], target_item["raw_title"])
        
        result["status"] = "success"
        result["restaurant_id"] = rid
        result["name"] = restaurant_data["name"]
        print(f"✅ [{country}] Saved Restaurant: {restaurant_data['name']}")
        
    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)
        print(f"❌ [{country}] Restaurant Error: {e}")
        
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
    - Over 10 runs: Each country gets 10 articles/day
    - Total: 12 countries × 1 article × 10 runs = 120 articles/day
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
    
    # Process ALL countries (not rotating, all at once)
    all_countries = list(COUNTRIES.keys())
    countries = all_countries

    dedup_stats = get_dedup_stats()
    
    print(f"📍 Countries: {len(countries)} (Processing ALL in parallel)")
    print(f"📊 Articles per country: {ARTICLES_PER_COUNTRY}")
    print(f"📈 Total articles this run: {len(countries) * ARTICLES_PER_COUNTRY}")
    print(f"💡 Each country gets 10/day over 10 runs")
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
    
    # Send Discord notification
    if results and success_count > 0:
        send_discord_notification(results)
    
    return results


async def run_restaurant_job():
    """Trigger job specifically for restaurants."""
    # Similar logic to run_hourly_job but for restaurants
    print("\n" + "=" * 70)
    print(f"🍴 RESTAURANT JOB STARTED")
    print("=" * 70)
    
    all_countries = list(COUNTRIES.keys())
    # Test with a few countries first or all
    countries = all_countries 
    
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [
            loop.run_in_executor(executor, process_single_restaurant_country, country)
            for country in countries
        ]
        results = await asyncio.gather(*futures)
        
    success_count = sum(1 for r in results if r["status"] == "success")
    print(f"\n🍴 Restaurant Summary: {success_count} restaurants found.")
    return results


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
