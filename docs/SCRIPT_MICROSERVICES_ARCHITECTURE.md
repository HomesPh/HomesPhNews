# Script Microservices Architecture

## Overview

The `Script/` directory is split into two independent service modules to separate resource concerns:

- **Articles** are fetched **every hour** — AI-heavy (country detection, CNN rewrite, image generation)
- **Restaurants** are fetched **twice daily** — lighter load, stable data, Google Places API quota limits

Previously, both ran inside a single unified FastAPI app (`main.py`). The modular split allows each service to be deployed, scaled, and scheduled independently without one affecting the other.

---

## Architecture

```
Script/
├── articles/                   ← Articles microservice (port 8011)
│   ├── __init__.py
│   ├── main.py                 ← FastAPI app, hourly schedule
│   ├── routes.py               ← Article-only API routes
│   └── scheduler.py            ← Article-only job functions
│
├── restaurants/                ← Restaurants microservice (port 8012)
│   ├── __init__.py
│   ├── main.py                 ← FastAPI app, 06:00 & 18:00 schedule
│   ├── routes.py               ← Restaurant-only API routes
│   └── scheduler.py            ← Restaurant-only job functions
│
├── main.py                     ← Unified legacy service (port 8001) — unchanged
├── routes.py                   ← Unified routes — unchanged
├── scheduler.py                ← Unified scheduler — unchanged
│
└── Shared (root level):
    ├── config.py               ← Countries, categories, AI settings
    ├── models.py               ← Pydantic + SQLAlchemy models
    ├── database.py             ← Redis + MySQL connections
    ├── ai_service.py           ← Gemini AI processing
    ├── storage.py              ← Redis + GCP/AWS S3 handler
    ├── scheduler_control.py    ← Scheduler on/off toggle
    ├── scraper.py              ← Google News RSS scraper (articles)
    ├── places_client.py        ← Google Places API client (restaurants)
    └── pipeline.py             ← Article pipeline (standalone use)
```

---

## Service Reference

| Service | Port | Schedule | Entry Point | Start Command |
|---|---|---|---|---|
| Unified (legacy) | 8001 | Hourly + 2× daily | `main.py` | `python main.py` |
| Articles | 8011 | Every hour (`:00`) | `articles/main.py` | `python -m articles.main` |
| Restaurants | 8012 | 06:00 & 18:00 | `restaurants/main.py` | `python -m restaurants.main` |

> **Always run from the `Script/` directory.**

---

## API Routes

### Articles Service (port 8011)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/articles` | All articles (paginated) |
| GET | `/articles/{id}` | Single article |
| DELETE | `/articles/{id}` | Delete article |
| POST | `/articles/clear-all` | Wipe all articles |
| GET | `/articles/country/{country}` | By country |
| GET | `/articles/category/{category}` | By category |
| GET | `/latest` | Most recent articles |
| GET | `/search?q=` | Full-text search |
| GET | `/countries` | Countries with counts |
| GET | `/categories` | Categories with counts |
| GET | `/db/categories` | MySQL categories |
| GET | `/db/countries` | MySQL countries |
| GET | `/db/cities` | MySQL cities |
| POST | `/generate-images` | AI image generation |
| POST | `/trigger` | Manual article scrape |
| POST | `/trigger/sports` | Manual sports scrape |
| POST | `/trigger/cancel` | Cancel running job |
| POST | `/trigger/targeted` | Targeted country/category scrape |
| GET | `/status` | Article job status |
| GET | `/stats` | System statistics |
| POST | `/scheduler/off` | Pause auto schedule |
| POST | `/scheduler/on` | Resume auto schedule |
| GET | `/scheduler` | Schedule on/off state |

### Restaurants Service (port 8012)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/restaurants` | All restaurants (paginated) |
| GET | `/restaurants/{id}` | Single restaurant |
| GET | `/restaurants/country/{country}` | By country |
| POST | `/restaurants/clear-all` | Wipe all restaurants |
| POST | `/trigger/restaurants` | Manual restaurant fetch |
| GET | `/status/restaurants` | Restaurant job status |
| GET | `/stats` | Scheduler statistics |
| POST | `/scheduler/off` | Pause auto schedule |
| POST | `/scheduler/on` | Resume auto schedule |
| GET | `/scheduler` | Schedule on/off state |

---

## How to Run

```bash
# From Script/ directory:

# Run articles service only
python -m articles.main

# Run restaurants service only
python -m restaurants.main

# Run legacy unified service (articles + restaurants)
python main.py

# Custom port
python -m articles.main --port 9001
python -m restaurants.main --port 9002
```

