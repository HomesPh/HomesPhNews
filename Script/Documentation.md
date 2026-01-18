# 📰 HomesPh Global News Engine - Documentation

> **Version:** 1.0.0  
> **Last Updated:** January 2026  
> **Author:** HomesPh Development Team

---

## 🌍 Overview

HomesPh Global News Engine is an AI-powered news aggregation and content generation platform that:

1. **Crawls** trusted news sources from multiple countries via Google News RSS
2. **Analyzes** and filters content by country and category
3. **Rewrites** articles in CNN-style professional journalism using Gemini AI
4. **Generates** unique AI images for each article using Nano Banana/Gemini Imagen
5. **Stores** processed articles in Redis with country/category indexing
6. **Uploads** generated images to Google Cloud Storage

---

## 📁 File Structure

```
Script/
├── config.py           # Centralized configuration (countries, categories, settings)
├── scraper.py          # Google News RSS crawler
├── ai_service.py       # Gemini AI processing (rewriting, country detection, images)
├── storage.py          # Redis + GCP Cloud Storage handler
├── pipeline.py         # Automated batch processing (cron-ready)
├── main_gui.py         # Tkinter dashboard for manual scraping/processing
├── data_savegui.py     # Tkinter viewer for processed articles
├── requirements.txt    # Python dependencies
├── env.example         # Environment variable template
├── .env                # Your actual secrets (GITIGNORED)
├── .gitignore          # Files excluded from version control
└── Documentation.md    # This file
```

---

## 📄 File Descriptions

### `config.py`
**Purpose:** Centralized configuration for the entire system.

**Contents:**
| Variable | Description |
|----------|-------------|
| `COUNTRIES` | Dictionary of supported countries with Google News region codes (`gl`, `hl`, `ceid`) |
| `CATEGORIES` | List of news categories (Real Estate, Business, Politics, etc.) |
| `TRUSTED_DOMAINS` | Optional whitelist of trusted news sources |
| `AI_WRITING_STYLE` | Prompt template for CNN-style article rewriting |
| `SCRAPER_SETTINGS` | Rate limiting, user agent, articles per search |
| `REDIS_KEYS` | Key patterns for Redis storage |

**Supported Countries:**
- 🇵🇭 Philippines
- 🇸🇬 Singapore
- 🇨🇦 Canada
- 🇺🇸 United States
- 🇦🇪 United Arab Emirates
- 🇬🇧 United Kingdom
- 🇦🇺 Australia
- 🇮🇳 India

---

### `scraper.py`
**Purpose:** Crawls news from Google News RSS feeds.

**Class:** `NewsScraper`

**Key Methods:**
| Method | Description |
|--------|-------------|
| `build_rss_url(keyword, country)` | Constructs Google News RSS URL with regional targeting |
| `fetch_news(keyword, country)` | Fetches articles for a specific country/keyword combo |
| `extract_article_content(url)` | Uses Newspaper3k to extract full article text |
| `run_full_crawl(countries, categories)` | Batch crawl all countries × categories |
| `run_single_country(country)` | Crawl single country, all categories |
| `run_single_category(category)` | Crawl single category, all countries |

**Returns:** List of article dictionaries with:
- `title`, `link`, `published`, `source`, `description`, `country`, `category`

---

### `ai_service.py`
**Purpose:** AI processing using Google Gemini.

**Class:** `AIProcessor`

**Key Methods:**
| Method | Description |
|--------|-------------|
| `detect_country(title, content)` | Uses AI to determine the primary country focus |
| `rewrite_cnn_style(title, content, country, category)` | Rewrites article in CNN journalism style |
| `generate_image_prompt(title, content, country, category)` | Creates visual prompt for image generation |
| `generate_image(prompt, article_id)` | Generates image using Nano Banana / Gemini Imagen |

**🔄 Image Generation Fallback Strategy:**

The system uses a **cascading fallback** approach for image generation. If one model fails (due to quota, availability, or API errors), it automatically tries the next model in the list:

```
1. nano-banana-pro-preview        ← Try first (Nano Banana)
         │
         ▼ (if failed)
2. gemini-2.0-flash-exp-image-generation
         │
         ▼ (if failed)
3. gemini-3-pro-image-preview
         │
         ▼ (if failed)
4. gemini-2.5-flash-image
         │
         ▼ (if ALL failed)
5. Placeholder Image              ← Fallback: placehold.co URL
```

This ensures the pipeline **never crashes** due to image generation issues. The article is still saved with either a real AI image or a placeholder.

**Returns:**
- `rewrite_cnn_style()`: `(new_title, new_content, seo_keywords)`
- `generate_image()`: Image URL (GCP) or local path or placeholder URL


---

