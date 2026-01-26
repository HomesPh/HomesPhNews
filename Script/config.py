"""
HomesPh Global News Engine - Configuration
Best Practice: Centralized settings for easy scaling.
"""

# Supported Countries with Google News region codes (Top OFW Destinations)
COUNTRIES = {
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
}

# News Categories relevant to OFWs
CATEGORIES = [
    "Community",
    "Labor & Employment",
    "Healthcare",
    "Business & Economy",
    "Real Estate",
    "Success Stories",
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
