"""
HomesPh Restaurant Places API Client.
Fetches countries/cities from MySQL (or fallback from config). Uses Geocode → Nearby Search
(type=restaurant) → sort by rating → Place Details for top N. Same API key for Maps + Places.
"""

import os
import time
import uuid
import requests
from typing import List, Dict, Optional, Tuple
from dotenv import load_dotenv

load_dotenv()

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place"
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"
REQUEST_DELAY_SECONDS = 0.15  # Rate limiting
MAX_PLACES_PER_CITY = 10       # Cap Place Details calls per city
NEARBY_RADIUS_M = 5000        # 5km radius for Nearby Search
MIN_RATING = 4.0               # Generic min rating

# Filipino cuisine–only flow (Pinoy na Pinoy): Text Search only, keyword filter, quality bar
FILIPINO_ONLY = os.getenv("FILIPINO_ONLY", "true").lower() in ("1", "true", "yes")
FILIPINO_MIN_RATING = float(os.getenv("FILIPINO_MIN_RATING", "4.2"))
FILIPINO_MIN_USER_RATINGS = int(os.getenv("FILIPINO_MIN_USER_RATINGS", "50"))
MAX_PLACES_FILIPINO = int(os.getenv("MAX_PLACES_FILIPINO", "20"))
FILIPINO_KEYWORDS = [
    "filipino", "pinoy", "pinay", "lutong", "kuya", "kabayan",
    "manila", "cebu", "adobo", "sari", "turo", "nanay", "tatay",
]
# Optional: use Gemini to fill description, specialty_dish, menu_highlights, clickbait_hook, why_filipinos_love_it
RESTAURANT_ENRICH_AI = os.getenv("RESTAURANT_ENRICH_AI", "true").lower() in ("1", "true", "yes")

# When MySQL has no cities, use one default city per country (from config.COUNTRIES)
DEFAULT_CITY_PER_COUNTRY = {
    "Philippines": "Manila",
    "Saudi Arabia": "Riyadh",
    "United Arab Emirates": "Dubai",
    "Singapore": "Singapore",
    "Hong Kong": "Hong Kong",
    "Qatar": "Doha",
    "Kuwait": "Kuwait City",
    "Taiwan": "Taipei",
    "Japan": "Tokyo",
    "Australia": "Sydney",
    "Malaysia": "Kuala Lumpur",
    "Canada": "Toronto",
    "United States": "New York",
    "United Kingdom": "London",
    "Italy": "Rome",
    "South Korea": "Seoul",
}
# Country -> currency for price_range / avg_meal_cost
COUNTRY_CURRENCY = {
    "Philippines": "PHP", "Singapore": "SGD", "Hong Kong": "HKD", "United Arab Emirates": "AED",
    "Saudi Arabia": "SAR", "Qatar": "QAR", "Kuwait": "KWD", "United States": "USD", "Canada": "CAD",
    "United Kingdom": "GBP", "Australia": "AUD", "Japan": "JPY", "South Korea": "KRW",
    "Taiwan": "TWD", "Malaysia": "MYR", "Italy": "EUR",
}

# Country name -> country id (gl style) for region
COUNTRY_NAME_TO_ID = {
    "Philippines": "PH", "Saudi Arabia": "SA", "United Arab Emirates": "AE",
    "Singapore": "SG", "Hong Kong": "HK", "Qatar": "QA", "Kuwait": "KW",
    "Taiwan": "TW", "Japan": "JP", "Australia": "AU", "Malaysia": "MY",
    "Canada": "CA", "United States": "US", "United Kingdom": "GB",
    "Italy": "IT", "South Korea": "KR",
}