### `storage.py`
**Purpose:** Handles Redis metadata storage and GCP image uploads.

**Class:** `StorageHandler`

**Key Methods:**
| Method | Description |
|--------|-------------|
| `save_article(article_data)` | Saves article to Redis with country/category indexing |
| `get_articles_by_country(country)` | Retrieves articles for a specific country |
| `get_articles_by_category(category)` | Retrieves articles for a specific category |
| `get_latest_articles(limit)` | Retrieves most recent articles (sorted by timestamp) |
| `get_article(article_id)` | Retrieves single article by ID |
| `upload_image(local_path, destination)` | Uploads image to GCP Cloud Storage |
| `get_stats()` | Returns storage statistics |

**Redis Key Structure:**
```
homesph:article:{article_id}     → Full article JSON
homesph:country:{country_name}   → Set of article IDs for country
homesph:category:{category_name} → Set of article IDs for category
homesph:all_articles             → Set of all article IDs
homesph:articles_by_time         → Sorted set by timestamp
```

---

### `pipeline.py`
**Purpose:** Automated batch processing script (ideal for cron jobs).

**Class:** `NewsPipeline`

**Key Methods:**
| Method | Description |
|--------|-------------|
| `process_article(raw_article)` | Full AI processing for single article |
| `run_full_pipeline(countries, categories, limit)` | Batch process all countries/categories |
| `run_single_country(country)` | Process single country |
| `run_single_category(category)` | Process single category |

**CLI Usage:**
```bash
# Single country
python pipeline.py --country "Philippines" --limit 5

# Single category (all countries)
python pipeline.py --category "Real Estate" --limit 10

# Full crawl
python pipeline.py --full --limit 3
```

**Cron Job Example (Linux):**
```bash
# Every day at 6 AM
0 6 * * * cd /path/to/Script && python pipeline.py --full --limit 20
```

---

### `main_gui.py`
**Purpose:** Visual dashboard for manual scraping and processing.

**Features:**
- 🔴 CNN-style light theme (Helvetica, Black/Red/White)
- Country and category filter dropdowns
- Breaking news ticker
- Article table with status tracking
- One-click scraping and AI processing

**How to Run:**
```bash
python main_gui.py
```

---

### `data_savegui.py`
**Purpose:** Article viewer for processed content from Redis.

**Features:**
- CNN-style article display
- Country filtering
- Featured image display
- Clickable source links
- Responsive layout

**How to Run:**
```bash
python data_savegui.py
```

---

## ⚙️ Environment Variables

Create a `.env` file based on `env.example`:

```env
# Google AI (Gemini)
GOOGLE_AI_API_KEY=your-gemini-api-key

# GCP Cloud Storage
GCP_BUCKET_NAME=your-bucket-name
GCP_SERVICE_ACCOUNT_JSON=service-account.json  # or inline JSON

# Redis
REDIS_URL=redis://localhost:6379/0
REDIS_PREFIX=homesph:
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd Script
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp env.example .env
# Edit .env with your credentials
```

### 3. Run the Dashboard
```bash
python main_gui.py
```

### 4. View Processed Articles
```bash
python data_savegui.py
```

---

## 🔒 Security Notes

⚠️ **NEVER commit these files to Git:**
- `.env` (contains API keys)
- `service-account.json` (GCP credentials)
- Any `*.json` files with credentials

✅ **These are safe to commit:**
- `env.example` (template only)
- All `.py` files
- `requirements.txt`
- `Documentation.md`

---

## 📊 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                            │
│   (main_gui.py or pipeline.py)                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SCRAPER MODULE                            │
│   scraper.py → Google News RSS → Raw Articles               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI SERVICE MODULE                         │
│   ai_service.py → Gemini AI                                 │
│   • Country Detection                                        │
│   • CNN-Style Rewriting                                      │
│   • Image Generation                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    STORAGE MODULE                            │
│   storage.py                                                 │
│   • Redis: Article metadata (indexed by country/category)   │
│   • GCP: Generated images                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VIEWER                                    │
│   data_savegui.py → Display processed articles              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Troubleshooting

### GCP Authentication Error
```
⚠️ GCP Auth Warning: No key could be detected.
```
**Solution:** Save your GCP JSON credentials to `service-account.json` and set:
```env
GCP_SERVICE_ACCOUNT_JSON=service-account.json
```

### Image Generation Fails
```
❌ Model nano-banana-pro-preview failed: ...
```
**Solution:** The system will try multiple models. If all fail, a placeholder image is used.

### No Articles Found
**Solution:** Check your internet connection and ensure Google News RSS is accessible.

---

## 📝 License

MIT License - See main project for details.

---

**Built with ❤️ using Google Gemini AI, Redis, and Google Cloud Platform**
