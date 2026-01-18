"""
HomesPh Global News Engine - AI Service
Handles: CNN-style rewriting, SEO optimization, country detection, image generation.
"""

import os
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv
from config import AI_WRITING_STYLE, COUNTRIES

load_dotenv()

class AIProcessor:
    def __init__(self):
        api_key = os.getenv("GOOGLE_AI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.text_model = self._init_text_model()
        else:
            print("⚠️ GOOGLE_AI_API_KEY not found.")
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
            except:
                continue
        print("⚠️ Could not initialize any text model.")
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

    def rewrite_cnn_style(self, original_title, original_content, country, category):
        """
        Rewrites the article in CNN-style professional journalism.
        Returns: (new_title, new_content, seo_keywords)
        """
        prompt = f"""
        {AI_WRITING_STYLE}

        METADATA:
        - Country Focus: {country}
        - Category: {category}

        ORIGINAL TITLE: {original_title}
        ORIGINAL CONTENT: {original_content}

        OUTPUT FORMAT (strict):
        HEADLINE: [Your new headline]
        KEYWORDS: [3-5 SEO keywords, comma-separated]
        ARTICLE:
        [Your rewritten article]
        """
        try:
            response = self.text_model.generate_content(prompt)
            text = response.text
            
            # Parse response
            new_title = original_title
            keywords = category
            new_content = original_content
            
            if "HEADLINE:" in text:
                new_title = text.split("HEADLINE:")[1].split("KEYWORDS:")[0].strip()
            if "KEYWORDS:" in text:
                keywords = text.split("KEYWORDS:")[1].split("ARTICLE:")[0].strip()
            if "ARTICLE:" in text:
                new_content = text.split("ARTICLE:")[1].strip()
            
            return new_title, new_content, keywords
            
        except Exception as e:
            print(f"❌ Rewrite Error: {e}")
            return f"AI: {original_title}", original_content, category

    def generate_image_prompt(self, title, content, country, category):
        """Generates a visual prompt for image generation."""
        prompt = f"""
        Create a SHORT visual prompt (1-2 sentences) for an AI image generator.
        The image should represent a news story about {category} in {country}.
        
        News: {title}
        
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
        return "https://placehold.co/800x450?text=News+Image"


if __name__ == "__main__":
    ai = AIProcessor()
    
    # Demo
    title = "Dubai Real Estate Market Hits Record High"
    content = "The Dubai property market has reached unprecedented levels with luxury sales up 40%."
    
    country = ai.detect_country(title, content)
    print(f"Detected Country: {country}")
    
    new_title, new_content, keywords = ai.rewrite_cnn_style(title, content, country, "Real Estate")
    print(f"New Title: {new_title}")
    print(f"Keywords: {keywords}")
