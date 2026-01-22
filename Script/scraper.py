"""
HomesPh Global News Engine - Scraper
Enterprise-grade multi-country, multi-category news crawler using Google News RSS.
"""

import os
import re
import time
import feedparser
import urllib.parse
from newspaper import Article
from dotenv import load_dotenv
from config import COUNTRIES, CATEGORIES, SCRAPER_SETTINGS

load_dotenv()

def clean_html(raw_html):
    """Remove HTML tags and return clean text."""
    if not raw_html:
        return ""
    # Remove HTML tags
    clean_text = re.sub(r'<[^>]+>', '', raw_html)
    # Clean up extra whitespace
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    return clean_text

class NewsScraper:
    def __init__(self):
        self.settings = SCRAPER_SETTINGS
        
    def build_rss_url(self, keyword, country_code):
        """Builds a Google News RSS URL for a specific country and keyword."""
        config = COUNTRIES.get(country_code, COUNTRIES["United States"])
        encoded_query = urllib.parse.quote(f"{keyword}")
        return f"https://news.google.com/rss/search?q={encoded_query}&hl={config['hl']}&gl={config['gl']}&ceid={config['ceid']}"

    def fetch_news(self, keyword, country):
        """Fetches news from Google News RSS for a specific country and keyword."""
        config = COUNTRIES.get(country)
        if not config:
            print(f"⚠️ Country '{country}' not configured. Skipping.")
            return []
            
        rss_url = self.build_rss_url(keyword, country)
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
            
            print(f"   ✅ Found {len(articles)} articles for {country} - {keyword}")
            return articles
            
        except Exception as e:
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
        Returns a list of all discovered articles.
        """
        target_countries = countries or list(COUNTRIES.keys())
        target_categories = categories or CATEGORIES
        
        all_articles = []
        total_combinations = len(target_countries) * len(target_categories)
        current = 0
        
        print(f"\n🌍 Starting Global Crawl: {len(target_countries)} countries × {len(target_categories)} categories")
        print("=" * 60)
        
        for country in target_countries:
            for category in target_categories:
                current += 1
                print(f"\n[{current}/{total_combinations}]", end=" ")
                
                articles = self.fetch_news(category, country)
                all_articles.extend(articles)
                
                # Rate limiting
                time.sleep(self.settings["request_delay_seconds"])
        
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
    
    # Demo: Single country, single category
    articles = scraper.fetch_news("Real Estate", "Philippines")
    for art in articles[:3]:
        print(f"  → {art['title']} ({art['source']})")