def fetch_locations() -> List[Dict]:
    """
    Fetch (country, city) list from MySQL. If MySQL has no cities or is unavailable,
    fall back to config.COUNTRIES + DEFAULT_CITY_PER_COUNTRY so Places still runs.
    Returns list of { country_id, country_name, city_id, city_name }.
    """
    locations = []
    try:
        from database import SessionLocal, check_mysql_connection
        from models import CountryDB, CityDB
        from config import COUNTRIES
    except ImportError as e:
        print(f"⚠️ Places: Cannot import database/config: {e}")
        return _fallback_locations()

    if not check_mysql_connection():
        print("⚠️ Places: MySQL not connected; using default city per country.")
        return _fallback_locations()

    db = SessionLocal()
    try:
        countries = db.query(CountryDB).filter(CountryDB.is_active == True).all()
        cities = db.query(CityDB).filter(CityDB.is_active == True).all()
        country_by_id = {c.id: c for c in countries}
        for city in cities:
            cid = city.country_id
            if not cid or cid not in country_by_id:
                continue
            locations.append({
                "country_id": cid,
                "country_name": country_by_id[cid].name,
                "city_id": city.city_id,
                "city_name": city.name or "",
            })
        if locations:
            print(f"📍 Places: Loaded {len(locations)} locations from MySQL.")
        else:
            print("📍 Places: No cities in DB; using default city per country.")
            locations = _fallback_locations()
        if locations and FILIPINO_ONLY:
            print(f"🍴 Filipino cuisine only: Text Search + keyword filter, rating≥{FILIPINO_MIN_RATING}, reviews≥{FILIPINO_MIN_USER_RATINGS}")
        return locations
    except Exception as e:
        print(f"⚠️ Places: Failed to fetch locations from MySQL: {e}")
        return _fallback_locations()
    finally:
        db.close()


def _fallback_locations() -> List[Dict]:
    """Build locations from config COUNTRIES + default city per country (no MySQL cities)."""
    try:
        from config import COUNTRIES
    except ImportError:
        return []
    locations = []
    for country_name in COUNTRIES.keys():
        city_name = DEFAULT_CITY_PER_COUNTRY.get(country_name)
        if not city_name:
            city_name = country_name  # e.g. Singapore -> Singapore
        cid = COUNTRY_NAME_TO_ID.get(country_name, country_name[:2].upper() if len(country_name) >= 2 else "XX")
        locations.append({
            "country_id": cid,
            "country_name": country_name,
            "city_id": None,
            "city_name": city_name,
        })
    if locations:
        print(f"📍 Places: Using {len(locations)} default locations (1 city per country).")
    if locations and FILIPINO_ONLY:
        print(f"🍴 Filipino cuisine only: Text Search + keyword filter, rating≥{FILIPINO_MIN_RATING}, reviews≥{FILIPINO_MIN_USER_RATINGS}")
    return locations


def geocode_city(city_name: str, country_name: str, api_key: str) -> Optional[Tuple[float, float]]:
    """
    Geocode "City, Country" to (lat, lng). Used for Nearby Search (more deterministic than Text Search).
    """
    if not api_key:
        return None
    address = f"{city_name}, {country_name}"
    try:
        time.sleep(REQUEST_DELAY_SECONDS)
        resp = requests.get(GEOCODE_URL, params={"address": address, "key": api_key}, timeout=15)
        data = resp.json()
        if data.get("status") != "OK" or not data.get("results"):
            return None
        loc = data["results"][0]["geometry"]["location"]
        return (loc["lat"], loc["lng"])
    except Exception as e:
        print(f"   ⚠️ Geocode error: {e}")
        return None


def places_nearby_search(
    lat: float,
    lng: float,
    api_key: str,
    radius_m: int = NEARBY_RADIUS_M,
) -> List[Dict]:
    """
    Nearby Search: type=restaurant, location=lat,lng, radius. More deterministic than Text Search.
    Returns list of place results (place_id, name, rating, types, etc.).
    """
    if not api_key:
        return []
    url = f"{PLACES_BASE_URL}/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": radius_m,
        "type": "restaurant",
        "key": api_key,
    }
    try:
        time.sleep(REQUEST_DELAY_SECONDS)
        resp = requests.get(url, params=params, timeout=15)
        data = resp.json()
        if data.get("status") != "OK":
            if data.get("status") == "ZERO_RESULTS":
                return []
            print(f"   ⚠️ Nearby Search status: {data.get('status')}")
            return []
        return data.get("results", [])
    except Exception as e:
        print(f"   ⚠️ Nearby Search error: {e}")
        return []


