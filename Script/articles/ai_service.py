"""
HomesPh Global News Engine - AI Service
Handles: CNN-style rewriting, SEO optimization, country detection, image generation.
"""

import os
import re
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
import json
import google.generativeai as genai
from PIL import Image, ImageDraw, ImageFont
from dotenv import load_dotenv
from config import AI_WRITING_STYLE, COUNTRIES

load_dotenv()

# Currency mapping for each country
COUNTRY_CURRENCIES = {
    "Philippines": "PHP",
    "Singapore": "SGD",
    "Hong Kong": "HKD",
    "United Arab Emirates": "AED",
    "Saudi Arabia": "SAR",
    "Qatar": "QAR",
    "Kuwait": "KWD",
    "United States": "USD",
    "Canada": "CAD",
    "United Kingdom": "GBP",
    "Australia": "AUD",
    "Japan": "JPY",
    "South Korea": "KRW",
    "Taiwan": "TWD",
    "Malaysia": "MYR",
    "Italy": "EUR",
}

def get_currency_for_country(country):
    """Get the currency code for a specific country."""
    return COUNTRY_CURRENCIES.get(country, "USD")  # Default to USD if country not found

def clean_markdown(text):
    """Remove markdown formatting characters and all asterisks from text."""
    if not text:
        return ""
    # Remove headers (###, ##, #)
    text = re.sub(r'^#{1,6}\s*', '', text, flags=re.MULTILINE)
    # Remove bold/italic markers (**, *, __, _)
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    text = re.sub(r'__([^_]+)__', r'\1', text)
    text = re.sub(r'_([^_]+)_', r'\1', text)
    # Remove any remaining asterisks at the start of lines
    text = re.sub(r'^\*+\s*', '', text, flags=re.MULTILINE)
    # Remove all standalone asterisks (bullet points, separators, etc.)
    text = re.sub(r'\*+', '', text)
    # Clean extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

