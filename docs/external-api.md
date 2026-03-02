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
https://homesphnews-api-394504332858.asia-southeast1.run.app/api/external
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
curl -X GET "https://homesphnews-api-394504332858.asia-southeast1.run.app/api/external/articles" \
  -H "X-Site-Api-Key: your-api-key-here" \
  -H "Accept: application/json"
```

**Response**
```json
{
  "site": {
    "name": "Example Partner Site",
    "url": "https://example.com",
    "description": "Sample site description"
  },
  "data": {
    "data": [
      {
        "id": "art_sample_001",
        "slug": "sample-article-slug",
        "article_id": "art_sample_001",
        "title": "Sample Article Title",
        "summary": "Short summary of the article.",
        "content": "Full plain-text content of the article.",
        "description": "Short summary of the article.",
        "category": "Sample Category",
        "country": "Philippines",
        "location": "Sample Location",
        "status": "published",
        "created_at": "2024-01-15 08:30:00",
        "date": "2024-01-15 08:30:00",
        "views_count": 100,
        "views": "100 views",
        "image_url": "https://example.com/images/sample-article.jpg",
        "image": "https://example.com/images/sample-article.jpg",
        "original_url": "https://example.com/source-article",
        "source": "HomesPhNews",
        "author": "Sample Author",
        "keywords": "sample, keywords",
        "published_sites": ["Example Partner Site"],
        "sites": ["Example Partner Site"],
        "topics": ["Topic A", "Topic B"],
        "galleryImages": ["https://example.com/images/gallery1.jpg"],
        "template": "",
        "content_blocks": [],
        "is_deleted": false,
        "is_redis": false
      }
    ],
    "current_page": 1,
    "per_page": 20,
    "total": 100,
    "last_page": 5,
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
curl -X GET "https://homesphnews-api-394504332858.asia-southeast1.run.app/api/external/restaurants" \
  -H "X-Site-Api-Key: your-api-key-here" \
  -H "Accept: application/json"
```

**Response**
```json
{
  "site": {
    "name": "Example Partner Site",
    "url": "https://example.com",
    "description": "Sample site description"
  },
  "data": {
    "data": [
      {
        "id": "rst_sample_001",
        "name": "Sample Restaurant Name",
        "country": "Philippines",
        "city": "Sample City",
        "cuisine_type": "Sample Cuisine",
        "description": "Sample restaurant description.",
        "address": "Sample Street, Sample City",
        "latitude": 14.5,
        "longitude": 121.0,
        "google_maps_url": "https://maps.google.com/?q=...",
        "is_filipino_owned": true,
        "brand_story": "Sample brand story.",
        "owner_info": "Sample Owner",
        "specialty_dish": "Sample Dish",
        "menu_highlights": "Dish A, Dish B, Dish C",
        "food_topics": "Sample Topic",
        "price_range": "₱100 - ₱400",
        "budget_category": "Budget",
        "avg_meal_cost": "₱200",
        "rating": 4.0,
        "clickbait_hook": "Sample hook text.",
        "why_filipinos_love_it": "Sample description.",
        "contact_info": "+63 2 0000 0000",
        "website": "https://example.com/restaurant",
        "social_media": "@samplerestaurant",
        "opening_hours": "9:00 AM - 9:00 PM",
        "image_url": "https://example.com/images/sample-restaurant.jpg",
        "original_url": "https://example.com/source",
        "status": "published",
        "timestamp": 1705305000,
        "tags": ["tag1", "tag2", "tag3"],
        "features": ["feature-a", "feature-b"],
        "is_featured": true,
        "views_count": 50,
        "created_at": "2024-01-15 08:30:00"
      }
    ],
    "current_page": 1,
    "per_page": 20,
    "total": 50,
    "last_page": 3,
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
curl "https://homesphnews-api-394504332858.asia-southeast1.run.app/api/external/articles?page=2" \
  -H "X-Site-Api-Key: your-api-key-here"

curl "https://homesphnews-api-394504332858.asia-southeast1.run.app/api/external/restaurants?page=2" \
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
