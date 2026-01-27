"""
HomesPh Global News Engine - AI Service
Handles: CNN-style rewriting, SEO optimization, country detection, image generation.
"""

import os
import re
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
import google.generativeai as genai
from PIL import Image, ImageDraw, ImageFont
from dotenv import load_dotenv
from config import AI_WRITING_STYLE, COUNTRIES

load_dotenv()

def clean_markdown(text):
    """Remove markdown formatting characters from text."""
    if not text:
        return ""
    # Remove headers (###, ##, #)
    text = re.sub(r'^#{1,6}\s*', '', text, flags=re.MULTILINE)
    # Remove bold/italic markers (**, *, __, _)
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    text = re.sub(r'__([^_]+)__', r'\1', text)
    text = re.sub(r'_([^_]+)_', r'\1', text)
    # Remove any remaining asterisks at the start
    text = re.sub(r'^\*+\s*', '', text)
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

    def _init_text_model(self):
        """Initialize the best available text model."""
        models_to_try = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro']
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
        try:
            response = self.text_model.generate_content(prompt)
            country = response.text.strip().split('\n')[0].replace(".", "").strip()
            # Validate against known countries
            if country in COUNTRIES:
                return country
            return "Global"
        except:
            return "Global"

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
        
        Title: {title}
        Content: {content[:800]}
        Category: {category}
        
        Return ONLY the topics as a comma-separated list. No explanation.
        Example output: AI & PropTech, Smart Homes, Investment
        """
        try:
            response = self.text_model.generate_content(prompt)
            topics_text = response.text.strip()
            
            # Parse comma-separated topics
            topics = [t.strip() for t in topics_text.split(',') if t.strip()]
            
            # Limit to 4 topics max
            topics = topics[:4]
            
            if topics:
                return topics
            return [category]  # Fallback to main category
            
        except Exception as e:
            print(f"⚠️ Topic detection failed: {e}")
            return [category]  # Fallback to main category

    def rewrite_cnn_style(self, original_title, original_content, country, category, original_url=""):
        """
        Rewrites the article in CNN-style professional journalism.
        Returns: (new_title, new_content, keywords, summary, citations)
        """
        
        # Determine Headline Mode based on Category
        strict_categories = ["Politics", "Health", "Migration", "Crime", "Policy", "Government", "Legal"]
        balanced_categories = ["Business", "Real Estate", "Education", "Tech", "Economy", "Environment"]
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
        try:
            response = self.text_model.generate_content(prompt)
            text = response.text
            
            # Parse response
            new_title = original_title
            summary = ""
            keywords = category
            new_content = original_content
            citations = []
            
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
            
            return new_title, new_content, keywords, summary, citations
            
        except Exception as e:
            print(f"❌ Rewrite Error: {e}")
            if "'NoneType'" in str(e):
                print("   ❌ Text model is None - Model failed to initialize")
                print("   💡 API key invalid, no billing linked, or quota exhausted")
            return f"AI: {original_title}", original_content, category, "", []

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

    def generate_image(self, visual_prompt, article_id):
        """
        Generates an image using available Gemini/Imagen models.
        Returns the path to the generated image or a placeholder URL.
        """
        print(f"🎨 Generating image: {visual_prompt[:50]}...")
        
        image_models = [
            'nano-banana-pro-preview',
            'gemini-2.0-flash-exp-image-generation',
            'gemini-3-pro-image-preview',
            'gemini-2.5-flash-image'
        ]

        for model_name in image_models:
            try:
                full_model_name = f"models/{model_name}"
                image_model = genai.GenerativeModel(full_model_name)
                result = image_model.generate_content(visual_prompt)
                
                image_bytes = None
                temp_path = f"temp_{article_id}.png"
                
                # Try to extract image from response
                if hasattr(result, 'images') and result.images:
                    result.images[0].save(temp_path)
                elif hasattr(result, 'candidates') and result.candidates:
                    for part in result.candidates[0].content.parts:
                        if hasattr(part, 'inline_data'):
                            image_bytes = part.inline_data.data
                            break
                    if image_bytes:
                        import io
                        img = Image.open(io.BytesIO(image_bytes))
                        img.save(temp_path)
                
                if os.path.exists(temp_path):
                    print(f"✅ Image generated using {model_name}")
                    return temp_path

            except Exception as e:
                continue
        
        print("⚠️ Image generation failed. Using placeholder.")
        print("   💡 Image generation uses different quota (Imagen) - might have separate limits")
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