Swagger docs available at:
- Articles: `http://localhost:8011/docs`
- Restaurants: `http://localhost:8012/docs`
- Unified: `http://localhost:8001/docs`

---

## Shared Files Guide

These files live at the `Script/` root and are imported by both sub-modules via `sys.path` injection:

| File | Purpose |
|---|---|
| `config.py` | COUNTRIES, CATEGORIES, RESTAURANT_CATEGORIES, AI settings |
| `models.py` | All Pydantic and SQLAlchemy models |
| `database.py` | Redis + MySQL connections, `PREFIX`, `get_db` |
| `ai_service.py` | AIProcessor — Gemini AI for articles and restaurants |
| `storage.py` | StorageHandler — Redis metadata + GCP/S3 images |
| `scheduler_control.py` | Global scheduler on/off toggle |
| `scraper.py` | NewsScraper — Google News RSS (articles only) |
| `places_client.py` | Google Places API client (restaurants only) |

**Do not add service-specific logic to shared files.** Keep shared files generic.

---

## Import Architecture

Each sub-module adds the `Script/` root to `sys.path` so shared files can be imported normally:

```python
# Top of every file in articles/ and restaurants/
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Root-level shared imports then work:
from config import COUNTRIES
from database import redis_client, PREFIX
from storage import StorageHandler
```

Sub-module schedulers are imported with their full package path to avoid ambiguity with root `scheduler.py`:

```python
# In articles/routes.py:
from articles.scheduler import run_hourly_job, job_status

# In restaurants/routes.py:
from restaurants.scheduler import run_restaurant_job, restaurant_job_status
```

---

## Environment Variables

Both services share the same `.env` file.

| Variable | Used By | Purpose |
|---|---|---|
| `REDIS_URL` | Both | Redis connection |
| `REDIS_PREFIX` | Both | Key prefix (`homesph:`) |
| `DATABASE_URL` | Both | MySQL connection |
| `GOOGLE_AI_API_KEY` | Articles | Gemini AI |
| `GCP_BUCKET_NAME` | Articles | Cloud image storage |
| `GCP_SERVICE_ACCOUNT_JSON` | Articles | GCP auth |
| `AWS_BUCKET` / `AWS_FOLDER` | Articles | S3 image storage |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Articles | S3 auth |
| `STORAGE_PROVIDER` | Articles | `gcp` or `aws` |
| `GOOGLE_MAPS_API_KEY` | Restaurants | Google Places API |
| `FILIPINO_ONLY` | Restaurants | Filter Filipino-owned only |
| `RESTAURANT_ENRICH_AI` | Restaurants | AI enrichment toggle |
| `DISCORD_WEBHOOK_URL` | Articles | Job completion notifications |

---

## Redis Key Namespacing

Both services share the same Redis instance and prefix (`homesph:`).

| Key Pattern | Owner | Description |
|---|---|---|
| `homesph:article:{uuid}` | Articles | Article JSON data |
| `homesph:all_articles` | Articles | Set of all article IDs |
| `homesph:country:{name}` | Articles | Article IDs by country |
| `homesph:category:{name}` | Articles | Article IDs by category |
| `homesph:articles_by_time` | Articles | Sorted set by timestamp |
| `homesph:scraped_urls` | Articles | Dedup: URL hashes |
| `homesph:title_hashes` | Articles | Dedup: Title hashes |
| `homesph:restaurant:{uuid}` | Restaurants | Restaurant JSON data |
| `homesph:all_restaurants` | Restaurants | Set of all restaurant IDs |
| `homesph:country:{name}:restaurants` | Restaurants | Restaurant IDs by country |
| `homesph:restaurant_place_ids` | Restaurants | Dedup: Google Place IDs |

---

## Known Issues

### `restaurant_scraper.py` removed
The root `scheduler.py` imports `from restaurant_scraper import RestaurantScraper` (line 21),
but this file was deleted from the project (`D Script/restaurant_scraper.py` in git).

The `process_single_restaurant_country` function in both the root and `restaurants/scheduler.py`
used this scraper as a fallback when Google Places API has no DB locations.

**Current state:**
- `restaurants/scheduler.py` — The fallback function returns an error message instead of crashing
- Primary path (`process_single_restaurant_location` via Google Places API) **works correctly**
- Root `scheduler.py` still has the broken import (unchanged by this refactor)

**Resolution needed:** Either restore `restaurant_scraper.py` or implement a new fallback.

---

## Change Log

| Date | Change |
|---|---|
| 2026-03-09 | Created `articles/` and `restaurants/` modules. Separated scheduler and routes. Added this doc. |
