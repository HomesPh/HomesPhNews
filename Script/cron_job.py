"""
HomesPh Global News Engine - Automated Cron Job
Runs every hour and produces 1 article per country with random category.

Usage:
    python cron_job.py              # Run once
    python cron_job.py --schedule   # Run on schedule (every hour)
"""

import time
import random
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

from scraper import NewsScraper
from ai_service import AIProcessor
from storage import StorageHandler
from config import COUNTRIES, CATEGORIES


# ═══════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════

MAX_WORKERS = 4  # Parallel threads (don't overload API)
ARTICLES_PER_COUNTRY = 1


def process_country(country: str, scraper: NewsScraper, ai: AIProcessor, storage: StorageHandler) -> dict:
    """
    Process a single country:
    1. Pick random category
    2. Scrape 1 article
    3. AI process (rewrite + image)
    4. Save to Redis
    """
    start_time = time.time()
    category = random.choice(CATEGORIES)
    
    result = {
        "country": country,
        "category": category,
        "status": "pending",
        "article_id": None,
        "title": None,
        "error": None,
        "duration": 0
    }
    
    try:
        print(f"🌍 [{country}] Starting... Category: {category}")
        
        # 1. Scrape articles
        articles = scraper.fetch_news(category, country)
        
        if not articles:
            result["status"] = "no_articles"
            result["error"] = "No articles found"
            print(f"⚠️ [{country}] No articles found for {category}")
            return result
        
        # 2. Pick best article (first one)
        article = articles[0]
        
        # 3. Extract full content
        full_text = scraper.extract_article_content(article['link'])
        if not full_text:
            full_text = article.get('description', 'No content available.')
        
        # 4. AI Processing
        detected_country = ai.detect_country(article['title'], full_text)
        new_title, new_content, keywords, summary, citations = ai.rewrite_cnn_style(
            article['title'], 
            full_text, 
            detected_country, 
            category,
            article['link']
        )
        
        # 5. Generate Image
        import uuid
        article_id = str(uuid.uuid4())
        img_prompt = ai.generate_image_prompt(new_title, new_content, detected_country, category)
        img_path = ai.generate_image(img_prompt, article_id)
        
        # 6. Upload image if local
        if img_path and not img_path.startswith("http"):
            img_url = storage.upload_image(img_path, f"news/{article_id}.png")
        else:
            img_url = img_path
        
        # 7. Save to Redis
        article_data = {
            "id": article_id,
            "country": detected_country,
            "category": category,
            "title": new_title,
            "summary": summary,
            "content": new_content,
            "keywords": keywords,
            "citations": citations,
            "original_url": article['link'],
            "image_url": img_url,
            "timestamp": time.time(),
            "source": article.get('source', 'Unknown')
        }
        storage.save_article(article_data)
        
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


def run_hourly_job():
    """
    Main job: Process all countries in parallel.
    Includes cleanup of old news.
    """
    print("\n" + "=" * 70)
    print(f"🚀 HOMESPH FRESH CRON JOB STARTED - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    start_time = time.time()
    
    # Initialize services
    scraper = NewsScraper()
    ai = AIProcessor()
    storage = StorageHandler()
    
    # Step 0: Cleanup old news
    print("🧹 Cleaning up outdated news (>24h)...")
    purged = storage.purge_old_articles(max_age_hours=24)
    if purged > 0:
        print(f"✨ Purged {purged} old articles.")

    # Select countries
    # ⚠️ For production, use all countries: countries = list(COUNTRIES.keys())
    selected_country = random.choice(list(COUNTRIES.keys()))
    countries = [selected_country]
    
    results = []
    print(f"📋 Mode: FRESH NEWS ONLY | Processing: {countries[0]}")
    print("-" * 70)
    
    # Process countries in parallel
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {
            executor.submit(process_country, country, scraper, ai, storage): country 
            for country in countries
        }
        
        for future in as_completed(futures):
            result = future.result()
            results.append(result)
    
    # Summary
    total_time = round(time.time() - start_time, 2)
    success_count = sum(1 for r in results if r["status"] == "success")
    error_count = sum(1 for r in results if r["status"] == "error")
    no_articles = sum(1 for r in results if r["status"] == "no_articles")
    
    print("\n" + "=" * 70)
    print("📊 JOB SUMMARY")
    print("=" * 70)
    print(f"✅ Success:     {success_count}/{len(countries)}")
    print(f"❌ Errors:      {error_count}")
    print(f"⏳ Stale/None:  {no_articles} countries had no fresh news")
    print(f"🧹 Purged:      {purged} old articles removed")
    print(f"⏱️ Total Time:  {total_time}s")
    print("-" * 70)
    
    # Detailed results
    for r in results:
        icon = "✅" if r["status"] == "success" else "❌" if r["status"] == "error" else "⏳"
        status_text = r.get("title", r.get("error", "No fresh articles found"))
        print(f"{icon} {r['country'][:15]:15} | {r['category']:12} | {r['duration']:5}s | {status_text[:35]}")
    
    print("=" * 70)
    print(f"🏁 JOB COMPLETED - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70 + "\n")
    
    return results


def run_scheduler():
    """
    Start the APScheduler to run every hour.
    """
    scheduler = BlockingScheduler()
    
    # Run every hour at minute 0
    scheduler.add_job(
        run_hourly_job, 
        CronTrigger(minute=0), # Every hour at :00
        id='hourly_news_job',
        name='HomesPh Fresh Hourly News Scraper'
    )
    
    print("=" * 70)
    print("📅 HOMESPH FRESH NEWS SCHEDULER STARTED")
    print("=" * 70)
    print("⏰ Schedule: EVERY HOUR (Real-time mode)")
    print("🔥 Mode:     FRESH NEWS ONLY (<24h)")
    print("🧹 Cleanup:  Auto-purge >24h old articles")
    print("-" * 70)
    print("Press Ctrl+C to stop")
    print("=" * 70)
    
    # Run immediately on start, then every hour
    run_hourly_job()
    
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        print("\n👋 Scheduler stopped.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="HomesPh Cron Job")
    parser.add_argument("--schedule", action="store_true", help="Run on hourly schedule")
    parser.add_argument("--workers", type=int, default=4, help="Number of parallel workers")
    
    args = parser.parse_args()
    MAX_WORKERS = args.workers
    
    if args.schedule:
        run_scheduler()
    else:
        run_hourly_job()