class AIProcessor:
    def __init__(self):
        api_key = os.getenv("GOOGLE_AI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.text_model = self._init_text_model()
        else:
            print("⚠️ GOOGLE_AI_API_KEY not found.")
            print("   💡 Please set GOOGLE_AI_API_KEY in your .env file.")
            self.text_model = None
        
        # Initialize OpenAI GPT for text generation fallback
        self.openai_client = None
        openai_key = os.getenv("OPENAI_API_KEY")
        if openai_key:
            try:
                from openai import OpenAI
                self.openai_client = OpenAI(api_key=openai_key)
                print("✅ OpenAI GPT initialized for text generation fallback")
            except ImportError:
                print("⚠️ OpenAI library not installed. Install with: pip install openai")
            except Exception as e:
                print(f"⚠️ OpenAI initialization failed: {str(e)[:100]}")

    def _init_text_model(self):
        """Initialize the best available text model (prefer Gemini 2.5 Flash)."""
        models_to_try = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro']
        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
                model.generate_content("test", generation_config={"max_output_tokens": 1})
                print(f"✅ AI Service: Using model {model_name}")
                return model
            except Exception as e:
                continue
        print("⚠️ Could not initialize any text model.")
        print("   ❌ Possible causes:")
        print("      • API key invalid, no billing linked, or quota exhausted")
        print("      • Model failed to initialize, so it's None")
        print("   💡 Fix: Link a billing account at https://console.cloud.google.com/billing")
        print("   💡 Check quota at: https://aistudio.google.com/app/apikey")
        return None

    def _try_openai_gpt(self, prompt, system_instruction=None, max_tokens=2000):
        """
        Try OpenAI GPT models as fallback for text generation.
        Returns generated text if successful, None otherwise.
        """
        if not self.openai_client:
            return None
        
        # Check if OpenAI fallback is enabled (default: true if API key exists)
        fallback_enabled = os.getenv("OPENAI_FALLBACK_ENABLED", "true").lower() == "true"
        if not fallback_enabled:
            return None
        
        # Try GPT-4o first, then GPT-4, then GPT-3.5-turbo
        models = ["gpt-4o", "gpt-4", "gpt-3.5-turbo"]
        
        for model in models:
            try:
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})
                
                response = self.openai_client.chat.completions.create(
                    model=model,
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=0.7
                )
                
                generated_text = response.choices[0].message.content.strip()
                print(f"✅ Text generated using OpenAI {model}")
                return generated_text
                
            except Exception as e:
                print(f"   ⚠️ OpenAI {model} failed: {str(e)[:100]}")
                continue
        
        return None

    def detect_country(self, title, content):
        """Uses AI to detect the primary country mentioned in the article."""
        country_list = ", ".join(COUNTRIES.keys())
        prompt = f"""
        Analyze this news and identify the SINGLE primary country it focuses on.
        Choose from: {country_list}
        Return ONLY the country name. If unclear, return 'Global'.

        Title: {title}
        Content: {content[:600]}
        """
        
        text = None
        
        # Try Gemini first
        try:
            if self.text_model:
                response = self.text_model.generate_content(prompt)
                text = response.text
        except:
            pass
        
        # Fallback to OpenAI
        if not text:
            text = self._try_openai_gpt(prompt, max_tokens=50)
        
        if text:
            country = text.strip().split('\n')[0].replace(".", "").strip()
            # Validate against known countries
            if country in COUNTRIES:
                return country
        
        return "Global"

    def detect_category(self, title, content, fallback_category=None):
        """
        Uses AI to detect the correct category for an article.
        Validates against the official CATEGORIES list.
        Returns the best-matching category, or fallback_category if uncertain.
        """
        from config import CATEGORIES
        category_list = ", ".join(CATEGORIES)
        prompt = f"""
        Analyze this news article and classify it into ONE of these categories:
        {category_list}

        Rules:
        - Return ONLY the exact category name from the list above
        - Choose the category that best matches the article's MAIN topic
        - If unclear, pick the closest match

        Title: {title}
        Content: {content[:600]}
        """
        
        text = None
        
        # Try Gemini first
        try:
            if self.text_model:
                response = self.text_model.generate_content(prompt)
                text = response.text
        except:
            pass
        
        # Fallback to OpenAI
        if not text:
            text = self._try_openai_gpt(prompt, max_tokens=50)
        
        if text:
            detected = text.strip().split('\n')[0].replace(".", "").strip()
            if detected in CATEGORIES:
                return detected
            for cat in CATEGORIES:
                if cat.lower() == detected.lower():
                    return cat
        
        return fallback_category or CATEGORIES[0]

    def detect_topics(self, title, content, category):
        """
        Uses AI to detect specific sub-topics/tags from article content.
        Returns a list of 2-4 relevant topics based on the article's actual content.
        """
        prompt = f"""
        Analyze this {category} news article and identify 2-4 specific sub-topics or tags.
        
        Guidelines:
        - Be specific (e.g., "AI & PropTech" not just "Technology")
        - Focus on the main themes discussed in the article
        - Return topics that would help readers find similar articles
        - Keep each topic short (1-3 words)
        
        Example topics for Real Estate: AI & PropTech, Luxury Properties, Commercial, Residential, 
        Finance & Mortgages, Healthcare Real Estate, Sustainability, Smart Homes, Market Trends, 
        Investment, Rental Market, Construction, Architecture, Legal & Regulations
        
        Example topics for Business: Startups, Corporate, M&A, Stock Market, Leadership, 
        Banking, Insurance, Retail, E-commerce, Supply Chain
        
        Example topics for Technology: AI & ML, Fintech, Blockchain, Cybersecurity, 
        Cloud Computing, IoT, Robotics, 5G, Software, Hardware
        
        Example topics for Sports: Basketball, Football, PBA, NBA, Olympics, 
        Boxing, Esports, Sports Development, Athletes, Training
        
        Title: {title}
        Content: {content[:800]}
        Category: {category}
        
        Return ONLY the topics as a comma-separated list. No explanation.
        Example output: AI & PropTech, Smart Homes, Investment
        """
        text = None
        
        # Try Gemini first
        try:
            if self.text_model:
                response = self.text_model.generate_content(prompt)
                text = response.text
        except Exception as e:
            print(f"⚠️ Gemini topic detection failed: {e}")
        
        # Fallback to OpenAI
        if not text:
            text = self._try_openai_gpt(prompt, max_tokens=100)
        
        if text:
            topics_text = text.strip()
            # Parse comma-separated topics
            topics = [t.strip() for t in topics_text.split(',') if t.strip()]
            if topics:
                return topics
        
        return [category]  # Fallback to main category

    def extract_restaurant_details(self, title, content, country, category):
        """
        Extracts REAL LOCAL restaurant data from food articles.
        PRIORITY: Local/indie Filipino restaurants, NOT big chains like Jollibee.
        """
        currency = get_currency_for_country(country)
        prompt = f"""
        ACT AS: A Filipino food blogger hunting for HIDDEN GEM restaurants for OFWs and Filipinos abroad.
        Your mission: Extract a SPECIFIC LOCAL RESTAURANT from this article. 
        
        SOURCE Article Title: {title}
        SOURCE Article Content: {content[:3000]}
        Country: {country}
        Category: {category}
        
        ═══════════════════════════════════════════════════════════════
        🚫 BLACKLIST - DO NOT EXTRACT THESE (too common):
        ═══════════════════════════════════════════════════════════════
        - Jollibee (unless it's a NEW branch with a SPECIFIC address)
        - Max's Restaurant
        - Goldilocks
        - Chowking
        - Greenwich
        - Red Ribbon
        - Mang Inasal
        - Any generic chain without specific location
        
        ✅ PRIORITIZE THESE INSTEAD:
        - Local Filipino-owned restaurants (indie/small business)
        - New restaurant openings
        - Chef-owned establishments
        - Pop-up restaurants
        - Food trucks
        - Hidden gems
        - Any restaurant with a SPECIFIC STREET ADDRESS mentioned
        
        ═══════════════════════════════════════════════════════════════
        CRITICAL RULES:
        ═══════════════════════════════════════════════════════════════
        1. COUNTRY MATCHING: The restaurant MUST be located in {country}. If the article is about a restaurant in a DIFFERENT country, return {{"name": null}}. 
        2. ONLY extract if there's a SPECIFIC LOCAL RESTAURANT NAME mentioned (avoid big chains like Jollibee/Max's unless it's a very specific new local branch).
        3. ADDRESS EXTRACTION: You MUST extract the FULL STREET ADDRESS. Look for:
           - Street names, building names, floor numbers
           - Neighborhood/district names (e.g., "BGC", "Makati", "Quezon City")
           - City and country
           - If only partial info (e.g., just "BGC"), try to construct: "BGC, Taguig City, Metro Manila, Philippines"
           - If NO address found, try searching the web or use restaurant name + city + country as fallback
        4. GOOGLE MAPS LINK: Look for Google Maps links in the article (https://maps.google.com, https://goo.gl/maps, https://www.google.com/maps). Extract the EXACT URL if found.
        5. NO JUNK DATA: Do not return "Address not mentioned", "Various", "N/A", or "Unknown" in the address field. If truly not found, construct from available info (restaurant name + city + country).
        6. The address MUST be detailed enough for Google Maps geocoding in {country}.
        7. CURRENCY CODES - Use the CORRECT currency for {country}:
           - Philippines: PHP
           - Singapore: SGD
           - Hong Kong: HKD
           - United Arab Emirates: AED
           - Saudi Arabia: SAR
           - Qatar: QAR
           - Kuwait: KWD
           - United States: USD
           - Canada: CAD
           - United Kingdom: GBP
           - Australia: AUD
           - Japan: JPY
           - South Korea: KRW
           - Taiwan: TWD
           - Malaysia: MYR
           - Italy: EUR
        8. PRICE EXTRACTION: Look for ACTUAL PRICES mentioned in the article. Examples:
           - "appetizers start at $15" → price_range: "15-25 {currency}"
           - "tasting menu for $85" → avg_meal_cost: "85 {currency}"
           - "mains range from 500-800 pesos" → price_range: "500-800 {currency}"
           - "dishes around £20-30" → price_range: "20-30 {currency}"
           - "affordable at under 1000 yen" → price_range: "500-1000 {currency}"
           If no prices in article, estimate realistically:
           - Budget/Casual: 10-30 {currency} for most countries
           - Mid-Range: 30-70 {currency}
           - Fine Dining: 80-200+ {currency}
        
        ═══════════════════════════════════════════════════════════════
        RETURN VALID JSON ONLY (no markdown, no explanation):
        ═══════════════════════════════════════════════════════════════
        {{
            "name": "SPECIFIC restaurant name. If only big chain mentioned or no real restaurant, return null",
            "city": "City name where restaurant is located",
            "cuisine_type": "{category}",
            "description": "Write a 2-3 sentence CLICKBAIT-STYLE description. Make it emotional - mention OFW homesickness, comfort food, hidden gems!",
            
            "address": "MANDATORY: Full street address (e.g., '4/F Uptown Parade, 38th Street corner 9th Avenue, BGC, Taguig City, Metro Manila'). If no specific address, return null for name.",
            "google_maps_url": "EXTRACT the exact Google Maps URL from article if found. Examples: https://maps.google.com/..., https://goo.gl/maps/..., https://www.google.com/maps/... Leave empty if not found.",
            
            "is_filipino_owned": true/false,
            "brand_story": "Story about the restaurant - when opened, founder story, mission. If it's a small business, mention that!",
            "owner_info": "Owner/Chef name if mentioned",
            
            "specialty_dish": "Their signature dish",
            "menu_highlights": "Top 3-5 dishes, comma-separated",
            "food_topics": "Tags: pork-based, kare-kare, sinigang, lechon, seafood, vegetarian, halal, budget-friendly, boodle-fight, kamayan, etc.",
            
            "price_range": "EXTRACT ACTUAL PRICES from article/reviews. Format: 'min-max {currency}' (e.g., '15-30 {currency}', '50-80 {currency}'). Look for: 'appetizers start at...', 'mains cost...', 'dishes range from...'. If no prices in article, estimate realistically for {category} in {country}.",
            "budget_category": "Budget Friendly / Mid-Range / Expensive / Luxury (based on the price_range)",
            "avg_meal_cost": "Average cost per person including 1-2 dishes. Format: 'number {currency}' (e.g., '25 {currency}', '65 {currency}'). EXTRACT from article if prices mentioned. If not, estimate based on restaurant type.",
            
            "rating": 4.5,
            "clickbait_hook": "ONE viral-worthy sentence. Example: 'This hole-in-the-wall in Dubai makes BETTER sinigang than your lola! 🍲😭🇵🇭'",
            "why_filipinos_love_it": "Why OFWs should visit - be emotional!",
            
            "contact_info": "Phone if available",
            "website": "Website URL",
            "social_media": "Instagram/Facebook"
        }}
        
        ═══════════════════════════════════════════════════════════════
        FINAL CHECK:
        ═══════════════════════════════════════════════════════════════
        - If restaurant is a major chain like Jollibee/Max's/Goldilocks → return {{"name": null}}
        - If no SPECIFIC STREET ADDRESS found → return {{"name": null}}
        - If article is a general food guide with no specific restaurant → return {{"name": null}}
        - We want LOCAL GEMS, not corporate fast food!
        """
        try:
            response = self.text_model.generate_content(prompt)
            # Find JSON in response (handle nested braces)
            text = response.text
            # Find the first { and last }
            start_idx = text.find('{')
            end_idx = text.rfind('}')
            if start_idx != -1 and end_idx != -1:
                json_str = text[start_idx:end_idx + 1]
                # Clean potential markdown
                json_str = json_str.replace('```json', '').replace('```', '').strip()
                data = json.loads(json_str)
                
                # Skip if no real restaurant found
                if not data.get("name") or data.get("name") == "null" or data.get("name") is None:
                    print(f"   ⏭️ Skipping: No specific local restaurant found")
                    return None
                
                # Skip if it's a blacklisted chain
                blacklist = ["jollibee", "max's", "goldilocks", "chowking", "greenwich", "red ribbon", "mang inasal"]
                name_lower = data.get("name", "").lower()
                if any(chain in name_lower for chain in blacklist):
                    # Only skip if no specific new address
                    address = data.get("address", "")
                    if not address or "various" in address.lower() or address == "N/A":
                        print(f"   ⏭️ Skipping: Chain restaurant without specific address")
                        return None
                
                # Ensure required fields
                data["country"] = country
                
                # Clean peso signs from price fields
                if data.get("price_range"):
                    data["price_range"] = str(data["price_range"]).replace("₱", "").strip()
                if data.get("avg_meal_cost"):
                    data["avg_meal_cost"] = str(data["avg_meal_cost"]).replace("₱", "").strip()
                
                # Improve address if missing or incomplete
                # NOTE: We only use addresses from article content (Google News RSS).
                # Do NOT ask Gemini to "search" for addresses - it will hallucinate wrong data.
                if not data.get("address") or len(data.get("address", "")) < 10:
                    # Construct from available info (from article only, no AI search)
                    name = data.get("name", "")
                    city = data.get("city", "")
                    if name and city:
                        data["address"] = f"{name}, {city}, {country}"
                    elif name:
                        data["address"] = f"{name}, {country}"
                    # If still no address, geocoding in restaurant_scraper will try to find it via Google Maps API
                
                # Generate Google Maps URL if not present
                if not data.get("google_maps_url") and data.get("name"):
                    restaurant_name = data["name"].replace(" ", "+")
                    city = data.get("city", country).replace(" ", "+")
                    data["google_maps_url"] = f"https://www.google.com/maps/search/{restaurant_name}+{city}+{country.replace(' ', '+')}"
                
                return data
            return None
        except Exception as e:
            print(f"⚠️ Restaurant extraction failed: {e}")
            return None

    def enrich_restaurant_metadata(
        self,
        name: str,
        cuisine_type: str,
        city: str,
        country: str,
        rating: float,
        address: str = "",
        existing_description: str = "",
    ):
        """
        Generate description, specialty_dish, menu_highlights, clickbait_hook, why_filipinos_love_it
        for a restaurant (e.g. from Google Places). Fills empty metadata for API responses.
        Returns dict with those keys, or None if AI unavailable / fails.
        """
        if not self.text_model:
            return None
        prompt = f"""You are writing short metadata for a Filipino / Pinoy cuisine restaurant listing.

Restaurant: {name}
Cuisine type: {cuisine_type}
Location: {city}, {country}
Rating: {rating}
Address: {address or 'Not provided'}

{f'Existing review snippet (use only to inspire, do not copy): {existing_description[:300]}' if existing_description else ''}

Return valid JSON only (no markdown), with these exact keys:
- "description": 2-3 sentences max. Engaging, mention Filipino cuisine and who it's for (OFWs, locals). If existing snippet given, summarize or complement it.
- "specialty_dish": One signature dish (e.g. "Crispy pata", "Sinigang na baboy")
- "menu_highlights": 3-5 dishes comma-separated (e.g. "Adobo, Kare-kare, Lechon, Halo-halo")
- "clickbait_hook": One catchy line for social (e.g. "Best sinigang in Manchester! 🍲")
- "why_filipinos_love_it": One sentence why OFWs/Filipinos should visit.

Be concise. English only."""
        try:
            response = self.text_model.generate_content(prompt)
            text = response.text
            start_idx = text.find('{')
            end_idx = text.rfind('}')
            if start_idx != -1 and end_idx != -1:
                json_str = text[start_idx:end_idx + 1].replace('```json', '').replace('```', '').strip()
                return json.loads(json_str)
        except Exception as e:
            print(f"   ⚠️ Enrich metadata failed: {e}")
        return None

    def rewrite_cnn_style(self, original_title, original_content, country, category, original_url=""):
        """
        Rewrites the article in CNN-style professional journalism.
        Returns: (new_title, new_content, keywords, summary, citations)
        """
        
        # Determine Headline Mode based on Category
        strict_categories = ["Politics", "Health", "Migration", "Crime", "Policy", "Government", "Legal"]
        balanced_categories = ["Business", "Real Estate", "Education", "Tech", "Economy", "Environment", "Sports"]
        # All others (Lifestyle, Success Stories, Entertainment, etc.) fall into Engagement/Catchy mode
        
        headline_mode = "ENGAGEMENT"
        tone_instruction = "Emotional but accurate. Catchy hooks allowed."
        
        if any(c.lower() in category.lower() for c in strict_categories):
            headline_mode = "STRICT"
            tone_instruction = "Factual, neutral, no emotional framing. ZERO BIAS."
        elif any(c.lower() in category.lower() for c in balanced_categories):
            headline_mode = "BALANCED"
            tone_instruction = "Curiosity allowed, no exaggeration. Explain impact."

        prompt = f"""
        ACT AS: Senior Investigative Journalist for CNN/Semafor (Target Audience: Filipinos/OFWs globally).
        TASK: Write a comprehensive, deep-dive article based on the provided source content.

        METADATA:
        - Country Focus: {country}
        - Category: {category} (NOTE: If content is an Opinion/Blog, change Category to "Opinion" or "Analysis")
        - Writing Style: {AI_WRITING_STYLE}
        - Source URL: {original_url}
        - HEADLINE MODE: {headline_mode} ({tone_instruction})

        INPUT DATA:
        TITLE: {original_title}
        CONTENT: {original_content}

        GUIDELINES FOR "WELL-DETAILED" CONTENT (CRITICAL):
        1. � HEADLINE RULES ({headline_mode}):
           - STRICT: Absolute neutrality. No "Shocking", "Desperate", "Secret". Just facts.
           - BALANCED: Can use curiosity ("Why...", "How...") but must be professional.
           - ENGAGEMENT: Can use emotional hooks ("From Manila to...", "Success Story"). NO DECEPTION.
           * RULE: Any curiosity in the headline MUST be answered in the first 2 paragraphs.
        
        2. 🧹 CLEAN FORMATTING: Do NOT write "SUBHEADER:" or "LEDE:". Use Markdown (##) for structure.
        
        3. 🔍 ADD SPECIFICS: Extract NUMBERS, DATES, NAMES. If vague, maintain skepticism.
        
        4. 🧠 CONTEXTUALIZE: Explain the impact on Filipinos/OFWs (Jobs, Economy, Rights).
        
        5. 🛡️ POLITICAL/OPINION SAFETY:
           - If mentioning politicians: Maintain strict neutrality. Attribute all claims ("According to...").
           - If source is a blog: Explicitly label as "Opinion".

        OUTPUT FORMAT (Strict):
        HEADLINE: [Headline matching {headline_mode} mode - Max 80 chars]
        SUMMARY: [Executive Brief: 3 bullet points summarizing the key takeaway]
        KEYWORDS: [3-5 High-value SEO keywords]
        ARTICLE:
        [Strong opening paragraph with hard facts (Who, what, when, where)]
        
        [Deep dive paragraphs with specific details]
        
        ## Why It Matters
        [Context, economic impact, or expert analysis]
        
        ## What Filipinos Need to Know
        [Actionable advice or future outlook]

        CITATIONS:
        [1] Source Name - Title ({original_url})
        """
        text = None
        
        # Step 1: Try Gemini first
        try:
            if self.text_model:
                response = self.text_model.generate_content(prompt)
                text = response.text
        except Exception as e:
            print(f"⚠️ Gemini rewrite failed: {str(e)[:100]}")
            text = None
        
        # Step 2: Fallback to OpenAI GPT
        if not text:
            print("🔄 Gemini failed, trying OpenAI GPT fallback...")
            system_instruction = f"""You are a senior investigative journalist for CNN/Semafor targeting Filipinos/OFWs globally.
            Writing Style: {AI_WRITING_STYLE}
            Country Focus: {country}
            Category: {category}"""
            text = self._try_openai_gpt(prompt, system_instruction=system_instruction, max_tokens=3000)
        
        # Step 3: Parse response
        new_title = original_title
        summary = ""
        keywords = category
        new_content = original_content
        citations = []
        
        if text:
            if "HEADLINE:" in text:
                parts = text.split("HEADLINE:")[1]
                if "SUMMARY:" in parts:
                    new_title = parts.split("SUMMARY:")[0].strip()
                    parts = parts.split("SUMMARY:")[1]
                    
                    if "KEYWORDS:" in parts:
                        summary = parts.split("KEYWORDS:")[0].strip()
                        parts = parts.split("KEYWORDS:")[1]
                        
                        if "ARTICLE:" in parts:
                            keywords = parts.split("ARTICLE:")[0].strip()
                            parts = parts.split("ARTICLE:")[1]
                            
                            if "CITATIONS:" in parts:
                                new_content = parts.split("CITATIONS:")[0].strip()
                                citations_text = parts.split("CITATIONS:")[1].strip()
                                # Parse citations into a list if possible, or keep as text
                                citations = [c.strip() for c in citations_text.split('\n') if c.strip()]
                            else:
                                new_content = parts.strip()

            # Clean markdown formatting from AI response
            new_title = clean_markdown(new_title)
            new_content = clean_markdown(new_content)
            summary = clean_markdown(summary)
            keywords = clean_markdown(keywords)
        else:
            print("❌ Both Gemini and OpenAI failed. Using original content.")
            if not self.text_model:
                print("   ❌ Text model is None - Model failed to initialize")
                print("   💡 API key invalid, no billing linked, or quota exhausted")
        
        return new_title, new_content, keywords, summary, citations

    def generate_image_prompt(self, title, content, country, category):
        """Generates a visual prompt for image generation."""
        prompt = f"""
        Create a SHORT visual prompt (1-2 sentences) for an AI image generator.
        The image should represent a news story about {category} in {country}, specifically focusing on the Filipino community or OFWs if applicable.
        
        News: {title}
        
        Style Guidelines:
        - Professional photojournalism style
        - Realistic and culturally sensitive
        - If humans are featured, they should look like Filipinos
        
        Return ONLY the prompt text. No explanation. Be specific and visual.
        """
        try:
            response = self.text_model.generate_content(prompt)
            return response.text.strip()
        except:
            return f"Professional {category} scene in {country}, photojournalism style"

    def _try_openai_dalle(self, visual_prompt, article_id):
        """
        Try OpenAI DALL-E models as fallback.
        Returns temp file path if successful, None otherwise.
        """
        import os
        api_key = os.getenv("OPENAI_API_KEY")
        
        if not api_key:
            return None
        
        # Check if OpenAI fallback is enabled (default: true if API key exists)
        fallback_enabled = os.getenv("OPENAI_FALLBACK_ENABLED", "true").lower() == "true"
        if not fallback_enabled:
            return None
        
        try:
            from openai import OpenAI
        except ImportError:
            print("⚠️ OpenAI library not installed. Install with: pip install openai")
            return None
        
        # Configuration from env or defaults
        image_size = os.getenv("OPENAI_IMAGE_SIZE", "1024x1024")
        image_quality = os.getenv("OPENAI_IMAGE_QUALITY", "standard")
        
        # Try DALL-E 3 first, then DALL-E 2
        models = [
            {"model": "dall-e-3", "size": image_size, "quality": image_quality},
            {"model": "dall-e-2", "size": "1024x1024", "quality": None}  # DALL-E 2 doesn't support quality parameter
        ]
        
        client = OpenAI(api_key=api_key)
        temp_filename = f"gen_{article_id}.png"
        temp_path = os.path.abspath(temp_filename)
        
        for model_config in models:
            try:
                model = model_config["model"]
                size = model_config["size"]
                quality = model_config.get("quality")
                
                print(f"   🔄 Trying OpenAI {model}...")
                
                # Prepare request parameters
                request_params = {
                    "model": model,
                    "prompt": visual_prompt,
                    "n": 1,
                    "size": size
                }
                
                # Add quality for DALL-E 3 only
                if quality and model == "dall-e-3":
                    request_params["quality"] = quality
                
                # Generate image
                response = client.images.generate(**request_params)
                
                # Download image
                image_url = response.data[0].url
                import requests
                img_response = requests.get(image_url)
                img_response.raise_for_status()
                
                # Save to temp file
                img = Image.open(io.BytesIO(img_response.content))
                img.save(temp_path)
                
                print(f"✅ Image generated using OpenAI {model}")
                return temp_path
                
            except Exception as e:
                print(f"   ⚠️ OpenAI {model_config['model']} failed: {str(e)[:100]}")
                continue
        
        return None

    def generate_image(self, visual_prompt, article_id, upload=True):
        """
        Generates an image using available Gemini/Imagen models with OpenAI DALL-E fallback.
        If upload=True, uploads to S3/GCP and returns URL.
        Otherwise returns local path.
        """
        print(f"🎨 Generating image: {visual_prompt[:50]}...")
        
        image_models = [
            'nano-banana-pro-preview',
            'gemini-2.0-flash-exp-image-generation',
            'gemini-3-pro-image-preview',
            'gemini-2.5-flash-image'
        ]

        # Use uuid if no article_id provided (for new generations)
        import uuid
        import io
        if not article_id:
            article_id = str(uuid.uuid4())

        # Step 1: Try Gemini/Imagen models
        for model_name in image_models:
            try:
                full_model_name = f"models/{model_name}"
                image_model = genai.GenerativeModel(full_model_name)
                result = image_model.generate_content(visual_prompt)
                
                image_bytes = None
                temp_filename = f"gen_{article_id}.png"
                temp_path = os.path.abspath(temp_filename)
                
                # Try to extract image from response
                if hasattr(result, 'images') and result.images:
                    result.images[0].save(temp_path)
                    image_bytes = True
                elif hasattr(result, 'candidates') and result.candidates:
                    for part in result.candidates[0].content.parts:
                        if hasattr(part, 'inline_data'):
                            image_bytes_data = part.inline_data.data
                            if image_bytes_data:
                                img = Image.open(io.BytesIO(image_bytes_data))
                                img.save(temp_path)
                                image_bytes = True
                                break
                
                if image_bytes and os.path.exists(temp_path):
                    print(f"✅ Image generated using {model_name}")
                    
                    if upload:
                        from storage import StorageHandler
                        storage = StorageHandler()
                        destination = f"generated/{temp_filename}"
                        public_url = storage.upload_image(temp_path, destination)
                        return public_url
                    
                    return temp_path

            except Exception as e:
                # print(f"   Model {model_name} failed: {e}") # Verbose
                continue
        
        # Step 2: Fallback to OpenAI DALL-E
        print("🔄 Gemini models failed, trying OpenAI DALL-E fallback...")
        openai_result = self._try_openai_dalle(visual_prompt, article_id)
        if openai_result and os.path.exists(openai_result):
            if upload:
                from storage import StorageHandler
                storage = StorageHandler()
                temp_filename = f"gen_{article_id}.png"
                destination = f"generated/{temp_filename}"
                public_url = storage.upload_image(openai_result, destination)
                return public_url
            return openai_result
        
        # Step 3: Placeholder
        print("⚠️ Image generation failed. Using placeholder.")
        return "https://placehold.co/800x450?text=News+Image"




if __name__ == "__main__":
    ai = AIProcessor()
    
    # Demo
    title = "Dubai Real Estate Market Hits Record High"
    content = "The Dubai property market has reached unprecedented levels with luxury sales up 40%."
    
    country = ai.detect_country(title, content)
    print(f"Detected Country: {country}")
    
    new_title, new_content, keywords, summary, citations = ai.rewrite_cnn_style(title, content, country, "Real Estate")
    print(f"New Title: {new_title}")
    print(f"Summary: {summary}")
    print(f"Keywords: {keywords}")
    print(f"Citations: {citations}")
