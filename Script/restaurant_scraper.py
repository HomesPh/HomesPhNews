"""
HomesPh Global News Engine - Restaurant Scraper
Specialized scraper for REAL LOCAL Filipino restaurants worldwide.
Focus on: indie restaurants, Filipino-owned businesses, exact addresses with geolocation.
"""

import os
import re
import time
import uuid
import json
import random
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock
from newspaper import Article
from dotenv import load_dotenv
from config import COUNTRIES, RESTAURANT_CATEGORIES, SCRAPER_SETTINGS
from scraper import NewsScraper, clean_html
from ai_service import AIProcessor

import requests

load_dotenv()

print_lock = Lock()

# Google Maps API Key for Geocoding
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")


class RestaurantScraper(NewsScraper):
    def __init__(self):
        super().__init__()
        self.ai = AIProcessor()
        self.categories = RESTAURANT_CATEGORIES
        self.google_maps_key = GOOGLE_MAPS_API_KEY
        
        if self.google_maps_key:
            print("✅ Google Maps Geocoding API Enabled")
        else:
            print("⚠️ No GOOGLE_MAPS_API_KEY found - geocoding disabled")

    def build_restaurant_query(self, category, country):
        """
        Builds SPECIFIC queries to find LOCAL Filipino restaurants.
        Avoids generic chains, focuses on indie/local spots.
        """
        # Different query strategies to get variety
        query_templates = [
            # Local/indie focus
            f"new Filipino restaurant opened {country} 2025 2026",
            f"best local Filipino restaurant {country} hidden gem",
            f"Filipino food truck {country} review",
            f"Filipino pop-up restaurant {country}",
            f"Filipino owned restaurant {country} featured",
            f"authentic Filipino restaurant {country} must try",
            f"pinoy restaurant {country} lechon adobo sinigang",
            # Category specific
            f"{category} Filipino restaurant {country}",
            # News/review focus
            f"Filipino restaurant {country} grand opening 2025",
            f"Filipino chef opens restaurant {country}",
        ]
        
        # Pick based on category
        if category == "Chef Interviews":
            return f"Filipino chef opens restaurant {country}"
        elif category == "Michelin Guide":
            return f"Filipino restaurant Michelin star {country}"
        elif category == "Fine Dining":
            return f"upscale Filipino restaurant {country} tasting menu"
        elif category == "Casual Dining":
            return f"new casual Filipino restaurant {country} grand opening"
        elif category == "Fast Food Industry":
            # Avoid Jollibee - look for local fast food Filipino spots
            return f"Filipino fast food restaurant {country} NOT Jollibee local"
        else:
            # Random variety
            return random.choice(query_templates)

    def fetch_restaurant_data(self, category, country, use_cache=True):
        """Fetches potential restaurant data from news/web sources."""
        query = self.build_restaurant_query(category, country)
        
        # We reuse fetch_news logic but with a different query style
        raw_results = self.fetch_news(query, country, use_cache=use_cache)
        
        restaurant_items = []
        
        for item in raw_results:
            restaurant_items.append({
                "raw_title": item["title"],
                "url": item["link"],
                "source": item["source"],
                "country": country,
                "category": category,
                "description": item["description"]
            })
            
        return restaurant_items

    def geocode_address(self, address, restaurant_name="", city="", country=""):
        """
        Uses Google Maps Geocoding API to get lat/long from address.
        """
        if not self.google_maps_key or not address:
            return None, None, address
            
        # Clean address - if it contains junk phrases, skip geocoding
        junk_phrases = ["not provided", "not mentioned", "unknown", "n/a", "specific address", "various", "unnamed"]
        if any(phrase in address.lower() for phrase in junk_phrases):
            return None, None, address
        
        # Build search query - prefer full address, fallback to restaurant+city+country
        search_query = address
        if not address or len(address) < 10:
            if restaurant_name and city:
                search_query = f"{restaurant_name}, {city}, {country}"
            else:
                return None, None, address
        
        try:
            url = "https://maps.googleapis.com/maps/api/geocode/json"
            params = {
                "address": search_query,
                "key": self.google_maps_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if data.get("status") == "OK" and data.get("results"):
                result = data["results"][0]
                location = result["geometry"]["location"]
                formatted_address = result.get("formatted_address", address)
                
                lat = location["lat"]
                lng = location["lng"]
                
                print(f"   📍 Google Maps: {search_query[:40]}... → ({lat:.4f}, {lng:.4f})")
                return lat, lng, formatted_address
            else:
                print(f"   ⚠️ Geocoding no results for: {search_query[:40]}")
                return None, None, address
                
        except Exception as e:
            print(f"   ⚠️ Google Maps API error: {e}")
            return None, None, address

    def process_with_ai(self, raw_item):
        """
        Uses AI to extract REAL restaurant data from news articles.
        Focus on: actual restaurant names, exact addresses, Filipino-owned businesses.
        """
        print(f"   📝 Processing: {raw_item['raw_title'][:50]}...")
        
        # 1. Fetch full content for better extraction
        content = self.extract_article_content(raw_item["url"]) or raw_item["description"]
        
        if not content or len(content) < 50:
            content = raw_item["description"] or raw_item["raw_title"]
        
        # 2. Ask AI to extract REAL restaurant details
        details = self.ai.extract_restaurant_details(
            raw_item["raw_title"], 
            content, 
            raw_item["country"], 
            raw_item["category"]
        )
        
        # Skip if no real restaurant found (AI returns None)
        if not details:
            return None
        
        # 3. GEOCODING - Get real lat/long coordinates!
        address = details.get("address", "")
        city = details.get("city", "")
        restaurant_name = details.get("name", "")
        country = raw_item["country"]
        
        latitude, longitude, formatted_address = self.geocode_address(
            address, 
            restaurant_name, 
            city, 
            country
        )
        
        # Update address if we got a better one
        if formatted_address and formatted_address != address:
            details["address"] = formatted_address
        
        # 4. Generate Google Maps URL with coordinates if available
        if latitude and longitude:
            google_maps_url = f"https://www.google.com/maps?q={latitude},{longitude}"
        else:
            # Fallback to search URL
            search_term = f"{restaurant_name} {city} {country}".replace(" ", "+")
            google_maps_url = f"https://www.google.com/maps/search/{search_term}"
        
        # 5. Generate image for the restaurant
        food_type = details.get('food_topics', details.get('cuisine_type', 'Filipino food'))
        img_prompt = f"Professional food photography, {food_type} dishes, Filipino restaurant in {raw_item['country']}, appetizing plating, warm lighting, Instagram-worthy presentation, delicious comfort food"
        img_url = self.ai.generate_image(img_prompt, str(uuid.uuid4()))
        
        # 6. Build the full Restaurant model data with ALL new fields
        restaurant_data = {
            "id": str(uuid.uuid4()),
            "name": details.get("name"),
            "country": raw_item["country"],
            "city": details.get("city", ""),
            "cuisine_type": details.get("cuisine_type", raw_item["category"]),
            "description": details.get("description", ""),
            
            # Location & Maps - NOW WITH REAL COORDINATES!
            "address": details.get("address", ""),
            "latitude": latitude,
            "longitude": longitude,
            "google_maps_url": google_maps_url,
            
            # Business Info
            "is_filipino_owned": details.get("is_filipino_owned", False),
            "brand_story": details.get("brand_story", ""),
            "owner_info": details.get("owner_info", ""),
            
            # Food & Menu
            "specialty_dish": details.get("specialty_dish", ""),
            "menu_highlights": details.get("menu_highlights", ""),
            "food_topics": details.get("food_topics", ""),
            
            # Pricing & Budget
            "price_range": details.get("price_range", "₱₱"),
            "budget_category": details.get("budget_category", "Mid-Range"),
            "avg_meal_cost": details.get("avg_meal_cost", ""),
            
            # Engagement
            "rating": float(details.get("rating", 4.0)) if details.get("rating") else 4.0,
            "clickbait_hook": details.get("clickbait_hook", ""),
            "why_filipinos_love_it": details.get("why_filipinos_love_it", ""),
            
            # Contact
            "contact_info": details.get("contact_info", ""),
            "website": details.get("website", ""),
            "social_media": details.get("social_media", ""),
            
            # Meta
            "image_url": img_url if img_url and "placehold" not in img_url else "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
            "original_url": raw_item["url"],
            "timestamp": time.time()
        }
        
        return restaurant_data

    def run_restaurant_crawl(self, countries=None, categories=None):
        """Runs the specialized crawl for restaurants."""
        target_countries = countries or list(COUNTRIES.keys())
        target_categories = categories or self.categories
        
        all_results = []
        print(f"\n🍴 Starting Restaurant Scraper: {len(target_countries)} countries")
        print("=" * 60)

        for country in target_countries:
            for category in target_categories:
                with print_lock:
                    print(f"🔍 Searching {category} in {country}...")
                data = self.fetch_restaurant_data(category, country)
                all_results.extend(data)

        print(f"\n✅ Found {len(all_results)} potential restaurant links.")
        return all_results

if __name__ == "__main__":
    scraper = RestaurantScraper()
    # Test with 1 country and 1 category
    results = scraper.run_restaurant_crawl(countries=["Philippines"], categories=["Fine Dining"])
    
    if results:
        print("\n--- Sample Raw Result ---")
        print(json.dumps(results[0], indent=2))
        
        print("\n--- Simulating AI Extraction ---")
        extracted = scraper.process_with_ai(results[0])
        if extracted:
            print(json.dumps(extracted, indent=2))
        else:
            print("No specific restaurant found in this article.")