def _places_text_search_with_query(
    query: str,
    country_region: str,
    api_key: str,
) -> List[Dict]:
    """Shared Text Search by query string."""
    if not api_key:
        return []
    url = f"{PLACES_BASE_URL}/textsearch/json"
    params = {
        "query": query,
        "key": api_key,
        "region": country_region.lower(),
    }
    try:
        time.sleep(REQUEST_DELAY_SECONDS)
        # Timeout 25s to reduce DEADLINE_EXCEEDED (Google Places can be slow for some regions e.g. Japan)
        resp = requests.get(url, params=params, timeout=25)
        data = resp.json()
        if data.get("status") != "OK":
            if data.get("status") == "ZERO_RESULTS":
                return []
            print(f"   ⚠️ Text Search status: {data.get('status')}")
            return []
        return data.get("results", [])
    except Exception as e:
        print(f"   ⚠️ Text Search error: {e}")
        return []


def places_text_search_filipino(
    city_name: str,
    country_name: str,
    country_region: str,
    api_key: str,
) -> List[Dict]:
    """
    Text Search for Filipino cuisine: 'Filipino restaurant in {city}, {country}'.
    Used when FILIPINO_ONLY=True (skip Nearby, bias results to Pinoy places).
    """
    query = f"Filipino restaurant in {city_name}, {country_name}"
    return _places_text_search_with_query(query, country_region, api_key)


def looks_filipino_cuisine(place: Dict) -> bool:
    """
    Hard filter: keep only if name suggests Filipino cuisine, or types include filipino_restaurant.
    """
    types = place.get("types") or []
    if "filipino_restaurant" in types:
        return True
    name = (place.get("name") or "").lower()
    return any(kw in name for kw in FILIPINO_KEYWORDS)


def places_text_search(
    city_name: str,
    country_name: str,
    country_region: str,
    api_key: str,
) -> List[Dict]:
    """
    Generic Text Search: 'restaurants in {city}, {country}' (fallback when not FILIPINO_ONLY).
    """
    query = f"restaurants in {city_name}, {country_name}"
    return _places_text_search_with_query(query, country_region, api_key)


def place_details(place_id: str, api_key: str) -> Optional[Dict]:
    """
    Google Place Details for one place_id.
    Returns result dict with formatted_address, formatted_phone_number, website, url, opening_hours, etc.
    """
    if not api_key or not place_id:
        return None
    url = f"{PLACES_BASE_URL}/details/json"
    fields = (
        "name,rating,formatted_address,formatted_phone_number,"
        "website,opening_hours,url,types,price_level,geometry,reviews"
    )
    params = {"place_id": place_id, "key": api_key, "fields": fields}
    try:
        time.sleep(REQUEST_DELAY_SECONDS)
        resp = requests.get(url, params=params, timeout=15)
        data = resp.json()
        if data.get("status") != "OK":
            return None
        return data.get("result")
    except Exception as e:
        print(f"   ⚠️ Place Details error for {place_id[:20]}...: {e}")
        return None


def _types_to_cuisine(types: List[str]) -> str:
    """Map Places types to a single cuisine_type string."""
    if not types:
        return "Restaurant"
    # Prefer more specific types
    for t in types:
        if t in ("restaurant", "food", "cafe", "meal_delivery", "meal_takeaway"):
            return t.replace("_", " ").title()
    return types[0].replace("_", " ").title() if types else "Restaurant"


def _price_level_to_budget(level: Optional[int]) -> str:
    """Map Places price_level (1-4) to budget_category."""
    if level is None:
        return "Mid-Range"
    return {1: "Budget", 2: "Mid-Range", 3: "Expensive", 4: "Luxury"}.get(level, "Mid-Range")


