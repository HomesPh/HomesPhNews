"""
HomesPh Global News Engine - Automated Pipeline
This is the main automation script for cron jobs / scheduled tasks.
Handles: Full crawl → AI Processing → Storage
"""

import uuid
import time
from scraper import NewsScraper
from ai_service import AIProcessor
from storage import StorageHandler
from config import COUNTRIES, CATEGORIES

class NewsPipeline:
    def __init__(self):
        print("\n" + "=" * 60)
        print("🚀 HomesPh Global News Engine - Initializing")
        print("=" * 60)
        
        self.scraper = NewsScraper()
        self.ai = AIProcessor()
        self.storage = StorageHandler()
        
        self.stats = {
            "crawled": 0,
            "processed": 0,
            "failed": 0,
        }

    def process_article(self, raw_article):
        """
        Processes a single article through the AI pipeline.
        Returns the processed article data or None if failed.
        """
        try:
            article_id = str(uuid.uuid4())
            
            # 1. Extract full content
            full_text = self.scraper.extract_article_content(raw_article['link'])
            if not full_text:
                full_text = raw_article.get('description', '')
            
            if len(full_text) < 50:
                print(f"   ⚠️ Skipping (content too short): {raw_article['title'][:40]}...")
                return None
            
            # 2. Detect country (AI verification)
            detected_country = self.ai.detect_country(raw_article['title'], full_text)
            
            # 3. Rewrite in CNN style
            new_title, new_content, keywords = self.ai.rewrite_cnn_style(
                raw_article['title'],
                full_text,
                detected_country,
                raw_article.get('category', 'General')
            )
            
            # 4. Generate image
            img_prompt = self.ai.generate_image_prompt(
                new_title, 
                new_content, 
                detected_country, 
                raw_article.get('category', 'General')
            )
            img_path = self.ai.generate_image(img_prompt, article_id)
            
            # 5. Upload image to GCP if local
            if img_path and not img_path.startswith("http"):
                img_url = self.storage.upload_image(
                    img_path, 
                    f"news/{detected_country.lower().replace(' ', '_')}/{article_id}.png"
                )
            else:
                img_url = img_path
            
            # 6. Prepare final data
            article_data = {
                "id": article_id,
                "country": detected_country,
                "category": raw_article.get('category', 'General'),
                "original_title": raw_article['title'],
                "title": new_title,
                "content": new_content,
                "keywords": keywords,
                "original_url": raw_article['link'],
                "source": raw_article.get('source', 'Unknown'),
                "image_url": img_url,
                "timestamp": time.time(),
            }
            
            # 7. Save to Redis
            self.storage.save_article(article_data)
            
            print(f"   ✅ Processed: [{detected_country}] {new_title[:50]}...")
            self.stats["processed"] += 1
            return article_data
            
        except Exception as e:
            print(f"   ❌ Failed: {raw_article['title'][:40]}... Error: {e}")
            self.stats["failed"] += 1
            return None

    def run_full_pipeline(self, countries=None, categories=None, limit_per_search=5):
        """
        Runs the complete pipeline:
        1. Crawl news from all countries/categories
        2. Process each article through AI
        3. Store in Redis with proper indexing
        """
        start_time = time.time()
        
        # 1. Crawl
        print("\n📡 PHASE 1: Crawling News Sources")
        print("-" * 40)
        raw_articles = self.scraper.run_full_crawl(countries=countries, categories=categories)
        self.stats["crawled"] = len(raw_articles)
        
        # 2. Process (with limit for testing)
        print("\n🤖 PHASE 2: AI Processing")
        print("-" * 40)
        
        processed_count = 0
        for i, article in enumerate(raw_articles):
            if limit_per_search and processed_count >= limit_per_search:
                print(f"\n⚠️ Reached processing limit ({limit_per_search}). Stopping.")
                break
                
            print(f"\n[{i+1}/{len(raw_articles)}] Processing...")
            result = self.process_article(article)
            if result:
                processed_count += 1
        
        # 3. Summary
        elapsed = time.time() - start_time
        print("\n" + "=" * 60)
        print("📊 PIPELINE COMPLETE")
        print("=" * 60)
        print(f"   Crawled:   {self.stats['crawled']} articles")
        print(f"   Processed: {self.stats['processed']} articles")
        print(f"   Failed:    {self.stats['failed']} articles")
        print(f"   Time:      {elapsed:.1f} seconds")
        print(f"\n   Stats: {self.storage.get_stats()}")
        print("=" * 60)

    def run_single_country(self, country, categories=None, limit=5):
        """Runs the pipeline for a single country."""
        print(f"\n🎯 Running pipeline for: {country}")
        self.run_full_pipeline(countries=[country], categories=categories, limit_per_search=limit)

    def run_single_category(self, category, countries=None, limit=5):
        """Runs the pipeline for a single category across all countries."""
        print(f"\n🎯 Running pipeline for category: {category}")
        self.run_full_pipeline(countries=countries, categories=[category], limit_per_search=limit)


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="HomesPh News Pipeline")
    parser.add_argument("--country", help="Process specific country only")
    parser.add_argument("--category", help="Process specific category only")
    parser.add_argument("--limit", type=int, default=5, help="Max articles to process")
    parser.add_argument("--full", action="store_true", help="Run full crawl (all countries, all categories)")
    
    args = parser.parse_args()
    
    pipeline = NewsPipeline()
    
    if args.full:
        pipeline.run_full_pipeline(limit_per_search=args.limit)
    elif args.country:
        pipeline.run_single_country(args.country, limit=args.limit)
    elif args.category:
        pipeline.run_single_category(args.category, limit=args.limit)
    else:
        # Default: Single country demo
        pipeline.run_single_country("Philippines", categories=["Real Estate"], limit=3)
