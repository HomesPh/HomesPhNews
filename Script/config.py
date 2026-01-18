"""
HomesPh Global News Engine - Configuration
Best Practice: Centralized settings for easy scaling.
"""

# Supported Countries with Google News region codes
COUNTRIES = {
    "Philippines": {"gl": "PH", "hl": "en-PH", "ceid": "PH:en"},
    "Singapore": {"gl": "SG", "hl": "en-SG", "ceid": "SG:en"},
    "Canada": {"gl": "CA", "hl": "en-CA", "ceid": "CA:en"},
    "United States": {"gl": "US", "hl": "en-US", "ceid": "US:en"},
    "United Arab Emirates": {"gl": "AE", "hl": "en-AE", "ceid": "AE:en"},
    "United Kingdom": {"gl": "GB", "hl": "en-GB", "ceid": "GB:en"},
    "Australia": {"gl": "AU", "hl": "en-AU", "ceid": "AU:en"},
    "India": {"gl": "IN", "hl": "en-IN", "ceid": "IN:en"},
}

# News Categories/Keywords
CATEGORIES = [
    "Real Estate",
    "Business",
    "Politics",
    "Technology",
    "Economy",
    "Tourism",
]

# Trusted domains (optional filter for quality control)
TRUSTED_DOMAINS = [
    "cnn.com", "bbc.co.uk", "reuters.com", "bloomberg.com",
    "nytimes.com", "theguardian.com", "wsj.com", "forbes.com",
    "inquirer.net", "philstar.com", "manilatimes.net",
    "straitstimes.com", "channelnewsasia.com",
    "gulfnews.com", "khaleejtimes.com",
    "globalnews.ca", "cbc.ca",
]

# AI Settings
AI_WRITING_STYLE = """
You are a senior CNN news editor. Rewrite the following article:
1. Use professional, neutral journalism tone
2. Keep facts accurate but rephrase completely
3. Create an engaging headline
4. Structure: Lead paragraph → Body → Conclusion
5. Remove any promotional language
6. Optimize for SEO (include relevant keywords naturally)
7. Keep it between 200-400 words
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