def _format_price_range(price_level: Optional[int], country_name: str) -> str:
    """Human-readable price range from price_level and country currency."""
    if price_level is None:
        return ""
    cur = COUNTRY_CURRENCY.get(country_name, "USD")
    # Approximate ranges per level (no symbol for PHP to avoid peso sign issues in some contexts)
    if cur == "PHP":
        ranges = {1: "₱100-300", 2: "₱300-800", 3: "₱800-1500", 4: "₱1500+"}
    elif cur == "GBP":
        ranges = {1: "Under £10", 2: "£10-25", 3: "£25-50", 4: "£50+"}
    else:
        ranges = {1: "Budget", 2: "Mid-Range", 3: "Expensive", 4: "Luxury"}
    return ranges.get(price_level, "")


def _format_avg_meal_cost(price_level: Optional[int], country_name: str) -> str:
    """Short avg meal cost line for display."""
    if price_level is None:
        return ""
    cur = COUNTRY_CURRENCY.get(country_name, "USD")
    if cur == "PHP":
        costs = {1: "Around ₱150 per person", 2: "Around ₱400 per person", 3: "Around ₱1000 per person", 4: "₱1500+ per person"}
    elif cur == "GBP":
        costs = {1: "Around £8 per person", 2: "Around £15 per person", 3: "Around £35 per person", 4: "£50+ per person"}
    else:
        costs = {1: "Budget-friendly", 2: "Moderate prices", 3: "Higher end", 4: "Premium"}
    return costs.get(price_level, "")


def map_place_to_restaurant(
    place_search: Dict,
    place_details_result: Optional[Dict],
    loc: Dict,
    is_filipino_cuisine: bool = False,
) -> Dict:
    """
    Build Restaurant model dict from Places result + optional Place Details.
    loc = { country_id, country_name, city_id, city_name }.
    is_filipino_cuisine: set when pipeline is Filipino-only (query + filter).
    """
    name = place_search.get("name", "Unknown")
    place_id = place_search.get("place_id", "")
    rating = place_search.get("rating")
    types = place_search.get("types") or []
    price_level = place_search.get("price_level")
    description = ""
    why_filipinos_love_it = ""
    if place_details_result:
        address = place_details_result.get("formatted_address", "")
        phone = place_details_result.get("formatted_phone_number", "")
        website = place_details_result.get("website", "")
        google_maps_url = place_details_result.get("url", "")
        if place_details_result.get("rating") is not None:
            rating = place_details_result.get("rating")
        if place_details_result.get("types"):
            types = place_details_result.get("types")
        if place_details_result.get("price_level") is not None:
            price_level = place_details_result.get("price_level")
        reviews = place_details_result.get("reviews") or []
        if reviews and isinstance(reviews[0], dict) and reviews[0].get("text"):
            first_review = (reviews[0].get("text") or "").strip()
            if first_review:
                description = first_review[:400].rstrip()
                if len(first_review) > 400:
                    description += "…"
                why_filipinos_love_it = first_review[:220].rstrip() + ("…" if len(first_review) > 220 else "")
    else:
        address = place_search.get("formatted_address", "")
        phone = ""
        website = ""
        google_maps_url = f"https://www.google.com/maps/place/?q=place_id:{place_id}" if place_id else ""

    lat, lng = None, None
    if place_details_result and place_details_result.get("geometry", {}).get("location"):
        loc_ = place_details_result["geometry"]["location"]
        lat = loc_.get("lat")
        lng = loc_.get("lng")

    country_name = loc.get("country_name", "")
    budget_cat = _price_level_to_budget(price_level)
    price_range_str = _format_price_range(price_level, country_name)
    avg_meal_str = _format_avg_meal_cost(price_level, country_name)

    return {
        "id": str(uuid.uuid4()),
        "name": name,
        "country": country_name,
        "city": loc.get("city_name", ""),
        "country_id": loc.get("country_id", ""),
        "city_id": loc.get("city_id"),
        "place_id": place_id,
        "cuisine_type": _types_to_cuisine(types),
        "description": description,
        "address": address,
        "latitude": lat,
        "longitude": lng,
        "google_maps_url": google_maps_url,
        "is_filipino_owned": is_filipino_cuisine,
        "brand_story": "",
        "owner_info": "",
        "specialty_dish": "",
        "menu_highlights": "",
        "food_topics": "",
        "price_range": price_range_str,
        "budget_category": budget_cat,
        "avg_meal_cost": avg_meal_str,
        "rating": float(rating) if rating is not None else 0.0,
        "clickbait_hook": "",
        "why_filipinos_love_it": why_filipinos_love_it,
        "contact_info": phone,
        "website": website,
        "social_media": "",
        "original_url": google_maps_url,
        "timestamp": time.time(),
    }


