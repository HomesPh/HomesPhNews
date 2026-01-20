# 📚 HomesPhNews - Complete Project Documentation

> **Last Updated:** January 20, 2026  
> **Version:** 1.0.0

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Architecture](#-architecture)
3. [Folder Structure](#-folder-structure)
4. [Python Scripts (Script/)](#-python-scripts-script)
5. [GitHub Actions Workflows](#-github-actions-workflows)
6. [Environment Variables](#-environment-variables)
7. [EC2 Server Access](#-ec2-server-access)
8. [Quick Start Guide](#-quick-start-guide)
9. [Troubleshooting](#-troubleshooting)

---

## 🏠 Project Overview

**HomesPhNews** is a global real estate news aggregation platform that:
- 🔍 Crawls news from multiple countries via Google News RSS
- 🤖 Rewrites articles using AI (CNN-style journalism)
- 🖼️ Generates AI images for articles
- 💾 Stores data in Redis with GCP Cloud Storage for images
- 📱 Serves content via a NextJS frontend and Laravel API

### Tech Stack
| Component | Technology |
|-----------|------------|
| Frontend (client/) | **NextJS** (React) |
| Backend API (server/) | **Laravel** (PHP) |
| Web Crawler (Script/) | **Python 3.11** |
| AI Processing | **Google Gemini AI** |
| Database | **Redis** (metadata) |
| Image Storage | **GCP Cloud Storage** |
| CI/CD | **GitHub Actions** |
| Hosting | **AWS EC2** (Ubuntu) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        HOMESPHNEWS SYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   client/    │◄──►│   server/    │◄──►│    Redis     │      │
│  │   (NextJS)   │    │  (Laravel)   │    │  (Database)  │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                             ▲                    ▲              │
│                             │                    │              │
│                             ▼                    │              │
│                      ┌──────────────┐            │              │
│                      │  GCP Cloud   │            │              │
│                      │   Storage    │            │              │
│                      └──────────────┘            │              │
│                             ▲                    │              │
│                             │                    │              │
│  ┌──────────────────────────┴────────────────────┘              │
│  │                                                              │
│  │   ┌──────────────┐    ┌──────────────┐    ┌────────────┐    │
│  │   │   Script/    │───►│  Google AI   │───►│ News Sites │    │
│  │   │  (Python)    │    │   (Gemini)   │    │   (RSS)    │    │
│  │   └──────────────┘    └──────────────┘    └────────────┘    │
│  │                                                              │
└──┴──────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
HomesPhNews/
├── 📂 .github/
│   └── 📂 workflows/           # GitHub Actions CI/CD
│       ├── ci.yml              # Main CI (lint, test, security)
│       ├── codeql-analysis.yml # Security scanning
│       └── discord-notify.yml  # PR notifications to Discord
│
├── 📂 client/                  # NextJS Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── 📂 server/                  # Laravel Backend API
│   ├── app/
│   ├── routes/
│   └── composer.json
│
├── 📂 Script/                  # Python Web Crawler + AI
│   ├── main_gui.py            # Desktop GUI application
│   ├── scraper.py             # Google News RSS crawler
│   ├── ai_service.py          # Gemini AI integration
│   ├── storage.py             # Redis + GCP storage handler
│   ├── pipeline.py            # Automated crawl pipeline
│   ├── config.py              # Configuration settings
│   ├── .env                   # Environment variables (DO NOT COMMIT)
│   └── requirements.txt       # Python dependencies
│
├── 📄 .gitignore              # Git ignore rules
├── 📄 FHPHKeyPair.pem         # EC2 SSH Key (DO NOT COMMIT!)
├── 📄 Command.txt             # SSH connection command
├── 📄 README.md               # Project overview
└── 📄 DOCUMENTATION.md        # This file
```

---

## 🐍 Python Scripts (Script/)

### Overview
The `Script/` folder contains the Python-based news crawling and AI processing system.

---

### 📄 `config.py` - Configuration
Centralized settings for the entire system.

```python
# Supported Countries
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

# News Categories
CATEGORIES = ["Real Estate", "Business", "Politics", "Technology", "Economy", "Tourism"]
```

| Setting | Description |
|---------|-------------|
| `COUNTRIES` | Supported countries with Google News region codes |
| `CATEGORIES` | News categories/keywords to search |
| `AI_WRITING_STYLE` | Prompt template for CNN-style rewriting |
| `SCRAPER_SETTINGS` | Rate limits, user agent, etc. |
| `REDIS_KEYS` | Key patterns for Redis storage |

---

### 📄 `scraper.py` - News Crawler

**Class:** `NewsScraper`

| Method | Description |
|--------|-------------|
| `build_rss_url(keyword, country_code)` | Constructs Google News RSS URL |
| `fetch_news(keyword, country)` | Fetches articles for a specific country/keyword |
| `extract_article_content(url)` | Extracts full article text using Newspaper3k |
| `run_full_crawl(countries, categories)` | Crawls all countries × categories |
| `run_single_country(country)` | Crawls one country, all categories |
| `run_single_category(category)` | Crawls one category, all countries |

**Example:**
```python
from scraper import NewsScraper

scraper = NewsScraper()
articles = scraper.fetch_news("Real Estate", "Philippines")
# Returns: [{"title": "...", "link": "...", "country": "Philippines", ...}]
```

---

### 📄 `ai_service.py` - AI Processing

**Class:** `AIProcessor`

Uses **Google Gemini AI** for content processing.

| Method | Description |
|--------|-------------|
| `detect_country(title, content)` | AI-detects the primary country in an article |
| `rewrite_cnn_style(title, content, country, category)` | Rewrites article in CNN journalism style |
| `generate_image_prompt(title, content, country, category)` | Creates a visual prompt for image generation |
| `generate_image(visual_prompt, article_id)` | Generates an AI image using Gemini/Imagen |

**Example:**
```python
from ai_service import AIProcessor

ai = AIProcessor()
country = ai.detect_country("Dubai Market Hits Record", "Dubai property sales up 40%...")
# Returns: "United Arab Emirates"

new_title, new_content, keywords = ai.rewrite_cnn_style(
    "Original Title",
    "Original content...",
    "Philippines",
    "Real Estate"
)
```

---

### 📄 `storage.py` - Data Storage

**Class:** `StorageHandler`

Handles **Redis** for article metadata and **GCP Cloud Storage** for images.

| Method | Description |
|--------|-------------|
| `save_article(article_data)` | Saves article to Redis with country/category indexes |
| `get_articles_by_country(country, limit)` | Retrieves articles for a specific country |
| `get_articles_by_category(category, limit)` | Retrieves articles for a specific category |
| `get_latest_articles(limit)` | Gets most recent articles across all countries |
| `get_article(article_id)` | Retrieves a single article by ID |
| `upload_image(local_path, destination_path)` | Uploads image to GCP Cloud Storage |
| `get_stats()` | Returns total article count and indexes |

**Redis Key Structure:**
```
homesph:article:{article_id}     → Full article JSON
homesph:country:philippines      → Set of article IDs for Philippines
homesph:category:real_estate     → Set of article IDs for Real Estate
homesph:all_articles             → Set of all article IDs
homesph:articles_by_time         → Sorted set by timestamp
```

---

### 📄 `pipeline.py` - Automated Pipeline

**Class:** `NewsPipeline`

The main automation script that combines Scraper → AI → Storage.

| Method | Description |
|--------|-------------|
| `process_article(raw_article)` | Full processing: extract → detect → rewrite → generate image → store |
| `run_full_pipeline(countries, categories, limit)` | Complete crawl + process all articles |
| `run_single_country(country, limit)` | Pipeline for one country |
| `run_single_category(category, limit)` | Pipeline for one category |

**CLI Usage:**
```bash
# Full crawl (all countries, all categories)
python pipeline.py --full --limit 10

# Single country
python pipeline.py --country "Philippines" --limit 5

# Single category
python pipeline.py --category "Real Estate" --limit 5
```

---

### 📄 `main_gui.py` - Desktop GUI

A **Tkinter-based** desktop application with CNN-style design.

**Class:** `HomesPhDashboard`

| Feature | Description |
|---------|-------------|
| Country Selector | Dropdown to pick target country |
| Category Selector | Dropdown to pick news category |
| Scrape Button | Starts the news crawl |
| Process Button | Runs AI processing on selected article |
| Results Table | Displays crawled articles |
| Status Bar | Shows current operation status |

**Run:**
```bash
python main_gui.py
```

---

## ⚙️ GitHub Actions Workflows

### 📄 `.github/workflows/discord-notify.yml`

**Purpose:** Sends Discord notifications when PRs are opened/closed/merged.

| Trigger | Event |
|---------|-------|
| `pull_request_target` | opened, closed, reopened, synchronize |

**Features:**
- 🎯 Detects **Affected Services**: `client`, `server`, `Script`, or `Global`
- 📊 Shows PR stats: files changed, commits, lines added/removed
- 🎨 Color-coded: Blue (opened), Green (merged), Red (closed)

**Required Secret:**
| Name | Value |
|------|-------|
| `DISCORD_PR_NOTIFICATION` | Discord Webhook URL |

---

### 📄 `.github/workflows/ci.yml`

**Purpose:** Main CI pipeline for linting, testing, and security checks.

| Job | Stack | Tools |
|-----|-------|-------|
| `typescript-ci` | NextJS/Client | npm, ESLint, Jest, npm audit |
| `laravel-ci` | Laravel/Server | Composer, Laravel Pint, PHPUnit, composer audit |
| `python-ci` | Python/Script | pip, Ruff, Pytest, Bandit |

**Current Status:** `workflow_dispatch` (manual trigger only)

---

### 📄 `.github/workflows/codeql-analysis.yml`

**Purpose:** GitHub CodeQL security scanning.

**Languages:** JavaScript/TypeScript, Python, PHP

**Current Status:** `workflow_dispatch` (manual trigger only)

---

## 🔐 Environment Variables

Create a `.env` file in the `Script/` folder:

```ini
# Google AI (Required for AI features)
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# Redis (Required for storage)
REDIS_URL=redis://localhost:6379/0
REDIS_PREFIX=homesph:

# GCP Cloud Storage (Optional - for image uploads)
GCP_BUCKET_NAME=your-bucket-name
GCP_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
```

### Where to Get These:
| Variable | Source |
|----------|--------|
| `GOOGLE_AI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `REDIS_URL` | Your Redis instance (local or cloud) |
| `GCP_SERVICE_ACCOUNT_JSON` | GCP Console → IAM → Service Accounts → Create Key |

---

## 🖥️ EC2 Server Access

### Connection Details
| Field | Value |
|-------|-------|
| **IP Address** | `54.254.199.212` |
| **Username** | `ubuntu` |
| **Key File** | `FHPHKeyPair.pem` |
| **OS** | Ubuntu 20.04 LTS |

### SSH Connection
```bash
ssh -i "FHPHKeyPair.pem" ubuntu@54.254.199.212
```

### Fix Key Permissions (Windows PowerShell)
```powershell
icacls "FHPHKeyPair.pem" /inheritance:r
icacls "FHPHKeyPair.pem" /grant:r "$($env:USERNAME):(R)"
```

### Server Paths (Suggested)
```
/home/ubuntu/HomesPhNews/
├── client/     # NextJS frontend
├── server/     # Laravel backend
└── Script/     # Python crawler
```

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/HomesPhNews.git
cd HomesPhNews
```

### 2. Setup Python Environment
```bash
cd Script
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
cp env.example .env
# Edit .env with your API keys
```

### 4. Run the GUI
```bash
python main_gui.py
```

### 5. Run the Pipeline (CLI)
```bash
python pipeline.py --country "Philippines" --limit 3
```

---

## 🛠️ Troubleshooting

### ❌ "GOOGLE_AI_API_KEY not found"
- Make sure `.env` file exists in `Script/` folder
- Check that the key is correctly formatted (no quotes needed)

### ❌ "Redis connection refused"
- Start Redis locally: `redis-server`
- Or update `REDIS_URL` in `.env` to your cloud Redis instance

### ❌ "GCP JSON Parse Error"
- Ensure `GCP_SERVICE_ACCOUNT_JSON` is valid JSON
- Try saving credentials to a `service-account.json` file instead

### ❌ "Permission denied (publickey)" on SSH
- Run the `icacls` commands to fix key permissions
- Make sure you're using `ubuntu@` not `ec2-user@`

### ❌ GitHub Workflow YAML Error
- Check for proper indentation (2 spaces, not tabs)
- Validate at: https://www.yamllint.com/

---

## 📞 Support

For issues or questions:
1. Check this documentation first
2. Review the `CICD_DOCUMENTATION.md` for CI/CD specifics
3. Open a GitHub Issue

---

**Built with ❤️ by the HomesPhNews Team**
