"""
HomesPh Global News Engine - Restaurant Automated Pipeline
Specialized pipeline for structured restaurant discovery.
"""

import time
import asyncio
from scheduler import run_restaurant_job

class RestaurantPipeline:
    def __init__(self):
        print("\n" + "=" * 60)
        print("🍴 HomesPh Restaurant Engine - Initializing")
        print("=" * 60)

    async def run_sync(self):
        """Runs the restaurant crawl and wait for result."""
        start_time = time.time()
        print("\n📡 PHASE 1: Crawling Restaurant Sources & AI Extraction")
        print("-" * 40)
        
        results = await run_restaurant_job()
        
        # Summary
        elapsed = time.time() - start_time
        success = sum(1 for r in results if r["status"] == "success")
        
        print("\n" + "=" * 60)
        print("📊 RESTAURANT PIPELINE COMPLETE")
        print("=" * 60)
        print(f"   Processed: {len(results)} countries")
        print(f"   Success:   {success} restaurants added")
        print(f"   Time:      {elapsed:.1f} seconds")
        print("=" * 60)

if __name__ == "__main__":
    pipeline = RestaurantPipeline()
    asyncio.run(pipeline.run_sync())
