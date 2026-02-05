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
        Builds SPECIFIC queries to find LOCAL Filipino restaurants with addresses.
        Focus on queries that return articles with restaurant locations/maps.
        """
        # Different query strategies - focus on NEW openings and SPECIFIC locations
        query_templates = [
            # OPENING/NEW focus (more likely to have addresses in articles)
            f'Filipino restaurant "{country}" opening address location',
            f'new Filipino restaurant opened "{country}" 2025 2026 where',
            f'Filipino restaurant "{country}" opens at address',
            f'Filipino cafe "{country}" grand opening location',
            # REVIEW focus (reviews often include address)
            f'Filipino restaurant "{country}" review address location map',
            f'Filipino food "{country}" restaurant review where find',
            f'best Filipino restaurant "{country}" location address',
            # SPECIFIC location queries
            f'Filipino owned restaurant "{country}" street address',
            f'Filipino dining "{country}" restaurant location map',
            f'where eat Filipino food "{country}" restaurant address',
        ]
        
        # Category-specific queries optimized for finding addresses
        if category == "Chef Interviews":
            return f'Filipino chef opens restaurant "{country}" location address 2025 2026'
        elif category == "Michelin Guide":
            return f'Filipino restaurant "{country}" Michelin guide location where'
        elif category == "Fine Dining":
            return f'Filipino fine dining restaurant "{country}" opening location address'
        elif category == "Casual Dining":
            return f'new Filipino casual restaurant "{country}" grand opening where location'
        elif category == "Fast Food Industry":
            return f'Filipino fast casual restaurant "{country}" opening location NOT Jollibee'
        else:
            # Random variety
            return random.choice(query_templates)

    def fetch_restaurant_data(self, category, country, use_cache=True):
        """
        Fetches potential restaurant data from Google News RSS.
        Uses news articles to find real restaurants with proper addresses.
        """
        query = self.build_restaurant_query(category, country)
        
        # Use Google News RSS - more reliable than Gemini search
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

    def extract_coords_from_maps_url(self, maps_url):
        """
        Extracts latitude and longitude from Google Maps URLs.
        Supports multiple formats:
        - https://www.google.com/maps?q=22.282013,114.152195
        - https://maps.google.com/maps?q=22.282013,114.152195
        - https://goo.gl/maps/... (shortened URLs - will return None, needs geocoding)
        - https://www.google.com/maps/place/Name/@22.282013,114.152195,17z
        """
        if not maps_url:
            return None, None
        
        import re
        
        # Pattern 1: ?q=lat,lng
        match = re.search(r'[?&]q=([-\d.]+),([-\d.]+)', maps_url)
        if match:
            lat = float(match.group(1))
            lng = float(match.group(2))
            print(f"   📍 Extracted from Maps URL: ({lat:.6f}, {lng:.6f})")
            return lat, lng
        
        # Pattern 2: /@lat,lng,zoom
        match = re.search(r'/@([-\d.]+),([-\d.]+),[\d.]+z', maps_url)
        if match:
            lat = float(match.group(1))
            lng = float(match.group(2))
            print(f"   📍 Extracted from Maps URL: ({lat:.6f}, {lng:.6f})")
            return lat, lng
        
        # Pattern 3: /place/Name/@lat,lng
        match = re.search(r'/place/[^/]+/@([-\d.]+),([-\d.]+)', maps_url)
        if match:
            lat = float(match.group(1))
            lng = float(match.group(2))
            print(f"   📍 Extracted from Maps URL: ({lat:.6f}, {lng:.6f})")
            return lat, lng
        
        return None, None
    
    def geocode_address(self, address, restaurant_name="", city="", country=""):
        """
        Uses Google Maps Geocoding API to get lat/long from address.
        Improved to handle more address formats and fallbacks.
        """
        if not self.google_maps_key:
            return None, None, address
        
        # Handle None or empty address
        if not address:
            address = ""
        
        # Clean address - if it contains junk phrases, try to construct from available info
        junk_phrases = ["not provided", "not mentioned", "unknown", "n/a", "specific address", "various", "unnamed"]
        if address and any(phrase in address.lower() for phrase in junk_phrases):
            address = ""  # Clear junk address
        
        # Build search query - prefer full address, fallback to restaurant+city+country
        search_query = address.strip() if address else ""
        
        # If address is too short or empty, try to construct from available info
        if not search_query or len(search_query) < 10:
            if restaurant_name and city:
                search_query = f"{restaurant_name}, {city}, {country}"
            elif restaurant_name:
                search_query = f"{restaurant_name}, {country}"
            elif city:
                search_query = f"{city}, {country}"
            else:
                return None, None, address if address else ""
        
        # Ensure country is in the query
        if country and country.lower() not in search_query.lower():
            search_query = f"{search_query}, {country}"
        
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
        
        # 2. Ask AI to extract REAL restaurant details from article
        details = self.ai.extract_restaurant_details(
            raw_item["raw_title"], 
            content, 
            raw_item["country"], 
            raw_item["category"]
        )
        
        # Skip if no real restaurant found (AI returns None)
        if not details:
            return None
        
        # 3. PRIORITY: Extract coordinates from Google Maps URL in article (most accurate!)
        address = details.get("address", "")
        city = details.get("city", "")
        restaurant_name = details.get("name", "")
        country = raw_item["country"]
        google_maps_url = details.get("google_maps_url", "")
        
        latitude, longitude = None, None
        formatted_address = address
        
        # STEP 1: Try to extract lat/long from Maps URL in article (BEST SOURCE)
        if google_maps_url:
            print(f"   🔗 Found Google Maps URL in article: {google_maps_url[:60]}...")
            latitude, longitude = self.extract_coords_from_maps_url(google_maps_url)
        
        # STEP 2: If no Maps URL or couldn't extract coords, try geocoding
        if not latitude:
            print(f"   🌐 No coords from Maps URL, trying geocoding...")
            # Try geocoding with the address from article
            latitude, longitude, formatted_address = self.geocode_address(
                address, 
                restaurant_name, 
                city, 
                country
            )
            
            # If geocoding failed, try with restaurant name + city + country
            if not latitude and restaurant_name and city:
                print(f"   🔄 Retrying geocoding with restaurant name...")
                latitude, longitude, formatted_address = self.geocode_address(
                    f"{restaurant_name}, {city}, {country}",
                    restaurant_name,
                    city,
                    country
                )
        
        # Update address if we got a better one from geocoding
        if formatted_address and formatted_address != address:
            details["address"] = formatted_address
        
        # 4. Generate/update Google Maps URL
        if latitude and longitude:
            # If we extracted coords from article URL, keep the original URL
            if not google_maps_url:
                google_maps_url = f"https://www.google.com/maps?q={latitude},{longitude}"
        else:
            # Fallback to search URL if we don't have coordinates
            if not google_maps_url:
                search_term = f"{restaurant_name} {city} {country}".replace(" ", "+")
                google_maps_url = f"https://www.google.com/maps/search/{search_term}"
        
        # 5. Build the full Restaurant model data with ALL new fields (no image - restaurants added manually)
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
            
            # Pricing & Budget (NO PESO SIGNS)
            "price_range": self._clean_price_range(details.get("price_range", "2")),
            "budget_category": details.get("budget_category", "Mid-Range"),
            "avg_meal_cost": self._clean_meal_cost(details.get("avg_meal_cost", "")),
            
            # Engagement
            "rating": float(details.get("rating", 4.0)) if details.get("rating") else 4.0,
            "clickbait_hook": details.get("clickbait_hook", ""),
            "why_filipinos_love_it": details.get("why_filipinos_love_it", ""),
            
            # Contact
            "contact_info": details.get("contact_info", ""),
            "website": details.get("website", ""),
            "social_media": details.get("social_media", ""),
            
            # Meta
            "original_url": raw_item["url"],
            "timestamp": time.time()
        }
        
        return restaurant_data

    def _clean_price_range(self, price_range):
        """
        Clean price range - keeps actual price ranges like '15-30 USD' or '50-80 SGD'.
        Removes peso signs and other unwanted characters.
        """
        if not price_range:
            return ""
        # Remove peso signs and clean
        cleaned = str(price_range).replace("₱", "").strip()
        # Return as-is (should be format like "15-30 USD" or "50-80 SGD")
        return cleaned

    def _clean_meal_cost(self, meal_cost):
        """Remove peso signs from meal cost."""
        if not meal_cost:
            return ""
        # Remove peso signs
        cleaned = str(meal_cost).replace("₱", "").strip()
        return cleaned

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
