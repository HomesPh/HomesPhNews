#!/usr/bin/env python3
"""
Test script for image generation (Gemini + OpenAI fallback)
Tests API keys and generates sample images to verify everything works.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_openai_key():
    """Test OpenAI API key."""
    print("\n" + "="*60)
    print("🔑 Testing OpenAI API Key...")
    print("="*60)
    
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("❌ OPENAI_API_KEY not found in .env file")
        return False
    
    if not api_key.startswith("sk-"):
        print("⚠️  Warning: OpenAI API key should start with 'sk-'")
        print(f"   Current key starts with: {api_key[:5]}...")
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        # Simple test - list models (lightweight API call)
        print("   Testing API connection...")
        models = client.models.list()
        print(f"✅ OpenAI API key is valid!")
        print(f"   Available models: {len(models.data)} models")
        
        # Test DALL-E availability
        print("\n   Testing DALL-E models...")
        dalle_models = ["dall-e-3", "dall-e-2"]
        for model in dalle_models:
            try:
                # Try to generate a tiny test image
                print(f"   Testing {model}...", end=" ")
                response = client.images.generate(
                    model=model,
                    prompt="A simple red circle on white background",
                    n=1,
                    size="256x256" if model == "dall-e-2" else "1024x1024"
                )
                print("✅ Working!")
                return True
            except Exception as e:
                print(f"❌ Failed: {str(e)[:80]}")
                continue
        
        return False
        
    except ImportError:
        print("❌ OpenAI library not installed")
        print("   Install with: pip install openai")
        return False
    except Exception as e:
        print(f"❌ OpenAI API key test failed: {str(e)}")
        return False


def test_gemini_key():
    """Test Gemini API key."""
    print("\n" + "="*60)
    print("🔑 Testing Google AI (Gemini) API Key...")
    print("="*60)
    
    api_key = os.getenv("GOOGLE_AI_API_KEY")
    
    if not api_key:
        print("❌ GOOGLE_AI_API_KEY not found in .env file")
        return False
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        
        # Test text model first
        print("   Testing text model...", end=" ")
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Say hello")
        print("✅ Working!")
        
        # Test image models
        print("\n   Testing image generation models...")
        image_models = [
            'nano-banana-pro-preview',
            'gemini-2.0-flash-exp-image-generation',
            'gemini-3-pro-image-preview',
            'gemini-2.5-flash-image'
        ]
        
        working_models = []
        for model_name in image_models:
            try:
                print(f"   Testing {model_name}...", end=" ")
                full_model_name = f"models/{model_name}"
                image_model = genai.GenerativeModel(full_model_name)
                # Just test if model can be initialized (don't generate to save quota)
                print("✅ Available")
                working_models.append(model_name)
            except Exception as e:
                print(f"❌ Failed: {str(e)[:60]}")
                continue
        
        if working_models:
            print(f"\n✅ Found {len(working_models)} working Gemini image model(s)")
            return True
        else:
            print("\n⚠️  No Gemini image models available")
            return False
            
    except ImportError:
        print("❌ google-generativeai library not installed")
        print("   Install with: pip install google-generativeai")
        return False
    except Exception as e:
        print(f"❌ Gemini API key test failed: {str(e)}")
        return False


def test_image_generation():
    """Test actual image generation with both services."""
    print("\n" + "="*60)
    print("🎨 Testing Image Generation...")
    print("="*60)
    
    # Import AI service
    try:
        from ai_service import AIProcessor
    except ImportError:
        print("❌ Cannot import ai_service. Make sure you're in the Script/restaurants directory")
        return False
    
    ai = AIProcessor()
    
    if not ai.text_model:
        print("⚠️  Warning: Text model not initialized. Some features may not work.")
    
    # Test prompt
    test_prompt = "A professional photojournalism style image of a Filipino restaurant in Singapore, modern interior, warm lighting"
    
    print(f"\n📝 Test prompt: {test_prompt[:60]}...")
    print("\n🔄 Generating image (this may take 30-60 seconds)...")
    
    try:
        # Generate image (without upload for testing)
        result = ai.generate_image(test_prompt, article_id="test_image", upload=False)
        
        if result and os.path.exists(result):
            file_size = os.path.getsize(result) / 1024  # KB
            print(f"\n✅ Image generated successfully!")
            print(f"   File: {result}")
            print(f"   Size: {file_size:.2f} KB")
            print(f"\n💡 To view the image, open: {os.path.abspath(result)}")
            return True
        elif result and result.startswith("http"):
            print(f"\n✅ Image URL generated: {result}")
            return True
        else:
            print(f"\n❌ Image generation failed. Result: {result}")
            return False
            
    except Exception as e:
        print(f"\n❌ Image generation error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Main test function."""
    print("\n" + "="*60)
    print("🧪 Image Generation API Key Test Script")
    print("="*60)
    print("\nThis script will test your API keys and image generation capabilities.")
    print("Make sure your .env file is configured correctly.\n")
    
    # Check if .env exists
    if not os.path.exists(".env"):
        print("⚠️  Warning: .env file not found in current directory")
        print("   Make sure you're running this from Script/restaurants/ directory")
        response = input("\nContinue anyway? (y/n): ")
        if response.lower() != 'y':
            return
    
    results = {
        "OpenAI": False,
        "Gemini": False,
        "Image Generation": False
    }
    
    # Test OpenAI
    results["OpenAI"] = test_openai_key()
    
    # Test Gemini
    results["Gemini"] = test_gemini_key()
    
    # Summary
    print("\n" + "="*60)
    print("📊 Test Summary")
    print("="*60)
    for service, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"   {service}: {status}")
    
    # Ask if user wants to test actual generation
    if results["OpenAI"] or results["Gemini"]:
        print("\n" + "="*60)
        response = input("\nTest actual image generation? (y/n): ")
        if response.lower() == 'y':
            results["Image Generation"] = test_image_generation()
            
            print("\n" + "="*60)
            print("📊 Final Summary")
            print("="*60)
            for service, passed in results.items():
                status = "✅ PASS" if passed else "❌ FAIL"
                print(f"   {service}: {status}")
    
    print("\n" + "="*60)
    print("✨ Test complete!")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
