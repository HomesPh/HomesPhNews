# Restaurant Editor — Admin Flow Documentation

This document covers the **Admin Restaurant Editor** — the full-screen modal used to create and edit restaurant listings at `/admin/restaurant`.

---

## Overview

The restaurant editor mirrors the Articles editor in structure:
- **Left panel (600px):** Form with all restaurant fields
- **Right panel (flex):** Live preview — updates in real-time as you type
- **Header:** Save as Draft / Publish buttons

---

## Create vs Edit

Both modes use the same `RestaurantEditorModal` component.

| | Create | Edit |
|---|---|---|
| **Trigger** | "Add New Restaurant" button on `/admin/restaurant` | "Edit Details" button on `/admin/restaurant/[id]` |
| **Initial data** | All fields empty | Pre-filled from the existing restaurant record |
| **Save Draft** | Creates new restaurant with `status: draft` | Updates existing record |
| **Publish** | Creates with `status: published` | Updates + sets `status: published` |

---

## Form Fields

### Basic Info
| Field | DB Column | Notes |
|---|---|---|
| Restaurant Name | `name` | Required |
| Clickbait Hook | `clickbait_hook` | Hero title shown over the image |
| Description | `description` | Short summary |

### Featured Image
- Upload via file picker or paste a direct URL
- Also clickable in the **right-side preview panel** — hover the hero image and click "Change Image"

### Classification
| Field | DB Column | Notes |
|---|---|---|
| Cuisine Type | `cuisine_type` | Filipino, Japanese, etc. |
| Price Range | `price_range` | ₱ to ₱₱₱₱ |
| Budget Category | `budget_category` | Budget-Friendly, Mid-Range, High-End, Luxury |
| Average Meal Cost | `avg_meal_cost` | Free text, e.g. "₱500 - ₱1000 per person" |
| Rating | `rating` | 0–5 with live star display |
| Filipino Owned | `is_filipino_owned` | Boolean checkbox |

### Location & Contact
| Field | DB Column | Notes |
|---|---|---|
| Full Address | `address` | |
| City / Location | `city` / `location` | |
| Country | `country` | Dropdown |
| Google Maps URL | `google_maps_url` | Used for the embedded map |
| Contact Info | `contact_info` | Phone or email |
| Website | `website` | URL |
| Social Media | `social_media` | Facebook/Instagram URL or @handle |
| Opening Hours | `opening_hours` | Free text, multi-line |

### Details & Story
| Field | DB Column | Notes |
|---|---|---|
| Owner / Chef | `owner_info` | |
| Company | — | Client-side only (not in DB yet) |
| Specialty Dish | `specialty_dish` | |
| Menu Highlights | `menu_highlights` | Comma-separated list |
| Why Filipinos Love It | `why_filipinos_love_it` | Emotional hook copy |
| Brand Story | `brand_story` | History/background |

### More Details
Rich-text content editor (same toolbar as article body). Maps to `content` field — currently **client-side only** (not saved to DB). Will be used when the `content` column is added to the `restaurants` table.

### Food Tags
`food_topics` column. Comma-separated, e.g. `Seafood, Buffet, Date Night`.

### Publish Settings
- **Schedule for later** toggle — sets `scheduled_at` datetime (client-side only; not saved to DB until `scheduled_at` column is added)
- **Publish To** — site checkboxes (same sites as Articles). Sent as `published_sites` to the publish endpoint. Optional — you can publish without selecting sites and manage them from the detail page.

---

## Publish Flow

```
[Publish button clicked]
       ↓
[Confirmation dialog shows]
  - Lists selected sites (or "no sites selected")
  - Scheduled time if set
       ↓
[Confirm]
       ↓
  Upload image to S3 (if local file)
       ↓
  POST /api/v1/admin/restaurants  (create)
  PUT  /api/v1/admin/restaurants/{id}  (edit)
  with status: "published"
       ↓
  window.location.reload()
```

**Note:** `published_sites` is saved via the **detail page Publish widget** (`POST /api/v1/admin/restaurants/{id}/publish`), not through create/update. The detail page is the canonical place for managing which sites a restaurant is published to.

---

## DB Fields Reference

```
restaurants table columns:
id, name, country, city, cuisine_type, description, address,
latitude, longitude, google_maps_url, is_filipino_owned,
brand_story, owner_info, specialty_dish, menu_highlights,
food_topics, price_range, budget_category, avg_meal_cost,
rating, clickbait_hook, why_filipinos_love_it, contact_info,
website, social_media, opening_hours, image_url, original_url,
is_featured, status, views_count, published_sites,
timestamp, tags, features, restau_id, created_at, updated_at
```

Fields **not yet in DB** (stored client-side only):
- `company`
- `content` (More Details rich text)
- `scheduled_at`

---

## Status Values

| Status | Meaning |
|---|---|
| `draft` | Saved but not visible to public |
| `pending` | Moved from Redis to DB, pending review |
| `published` | Live and visible on the site |
| `deleted` | Soft-deleted |
| `being_processed` | Stored in Redis only (from scraper) |

---

## Preview Panel

The right panel is a **live preview** of the public-facing restaurant page. It updates as you type.

- **Hero image** — hover to see "Change Image" button; click to upload a new image directly from the preview
- Shows: badges (cuisine, Filipino-owned, rating, budget), title, description, price grid, Why Filipinos Love It, Brand Story, specialty dish, contact info

---

## Related Files

| File | Purpose |
|---|---|
| `client/app/admin/restaurant/page.tsx` | Restaurant list page |
| `client/app/admin/restaurant/[id]/page.tsx` | Restaurant detail/view page |
| `client/components/features/admin/restaurant/RestaurantEditorModal.tsx` | Main editor modal (state + save logic) |
| `client/components/features/admin/restaurant/editor/RestaurantEditorForm.tsx` | Left form panel |
| `client/components/features/admin/restaurant/editor/RestaurantEditorPreview.tsx` | Right preview panel |
| `client/lib/api-v2/admin/service/restaurant/` | API service functions |
