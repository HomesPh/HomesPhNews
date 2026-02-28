
# 🏗️ AI Processing Pipeline Flow

This logic flow represents the `AIProcessor` class structure in `Script/ai_service.py`.

```mermaid
graph TD
    A[RAW NEWS INPUT<br/>(Title + Content + URL)] --> B[AIProcessor Init<br/>Load Gemini Model]
    B --> C[Country Detection<br/>detect_country]
    C --> |Returns Country| D[Topic Detection<br/>detect_topics]
    D --> |Returns Topics| E[CNN-Style Rewrite<br/>rewrite_cnn_style]
    
    subgraph "Rewrite Logic"
    E --> F{Check Category}
    F -->|Politics/Health| G[STRICT MODE<br/>Neutral, Factual]
    F -->|Business/Tech| H[BALANCED MODE<br/>Professional, Curious]
    F -->|Lifestyle/Success| I[ENGAGEMENT MODE<br/>Emotional, Catchy]
    end
    
    G --> J[Generate Content]
    H --> J
    I --> J
    
    J --> K[Structure Output:<br/>Headline, Summary, Keywords,<br/>Article, Citations]
    K --> L[Markdown Cleaning<br/>clean_markdown]
    L --> M[Image Generation]
    
    subgraph "Image Gen"
    M --> N[Generate Visual Prompt]
    N --> O[Generate Image]
    end
    
    O --> P[FINAL POLISHED NEWS<br/>Ready for Database]
```

## 📝 Text Representation

```text
                    +---------------------+
                    |  RAW NEWS INPUT     |
                    | (Title + Content)  |
                    +---------------------+
                              |
                              v
                    +---------------------+
                    |  AIProcessor Init   |
                    | - Load Gemini Model |
                    | - Configure API    |
                    +---------------------+
                              |
                              v
             +-----------------------------------+
             |  Country Detection (detect_country)|
             | - Analyze title & snippet         |
             | - Return single country or 'Global'|
             +-----------------------------------+
                              |
                              v
             +-----------------------------------+
             |  Topic Detection (detect_topics)  |
             | - Analyze content & category      |
             | - Return 2-4 relevant topics     |
             +-----------------------------------+
                              |
                              v
             +-----------------------------------+
             |  CNN-Style Rewrite (rewrite_cnn_style) |
             | - Determine HEADLINE MODE based on     |
             |   category (STRICT / BALANCED / ENGAGEMENT) |
             | - Generate:                             |
             |    • Headline                           |
             |    • Summary                             |
             |    • Keywords                            |
             |    • Full Article (well-detailed)       |
             |    • Citations                           |
             +-----------------------------------+
                              |
                              v
             +-----------------------------------+
             |  Markdown Cleaning (clean_markdown)|
             | - Remove headers, bold/italic       |
             | - Clean whitespace                  |
             +-----------------------------------+
                              |
                              v
             +-----------------------------------+
             |  Image Generation                  |
             | - Generate visual prompt (generate_image_prompt) |
             | - Generate image via Gemini/Imagen models (generate_image) |
             | - Return image path or placeholder |
             +-----------------------------------+
                              |
                              v
                    +---------------------+
                    | FINAL POLISHED NEWS |
                    | - Headline          |
                    | - Summary           |
                    | - Keywords          |
                    | - Article Content   |
                    | - Topics / Country  |
                    | - Image             |
                    | - Citations         |
                    +---------------------+
```
