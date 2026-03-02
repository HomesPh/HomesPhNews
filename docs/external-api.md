# HomesPhNews — External API Documentation

This document covers the **External Content API** — a read-only API that lets partner sites embed HomesPhNews articles and restaurant listings on their own websites using an API key.

---

## Getting Started

### 1. Get Your API Key

Contact the HomesPhNews admin team to have your site registered. You will receive:

- A unique **API Key** tied to your registered site URL
- Your site must be set to **Active** status before the key works

### 2. Base URL

All external API requests go to:

```
https://api.homestv.ph/api/external
```

> For local development: `http://localhost:8000/api/external`

### 3. Authentication

Pass your API key in every request using the `X-Site-Api-Key` header:

```
X-Site-Api-Key: your-api-key-here
```

The key is the **same** for both the Articles and Restaurants endpoints.

---

## Endpoints

### Articles

Fetch the latest published articles.

```
GET /api/external/articles
```

**Request**
```bash
curl -X GET "https://api.homestv.ph/api/external/articles" \
  -H "X-Site-Api-Key: your-api-key-here" \
  -H "Accept: application/json"
```

**Response**
```json
{
  "site": {
    "name": "Your Site Name",
    "url": "https://yoursite.com",
    "description": "Your site description"
  },
  "data": {
    "data": [
      {
        "id": "abc123",
        "slug": "article-slug-here",
        "article_id": "abc123",
        "title": "Article Title",
        "summary": "Short summary of the article.",
        "content": "Full plain-text content of the article.",
        "description": "Short summary of the article.",
        "category": "Real Estate",
        "country": "Philippines",
        "location": "Philippines",
        "status": "published",
        "created_at": "2024-01-15 08:30:00",
        "date": "2024-01-15 08:30:00",
        "views_count": 1240,
        "views": "1,240 views",
        "image_url": "https://cdn.homestv.ph/images/article.jpg",
        "image": "https://cdn.homestv.ph/images/article.jpg",
        "original_url": "https://source.com/original-article",
        "source": "HomesPhNews",
        "author": "John Doe",
        "keywords": "real estate, philippines, property",
        "published_sites": ["Your Site Name"],
        "sites": ["Your Site Name"],
        "topics": ["Real Estate", "Investment"],
        "galleryImages": ["https://cdn.homestv.ph/images/gallery1.jpg"],
        "template": "",
        "content_blocks": [],
        "is_deleted": false,
        "is_redis": false
      }
    ],
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "last_page": 8,
    "from": 1,
    "to": 20
  }
}
```

---

### Restaurants

Fetch the latest published restaurant listings.

```
GET /api/external/restaurants
```

**Request**
```bash
curl -X GET "https://api.homestv.ph/api/external/restaurants" \
  -H "X-Site-Api-Key: your-api-key-here" \
  -H "Accept: application/json"
```

**Response**
```json
{
  "site": {
    "name": "Your Site Name",
    "url": "https://yoursite.com",
    "description": "Your site description"
  },
  "data": {
    "data": [
      {
        "id": "rst_abc123",
        "name": "Jollibee SM Mall of Asia",
        "country": "Philippines",
        "city": "Pasay",
        "cuisine_type": "Filipino Fast Food",
        "description": "A beloved Filipino fast food chain known for its Chickenjoy.",
        "address": "SM Mall of Asia, Pasay City, Metro Manila",
        "latitude": 14.5352,
        "longitude": 120.9820,
        "google_maps_url": "https://maps.google.com/?q=...",
        "is_filipino_owned": true,
        "brand_story": "Founded in 1978...",
        "owner_info": "Jollibee Foods Corporation",
        "specialty_dish": "Chickenjoy",
        "menu_highlights": "Chickenjoy, Jolly Spaghetti, Yum Burger",
        "food_topics": "Fast Food, Fried Chicken",
        "price_range": "₱100 - ₱400",
        "budget_category": "Budget",
        "avg_meal_cost": "₱200",
        "rating": 4.5,
        "clickbait_hook": "Why Filipinos abroad cry over this fried chicken",
        "why_filipinos_love_it": "It's a taste of home wherever you are.",
        "contact_info": "+63 2 8858 8000",
        "website": "https://www.jollibee.com.ph",
        "social_media": "@jollibee",
        "opening_hours": "Open 24 hours",
        "image_url": "https://cdn.homestv.ph/restaurants/jollibee.jpg",
        "original_url": "https://source.com/restaurant-profile",
        "status": "published",
        "timestamp": 1705305000,
        "tags": ["fast food", "chicken", "Filipino"],
        "features": ["drive-through", "delivery", "dine-in"],
        "is_featured": true,
        "views_count": 530,
        "created_at": "2024-01-15 08:30:00"
      }
    ],
    "current_page": 1,
    "per_page": 20,
    "total": 80,
    "last_page": 4,
    "from": 1,
    "to": 20
  }
}
```

---

## Pagination

Both endpoints return **20 items per page**. Use the pagination fields to navigate:

| Field | Description |
|---|---|
| `current_page` | The current page number |
| `per_page` | Number of items per page (20) |
| `total` | Total number of published items |
| `last_page` | The last available page number |
| `from` | Index of the first item on this page |
| `to` | Index of the last item on this page |

To fetch the next page, add a `?page=` query parameter:

```bash
curl "https://api.homestv.ph/api/external/articles?page=2" \
  -H "X-Site-Api-Key: your-api-key-here"

curl "https://api.homestv.ph/api/external/restaurants?page=2" \
  -H "X-Site-Api-Key: your-api-key-here"
```

---

## Error Responses

| Status | Message | Cause |
|---|---|---|
| `401` | `API Key missing` | The `X-Site-Api-Key` header was not included |
| `403` | `Invalid or Suspended API Key` | The key does not exist or the site is suspended |
| `403` | `Unauthorized Origin` | In production, the request origin doesn't match the registered site URL |

---

## Notes

- **Content is plain text** — HTML tags are stripped from article `content`, `summary`, and `description` fields in the API response. No need to sanitize on your end.
- **Same API key** — one key gives access to both `/articles` and `/restaurants`.
- **Articles are site-specific** — only articles that were explicitly published to your site will appear in the articles response.
- **Restaurants are global** — all published restaurants are returned regardless of which site is requesting.
- **Production origin check** — in production, requests must originate from your registered site URL. This is automatic if you're calling the API from your own domain.

---

## Quick Reference

| | Articles | Restaurants |
|---|---|---|
| **Endpoint** | `GET /api/external/articles` | `GET /api/external/restaurants` |
| **Auth Header** | `X-Site-Api-Key` | `X-Site-Api-Key` (same key) |
| **Pagination** | `?page=N` | `?page=N` |
| **Per page** | 20 | 20 |
| **Scope** | Your site's published articles only | All published restaurants |
