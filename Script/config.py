"""
HomesPh Global News Engine - Configuration
Best Practice: Centralized settings for easy scaling.
"""

# Supported Countries with Google News region codes (Top OFW Destinations)
COUNTRIES = {
    "Philippines": {"gl": "PH", "hl": "en-PH", "ceid": "PH:en"},
    "Saudi Arabia": {"gl": "SA", "hl": "en", "ceid": "SA:en"},
    "United Arab Emirates": {"gl": "AE", "hl": "en-AE", "ceid": "AE:en"},
    "Singapore": {"gl": "SG", "hl": "en-SG", "ceid": "SG:en"},
    "Hong Kong": {"gl": "HK", "hl": "en-HK", "ceid": "HK:en"},
    "Qatar": {"gl": "QA", "hl": "en", "ceid": "QA:en"},
    "Kuwait": {"gl": "KW", "hl": "en", "ceid": "KW:en"},
    "Taiwan": {"gl": "TW", "hl": "en", "ceid": "TW:en"},
    "Japan": {"gl": "JP", "hl": "en", "ceid": "JP:en"},
    "Australia": {"gl": "AU", "hl": "en-AU", "ceid": "AU:en"},
    "Malaysia": {"gl": "MY", "hl": "en-MY", "ceid": "MY:en"},
    "Canada": {"gl": "CA", "hl": "en-CA", "ceid": "CA:en"},
    "United States": {"gl": "US", "hl": "en-US", "ceid": "US:en"},
    "United Kingdom": {"gl": "GB", "hl": "en-GB", "ceid": "GB:en"},
    "Italy": {"gl": "IT", "hl": "en", "ceid": "IT:en"},
    "South Korea": {"gl": "KR", "hl": "en", "ceid": "KR:en"},
}

# News Categories relevant to OFWs
CATEGORIES = [
    "Community",
    "Labor & Employment",
    "Healthcare",
    "Business & Economy",
    "Real Estate",
    "Success Stories",
    "Sports",
]

CITIES = {} # country_id -> list of city names

# Restaurant Categories
RESTAURANT_CATEGORIES = [
    "Fine Dining",
    "Casual Dining",
    "Fast Food Industry",
    "Chef Interviews",
    "Michelin Guide",
]

# Trusted domains (optional filter for quality control)
TRUSTED_DOMAINS = [
    "cnn.com", "bbc.co.uk", "reuters.com", "bloomberg.com",
    "inquirer.net", "philstar.com", "manilatimes.net", "rappler.com",
    "straitstimes.com", "channelnewsasia.com", "scmp.com",
    "gulfnews.com", "khaleejtimes.com", "arabnews.com",
    "japantimes.co.jp", "brisbanetimes.com.au",
]

# AI Settings
AI_WRITING_STYLE = """
You are a senior editor for a Global, English-language Filipino News portal. 
Rewrite the following article with a focus on its relevance to the Filipino community or OFWs:

STRICT RULES:
1. LANGUAGE: WRITE 100% IN ENGLISH. DO NOT USE TAGALOG WORDS (e.g., avoid "Kabayan", "Pinay", "Nasunog", etc.).
2. HEADLINE: Create a highly engaging, English CLICKBAIT-style headline (Global appeal).
3. CONTENT: Focus on how this news affects Filipinos in the region or their families, but explained in clear, professional English.
4. STRUCTURE: Lead paragraph (the "Hook") → Body → Conclusion.
5. STYLE: Professional yet conversational journalism.
6. SEO: Naturally include keywords like 'Filipino', 'OFW', 'Philippines'.
7. LENGTH: 200-400 words.
"""

# Scraper Settings
SCRAPER_SETTINGS = {
    "articles_per_search": 10,
    "request_delay_seconds": 2,
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
}

# Redis Key Patterns
REDIS_KEYS = {
    "article": "news:{country}:{category}:{article_id}",
    "country_list": "news:{country}:articles",
    "category_list": "news:category:{category}:articles",
    "all_articles": "news:all:articles",
}

# ═══════════════════════════════════════════════════════════════
# DYNAMIC CONFIGURATION (MYSQL)
# ═══════════════════════════════════════════════════════════════

def load_dynamic_config():
    """Fetch countries and categories from MySQL if available."""
    global COUNTRIES, CATEGORIES
    
    try:
        from database import SessionLocal, check_mysql_connection
        from models import CategoryDB, CountryDB, CityDB
        
        if not check_mysql_connection():
            print("ℹ️ MySQL not connected, using hardcoded config fallbacks.")
            return

        db = SessionLocal()
        try:
            # 1. Fetch Categories
            db_categories = db.query(CategoryDB).filter(CategoryDB.is_active == True).all()
            if db_categories:
                CATEGORIES.clear()
                CATEGORIES.extend([c.name for c in db_categories])
                print(f"✅ Loaded {len(CATEGORIES)} categories from database: {CATEGORIES}")
            
            # 2. Fetch Countries
            db_countries = db.query(CountryDB).filter(CountryDB.is_active == True).all()
            if db_countries:
                new_countries = {}
                for c in db_countries:
                    new_countries[c.name] = {
                        "gl": c.gl,
                        "hl": c.h1, # Mapping DB 'h1' to Config 'hl'
                        "ceid": c.ceid
                    }
                COUNTRIES.clear()
                COUNTRIES.update(new_countries)
                print(f"✅ Loaded {len(COUNTRIES)} countries from database.")

            # 3. Fetch Cities
            db_cities = db.query(CityDB).filter(CityDB.is_active == True).all()
            if db_cities:
                from collections import defaultdict
                city_map = defaultdict(list)
                for city in db_cities:
                    city_map[city.country_id].append(city.name)
                
                # We can store this in a global variable
                global CITIES
                CITIES = dict(city_map)
                print(f"✅ Loaded {len(db_cities)} cities across {len(CITIES)} countries.")
                
        except Exception as e:
            print(f"⚠️ Error querying dynamic config: {e}")
        finally:
            db.close()
            
    except ImportError:
        # Fallback if database/models aren't fully initialized yet during early imports
        pass
    except Exception as e:
        print(f"⚠️ Failed to load dynamic config: {e}")

# Initial load
load_dynamic_config()
