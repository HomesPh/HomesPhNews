"""
HomesPh Global News Engine - Scraper
Enterprise-grade multi-country, multi-category news crawler using Google News RSS.
Now with Parallel Execution & Smart Caching (No more N+1 lag).
"""

import os
import re
import time
import json
import feedparser
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock
from newspaper import Article
from dotenv import load_dotenv
from config import COUNTRIES, CATEGORIES, SCRAPER_SETTINGS

load_dotenv()

# Setup Caching
CACHE_FILE = "scraper_cache.json"
CACHE_TTL = 3600  # 1 hour cache
print_lock = Lock()

def clean_html(raw_html):
    """Remove HTML tags and return clean text."""
    if not raw_html:
        return ""
    # Remove HTML tags
    clean_text = re.sub(r'<[^>]+>', '', raw_html)
    # Clean up extra whitespace
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    return clean_text

class ScraperCache:
    """Simple JSON-based cache to avoid re-fetching the same RSS feeds repeatedly."""
    def __init__(self):
        self.cache = {}
        self.load_cache()

    def load_cache(self):
        if os.path.exists(CACHE_FILE):
            try:
                with open(CACHE_FILE, "r", encoding="utf-8") as f:
                    self.cache = json.load(f)
            except Exception:
                self.cache = {}

    def save_cache(self):
        try:
            with open(CACHE_FILE, "w", encoding="utf-8") as f:
                json.dump(self.cache, f, indent=4)
        except Exception as e:
            print(f"⚠️ Cache Save Error: {e}")

    def get(self, key):
        if key in self.cache:
            entry = self.cache[key]
            if time.time() - entry["timestamp"] < CACHE_TTL:
                return entry["data"]
        return None

    def set(self, key, data):
        self.cache[key] = {
            "timestamp": time.time(),
            "data": data
        }
        self.save_cache()

class NewsScraper:
    def __init__(self):
        self.settings = SCRAPER_SETTINGS
        self.cache = ScraperCache()
        
    def build_rss_url(self, keyword, country_code):
        """Builds a Google News RSS URL for a specific country and keyword."""
        config = COUNTRIES.get(country_code, {"gl": "US", "hl": "en", "ceid": "US:en"})
        query = f"Filipino {keyword} {country_code}"
        encoded_query = urllib.parse.quote(query)
        return f"https://news.google.com/rss/search?q={encoded_query}&hl={config['hl']}&gl={config['gl']}&ceid={config['ceid']}"

    def fetch_news(self, keyword, country, use_cache=True):
        """
        Fetches news from Google News RSS for a specific country and keyword.
        Uses cache if available to prevent lag.
        """
        cache_key = f"{country}:{keyword}"
        
        # 1. Check Cache
        if use_cache:
            cached_data = self.cache.get(cache_key)
            if cached_data:
                with print_lock:
                    print(f"⚡ [{country}] Cache Hit: {keyword} ({len(cached_data)} articles)")
                return cached_data

        config = COUNTRIES.get(country)
        if not config:
            return []
            
        rss_url = self.build_rss_url(keyword, country)
        with print_lock:
            print(f"📡 [{country}] Crawling: {keyword}")
        
        try:
            feed = feedparser.parse(rss_url)
            articles = []
            
            for entry in feed.entries[:self.settings["articles_per_search"]]:
                articles.append({
                    "title": entry.title,
                    "link": entry.link,
                    "published": getattr(entry, 'published', 'Unknown'),
                    "source": getattr(entry, 'source', {}).get('title', 'Unknown'),
                    "description": clean_html(getattr(entry, 'summary', '')),
                    "country": country,
                    "category": keyword,
                })
            
            with print_lock:
                print(f"   ✅ Found {len(articles)} articles for {country} - {keyword}")
            
            # 2. Save to Cache
            self.cache.set(cache_key, articles)
            
            return articles
            
        except Exception as e:
            with print_lock:
                print(f"❌ [{country}] RSS Error: {e}")
            return []

    def extract_article_content(self, url):
        """Extracts full article text using Newspaper3k."""
        try:
            article = Article(url, user_agent=self.settings["user_agent"])
            article.download()
            article.parse()
            return article.text
        except Exception as e:
            print(f"⚠️ Content extraction failed: {e}")
            return ""

    def run_full_crawl(self, countries=None, categories=None):
        """
        Runs a full crawl across all configured countries and categories.
        NOW USES PARALLEL EXECUTION (THREADING) to fix N+1 issue.
        """
        target_countries = countries or list(COUNTRIES.keys())
        target_categories = categories or CATEGORIES
        
        all_tasks = []
        all_articles = []
        
        print(f"\n🌍 Starting Parallel Crawl: {len(target_countries)} countries × {len(target_categories)} categories")
        print("=" * 60)
        
        # Create all combinations
        for country in target_countries:
            for category in target_categories:
                all_tasks.append((country, category))
        
        # Parallel Execution
        # We use max_workers=10 to parallelize the HTTP requests
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_task = {
                executor.submit(self.fetch_news, category, country): (country, category)
                for country, category in all_tasks
            }
            
            for future in as_completed(future_to_task):
                country, category = future_to_task[future]
                try:
                    articles = future.result()
                    all_articles.extend(articles)
                except Exception as e:
                    with print_lock:
                        print(f"❌ Task failed ({country}-{category}): {e}")
        
        print("\n" + "=" * 60)
        print(f"🏁 Crawl Complete: {len(all_articles)} total articles discovered")
        return all_articles

    def run_single_country(self, country, categories=None):
        """Runs a crawl for a single country across all categories."""
        target_categories = categories or CATEGORIES
        return self.run_full_crawl(countries=[country], categories=target_categories)

    def run_single_category(self, category, countries=None):
        """Runs a crawl for a single category across all countries."""
        target_countries = countries or list(COUNTRIES.keys())
        return self.run_full_crawl(countries=target_countries, categories=[category])


if __name__ == "__main__":
    scraper = NewsScraper()
    
    # Demo: Parallel Test
    print("Testing Parallel Fetching...")
    start = time.time()
    scraper.run_full_crawl(countries=["Philippines", "UAE"], categories=["Real Estate", "Business"])
    print(f"⏱️ Duration: {time.time() - start:.2f}s")