def fetch_restaurants_for_location(
    loc: Dict,
    api_key: str,
    max_per_city: int = MAX_PLACES_PER_CITY,
    use_nearby_first: bool = True,
) -> List[Dict]:
    """
    For one (country, city): when FILIPINO_ONLY use Text Search only with Filipino query,
    name/type filter, and quality bar. Otherwise: Geocode → Nearby → fallback Text Search.
    """
    city_name = loc.get("city_name", "")
    country_name = loc.get("country_name", "")
    country_region = loc.get("country_id", "")
    if not city_name or not country_name:
        return []

    is_filipino_flow = FILIPINO_ONLY
    if is_filipino_flow:
        # Filipino cuisine only: Text Search "Filipino restaurant in {city}, {country}", no Nearby
        results = places_text_search_filipino(city_name, country_name, country_region, api_key)
        results = [p for p in results if looks_filipino_cuisine(p)]
        # Quality bar: rating and min reviews; if none pass, relax to rating only
        qualified = [
            p for p in results
            if (p.get("rating") or 0) >= FILIPINO_MIN_RATING
            and (p.get("user_ratings_total") or 0) >= FILIPINO_MIN_USER_RATINGS
        ]
        if not qualified:
            qualified = [p for p in results if (p.get("rating") or 0) >= 4.0]
        results = sorted(qualified, key=lambda x: x.get("rating") or 0, reverse=True)[:MAX_PLACES_FILIPINO]
    else:
        results = []
        if use_nearby_first and api_key:
            coords = geocode_city(city_name, country_name, api_key)
            if coords:
                lat, lng = coords
                raw = places_nearby_search(lat, lng, api_key)
                results = sorted(raw, key=lambda x: x.get("rating") or 0, reverse=True)[:max_per_city]
        if not results:
            results = places_text_search(city_name, country_name, country_region, api_key)
            results = sorted(results, key=lambda x: x.get("rating") or 0, reverse=True)[:max_per_city]

    if not results:
        return []

    restaurants = []
    ai_processor = None
    if RESTAURANT_ENRICH_AI:
        try:
            from ai_service import AIProcessor
            ai_processor = AIProcessor()
            if not ai_processor.text_model:
                ai_processor = None
        except Exception:
            ai_processor = None

    for place in results:
        place_id = place.get("place_id")
        if not place_id:
            continue
        details = place_details(place_id, api_key)
        rest = map_place_to_restaurant(place, details, loc, is_filipino_cuisine=is_filipino_flow)
        if ai_processor:
            enriched = ai_processor.enrich_restaurant_metadata(
                name=rest.get("name", ""),
                cuisine_type=rest.get("cuisine_type", "Restaurant"),
                city=rest.get("city", ""),
                country=rest.get("country", ""),
                rating=rest.get("rating") or 0,
                address=rest.get("address", ""),
                existing_description=rest.get("description", ""),
            )
            if enriched:
                if not rest.get("description") and enriched.get("description"):
                    rest["description"] = enriched["description"]
                if enriched.get("specialty_dish"):
                    rest["specialty_dish"] = enriched["specialty_dish"]
                if enriched.get("menu_highlights"):
                    rest["menu_highlights"] = enriched["menu_highlights"]
                if enriched.get("clickbait_hook"):
                    rest["clickbait_hook"] = enriched["clickbait_hook"]
                if not rest.get("why_filipinos_love_it") and enriched.get("why_filipinos_love_it"):
                    rest["why_filipinos_love_it"] = enriched["why_filipinos_love_it"]
        restaurants.append(rest)
    return restaurants
