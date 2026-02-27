# 🍴 HomesPH Restaurant Discovery Engine

The Restaurant Discovery Engine is a specialized scraper designed to find REAL local Filipino restaurants worldwide. Unlike the general news scraper, this engine converts news articles into structured **Restaurant Profiles** for a directory-style user experience.

## 🚀 Key Features

*   **AI-Powered Extraction**: Uses Gemini-2.0-Flash to identify real restaurant names, addresses, and details from within news articles.
*   **Geocoding Integration**: Connects to the **Google Maps Geocoding API** to convert street addresses into precise latitude/longitude coordinates.
*   **Filipino-Owned Focus**: Automatically identifies if a business is Filipino-owned or themed.
*   **Engagement Engine**: Generates clickbait-style hooks and "Why Filipinos Love It" descriptions to drive user interest.
*   **Smart Filtering**: Automatically blacklists major generic chains (like Jollibee/Max's) unless they have specific new local information, focusing instead on **Hidden Gems**.

## 📊 Data Model (Restaurant Profile)

Each restaurant entry contains:
- **Core Info**: Name, City, Country, Cuisine Type.
- **Location**: Full Street Address, Coordinates (Lat/Lng), Google Maps URL.
- **Business Details**: Brand Story, Owner Info, Filipino-Owned status.
- **Menu Highlights**: Specialty Dish, Menu Items, Food Topics (Pork-based, Halal-friendly, etc.).
- **Pricing**: Price Range (₱-₱₱₱₱), Budget Category, Average Cost.
- **Engagement**: Rating, Clickbait Hook, Engagement Story.

## 🛠 Technical Implementation

### 1. Scraper Pipeline
1.  **Search**: Queries are generated for specific countries and categories (e.g., "new casual Filipino restaurant Singapore 2026").
2.  **Crawl**: Fetches articles from Google News RSS.
3.  **AI Extraction**: `AIProcessor` extracts structured JSON from the article content.
4.  **Geocoding**: `RestaurantScraper` calls Google Maps API to get coordinates.
5.  **Image Generation**: Generates a high-quality, appetising photo based on the cuisine.
6.  **Storage**: Saved to Redis with the prefix `homesph:restaurant:{id}`.

### 2. Storage & API
- **Redis**: Primary data store for fast retrieval.
- **Backend (Laravel)**: Provides API endpoints to serve the data to the Next.js frontend.
- **Next.js**: Admin dashboard for management and public-facing dining directory.

## 📡 API Endpoints (Python Service)

- `POST /trigger/restaurants`: Manually trigger the restaurant scraper.
- `GET /restaurants/stats`: View count of restaurants per country.
- `POST /restaurants/clear-all`: Wipe all restaurant data (used for maintenance).

## 🌍 Supported Countries
Includes Singapore, Philippines, UAE, Saudi Arabia, Hong Kong, Qatar, Kuwait, Taiwan, Canada, USA, UK, Italy, South Korea, and more.