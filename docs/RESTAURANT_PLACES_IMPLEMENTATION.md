# Restaurant Places API Implementation Guide

Use **Google Places API** with **MySQL** countries/cities so restaurant search is per (country, city). Default: **Filipino cuisine only** (Text Search + filter). Optional: generic flow with Geocode → Nearby Search. Rich metadata is filled from Place **reviews**, **price_level** + country currency, and optional **Gemini** enrichment.

---

## 1. Prerequisites

| Requirement | Status / Action |
|-------------|------------------|
| Google API key | Use existing `GOOGLE_MAPS_API_KEY` (Maps + Places + Geocoding) |
| Places API enabled | Enable **Places API** in Google Cloud Console for this key |
| Countries/Cities source | **MySQL** (Script uses same DB as config: `countries` + `cities` tables) |
| Python | `requests` (already in Script) |
| Optional: AI enrichment | `GOOGLE_AI_API_KEY` for Gemini (description, specialty_dish, menu_highlights, hooks) |

---

## 2. Data Flow (High Level)

**When FILIPINO_ONLY=true (default):**

- **Text Search only** (no Nearby): query `"Filipino restaurant in {city}, {country}"`.
- Filter results by **name/type** (Filipino keywords + `filipino_restaurant` type).
- Quality bar: rating ≥ 4.2, user_ratings_total ≥ 50 (relaxed if none pass).
- Place Details (with **reviews**) → map to Restaurant → optional **AI enrichment** → Redis.

**When FILIPINO_ONLY=false:**

- Geocode city → **Nearby Search** (type=restaurant, radius 5km) → sort by rating.
- Fallback: **Text Search** `"restaurants in {city}, {country}"`.
- Place Details → map → optional AI enrichment → Redis.

```
Locations: MySQL (countries + cities) OR default 1 city per country (if no cities in DB)
     │
     ▼
FILIPINO_ONLY? ──Yes──► Text Search "Filipino restaurant in {city}, {country}"
     │                        │
     No                       ▼
     │                   Name/type filter → Quality bar → Place Details (incl. reviews)
     ▼                        │
Geocode → Nearby Search       │
     │                        │
     └────────────┬───────────┘
                  ▼
     Map to Restaurant (price_range, avg_meal_cost from price_level + country)
                  │
                  ▼
     Optional: Gemini enrich (description, specialty_dish, menu_highlights, clickbait_hook, why_filipinos_love_it)
                  │
                  ▼
     Save to Redis (dedup by place_id)
```

---

## 3. Where locations come from (MySQL)

The Script reads countries and cities from **MySQL** (same DB as config: `DATABASE_URL` in `.env`). It does **not** call localhost:8001.

- **Tables:** `countries` (id, name, gl, h1, ceid, is_active), `cities` (city_id, country_id, name, is_active).
- **Logic:** Query active countries and cities; for each city resolve `country_id` to country name; build list of `{ country_id, country_name, city_id, city_name }`.
- **Fallback:** If MySQL has **no cities** or is unavailable, Script uses **default city per country** (Manila, Dubai, Singapore, Riyadh, Tokyo, etc.) from config so Places still runs.

---

## 4. Google Places API (Same API Key)

Base URL: `https://maps.googleapis.com/maps/api/place`

### 4.1 Text Search (per city)

- **Endpoint:** `GET /textsearch/json`
- **Query params:** `query`, `key`, `region` (country code for bias).
- **Filipino-only query:** `"Filipino restaurant in {city_name}, {country_name}"`.
- **Generic query:** `"restaurants in {city_name}, {country_name}"`.

**Response (per result):** `place_id`, `name`, `rating`, `user_ratings_total`, `types`, `price_level` (if present), `formatted_address` (sometimes).

### 4.2 Nearby Search (when FILIPINO_ONLY=false)

- **Endpoint:** `GET /nearbysearch/json`
- **Params:** `location={lat},{lng}`, `radius=5000`, `type=restaurant`, `key`.

### 4.3 Place Details (per place_id)

- **Endpoint:** `GET /details/json`
- **Params:** `place_id`, `key`, `fields`.
- **Fields requested:** `name,rating,formatted_address,formatted_phone_number,website,opening_hours,url,types,price_level,geometry,reviews`.

**Response:** Address, phone, website, opening hours, Maps URL, **reviews** (first review used for `description` and `why_filipinos_love_it` when present).

### 4.4 Rate limiting

- Delay ~0.15 s between Places/Geocode requests to avoid rate limits.

---

## 5. Field Mapping: Places → Restaurant Model

| Source | Your model field | Notes |
|--------|------------------|--------|
| `name` | `name` | |
| `rating` | `rating` | float |
| `types` | `cuisine_type` | First relevant type or "Restaurant" |
| `price_level` (1–4) | `budget_category` | Budget / Mid-Range / Expensive / Luxury |
| `price_level` + country | `price_range` | e.g. "£10-25", "₱300-800" |
| `price_level` + country | `avg_meal_cost` | e.g. "Around £15 per person" |
| `formatted_address` | `address` | from Place Details |
| `formatted_phone_number` | `contact_info` | from Place Details |
| `url` | `google_maps_url` | from Place Details |
| `website` | `website` | from Place Details |
| `geometry.location` | `latitude`, `longitude` | from Place Details |
| **reviews[0].text** | `description` | First 400 chars (truncated) |
| **reviews[0].text** | `why_filipinos_love_it` | First 220 chars if no AI |
| location list | `country`, `city`, `country_id`, `city_id` | From (country, city) |
| **AI (Gemini)** | `description`, `specialty_dish`, `menu_highlights`, `clickbait_hook`, `why_filipinos_love_it` | When RESTAURANT_ENRICH_AI=true |

---

## 6. Filling metadata (reviews + price + AI)

- **From Place Details reviews:** First review `text` → `description` (up to 400 chars) and `why_filipinos_love_it` (up to 220 chars).
- **From price_level + country:** `price_range` and `avg_meal_cost` use country currency (e.g. GBP, PHP) and level 1–4.
- **Optional AI enrichment (Gemini):** When `RESTAURANT_ENRICH_AI=true`, for each restaurant the Script calls `ai_service.enrich_restaurant_metadata()` to generate or complement:
  - `description` (if still empty)
  - `specialty_dish`
  - `menu_highlights` (comma-separated)
  - `clickbait_hook`
  - `why_filipinos_love_it` (if still empty)

Requires `GOOGLE_AI_API_KEY`. Fields not provided by Places (e.g. `brand_story`, `owner_info`, `social_media`) remain empty unless added elsewhere.

---

## 7. Implementation Steps (Script)

1. **Fetch locations** from MySQL (or default city per country).
2. **Per location:**  
   - If **FILIPINO_ONLY:** Text Search `"Filipino restaurant in {city}, {country}"` → name/type filter → quality bar → top N.  
   - Else: Geocode → Nearby Search → fallback Text Search → top N.
3. **Place Details** for each result (with `reviews` in fields).
4. **Map** to Restaurant (reviews → description/why_filipinos; price_level + country → price_range/avg_meal_cost).
5. **Optional:** Call Gemini `enrich_restaurant_metadata` and merge into restaurant dict.
6. **Save** to Redis; deduplicate by `place_id` via set `{PREFIX}restaurant_place_ids`.

---

## 8. Environment

In `Script/.env`:

| Variable | Purpose |
|----------|---------|
| `GOOGLE_MAPS_API_KEY` | Required. Maps + Places + Geocoding. |
| `DATABASE_URL` (or DB_*) | MySQL for `countries` and `cities`. |
| `FILIPINO_ONLY` | `true` (default) or `false`. Filipino Text Search + filter vs generic Nearby/Text. |
| `FILIPINO_MIN_RATING` | Min rating for Filipino flow (default `4.2`). |
| `FILIPINO_MIN_USER_RATINGS` | Min review count (default `50`). Relaxed if no results. |
| `MAX_PLACES_FILIPINO` | Max places per city in Filipino flow (default `20`). |
| `RESTAURANT_ENRICH_AI` | `true` (default) or `false`. Gemini enrichment for description, specialty_dish, etc. |
| `GOOGLE_AI_API_KEY` | Required for AI enrichment. |

---

## 9. Cost and Quota

- Places Text Search, Nearby Search, and Place Details are billable per request.
- Geocoding is billable per request when used.
- Limit per-city results (e.g. `MAX_PLACES_FILIPINO`) to control cost.
- Handle errors: `over_quota`, `invalid_request`, `not_found`.

---

## 10. Summary Checklist

- [ ] Places API enabled for `GOOGLE_MAPS_API_KEY`
- [ ] Script fetches countries and cities from MySQL (or uses default city per country)
- [ ] **FILIPINO_ONLY:** Text Search `"Filipino restaurant in {city}, {country}"` + name/type filter + quality bar
- [ ] **Place Details** with `reviews`; map to Restaurant; fill `price_range` and `avg_meal_cost` from price_level + country
- [ ] Optional: AI enrichment for description, specialty_dish, menu_highlights, clickbait_hook, why_filipinos_love_it
- [ ] Deduplicate by `place_id`; save to Redis

---

## 11. Implementation (Done)

- **`Script/places_client.py`**
  - **Locations:** MySQL; if 0 cities, **default city per country** (Manila, Dubai, Singapore, etc.).
  - **FILIPINO_ONLY (default true):** Text Search only: `"Filipino restaurant in {city}, {country}"`. Name/type filter (Filipino keywords + `filipino_restaurant`). Quality bar (rating ≥ 4.2, reviews ≥ 50; relaxed if none). Saves with `is_filipino_owned=True`.
  - **FILIPINO_ONLY=false:** Geocode → Nearby Search (5km, type=restaurant) → fallback Text Search.
  - **Place Details:** Includes `reviews`; first review → `description` and `why_filipinos_love_it`; `price_level` + country → `price_range` and `avg_meal_cost`.
  - **AI enrichment:** When `RESTAURANT_ENRICH_AI=true`, calls `ai_service.enrich_restaurant_metadata()` to fill or complement description, specialty_dish, menu_highlights, clickbait_hook, why_filipinos_love_it.
- **`Script/ai_service.py`**
  - **`enrich_restaurant_metadata()`** – Gemini generates short description, specialty_dish, menu_highlights, clickbait_hook, why_filipinos_love_it from name, cuisine_type, city, country, rating, address.
- **`Script/scheduler.py`**
  - `process_single_restaurant_location(loc)` runs Places for one (country, city), dedupes by `place_id` (`{PREFIX}restaurant_place_ids`), saves to Redis.
  - `run_restaurant_job()` calls `fetch_locations()`; if locations exist, runs Places per location; else falls back to news-based `process_single_restaurant_country`.
