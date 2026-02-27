# News Scraper: Redis → Database Migration

This doc describes how to **migrate the news scraper** so that on each **news trigger**, scraped articles are **inserted into the MySQL `articles` table with `status = 'pending'`** instead of being stored in Redis. Admin can then list, edit, publish, and delete them from the database.

---

## 1. Goal

| Before | After |
|--------|--------|
| Crawl → process → save to **Redis** → admin sees "Pending" from Redis → Publish copies to DB | Crawl → process → **insert directly to DB** with `status = 'pending'` → admin sees Pending from DB → Publish updates same row to `published` |

**Benefits:**

- Single source of truth for pending articles (DB).
- Easier CRUD and querying (category, country, search) on the server.
- No dependency on Redis for the pending list; Redis can still be used for dedup (URL/title hashes) during crawl.

---

## 2. Field Mapping: Script vs Server

The Script builds an `article_data` dict after AI processing. The server `articles` table (and `Article` model) expect the following. Use this map when writing the DB insert from Script.

| Script key (`article_data`) | Server `articles` column | Notes |
|-----------------------------|---------------------------|--------|
| `id` | `id` | UUID string, primary key |
| `id` | `article_id` | Same UUID (legacy compatibility) |
| `title` | `title` | |
| (optional) | `original_title` | Use raw article title or leave null |
| `summary` | `summary` | |
| `content` | `content` | |
| `image_url` | `image` | Server column is `image`, not `image_url` |
| `category` | `category` | |
| `country` | `country` | |
| `original_url` | `original_url` | |
| `keywords` | `keywords` | Stored as **JSON** in DB |
| `topics` | `topics` | Stored as **JSON** in DB |
| — | `status` | Set to **`'pending'`** |
| — | `views_count` | Set to **`0`** |
| — | `source` | Script does not set; use raw `article.get('source', 'Scraper')` when building payload |
| — | `slug` | Generate from title (e.g. slugify) |
| — | `is_deleted` | Set to **`false`** |
| — | `published_sites` | Leave null or `[]` (JSON) |
| — | `content_blocks`, `template`, `author` | Optional; can be null |

**Not stored in `articles`:** `citations` (can be omitted or folded into `content_blocks` if needed). `timestamp` from Script can be ignored for insert; use DB `created_at` / `updated_at`.

---

## 3. Blast Radius (What to Change)

### 3.1 Script (Python)

| File / area | Change |
|-------------|--------|
| **`scheduler.py`** | After building `article_data`, call a new **save-to-DB** function instead of `storage.save_article(article_data)`. Pass the raw `article` from the scraper so you can set `source`. Optionally gate with an env var (e.g. `NEWS_SAVE_TO_DB=true`) to switch between Redis and DB without code rollback. |
| **New helper** (e.g. in `storage.py` or `database.py`) | Add `save_article_to_db(article_data, source='Scraper')` that builds the row (id, article_id, title, original_title, summary, content, image, category, country, original_url, keywords, topics, status='pending', views_count=0, source, slug, is_deleted=False) and **INSERT**s into the `articles` table using the existing MySQL engine/session from `database.py`. Handle duplicate `id` (e.g. `ON DUPLICATE KEY UPDATE updated_at = NOW()` or skip if exists). |
| **`database.py`** | Already has MySQL; ensure the same `DATABASE_URL` (and DB name) as the Laravel app so Script writes to the same `articles` table. No new tables required. |
| **`cron_job.py`** (if still used) | Same as scheduler: where it calls `storage.save_article(article_data)`, switch to the new DB save and pass `source` if available. |
| **`pipeline.py`** / **`main_gui.py`** | If they call `save_article`, either point them to the new DB save or keep Redis for those code paths until you migrate them. |

### 3.2 Server (Laravel)

| File / area | Change |
|-------------|--------|
| **`ArticleController::index`** | When `status === 'pending'`: stop calling `getPendingArticlesFromRedis`. Instead, query **DB only**: e.g. `Article::where('is_deleted', false)->where('status', 'pending')->...` with the same filters (search, category, country), paginate, and return `ArticleResource::collection(...)`. |
| **`ArticleController::getStatusCounts`** | **Pending count**: use `Article::where('is_deleted', false)->where('status', 'pending')->count()`. Do **not** add Redis total to pending. Adjust `all` to include this DB pending count. |
| **`ArticleController::show`** | Already loads by `id` from DB first, then falls back to Redis. Once all new pending are in DB, pending articles will be found in DB; Redis fallback can remain for legacy data or be removed later. |
| **`ArticleController::publish`** | When the article exists in DB (e.g. `$existing`), do **not** call `$this->redisService->deleteArticle($id)` (only delete from Redis when the article was actually sourced from Redis). |
| **`ArticleController::destroy`** / **`hardDelete`** | Already handle DB first; ensure pending rows in DB are soft-deleted or hard-deleted as appropriate. No Redis delete needed for DB-origin articles. |
| **`ArticleController::updatePending`** | Change to update the **DB** row: find by `id` with `status = 'pending'`; if found, run `$article->update($validated)`; if not found, 404. Remove or repurpose Redis update logic for this endpoint. |

### 3.3 Script HTTP API (FastAPI routes)

| File / area | Change |
|-------------|--------|
| **`routes.py`** | Endpoints that read “all articles” or “by country/category” from Redis will **not** see new pending articles if you stop writing to Redis. Either treat them as legacy only, or have them call the Laravel API / same MySQL for listing. Usually the Laravel admin is the consumer, so no change is required. |

---

## 4. Implementation Order

1. **Script – DB insert**
   - Add `save_article_to_db(article_data, source='Scraper')` using the existing MySQL session in `database.py`.
   - In `scheduler.py` (and `cron_job.py` if used): when building `article_data`, add `source = article.get('source', 'Scraper')` from the scraper’s raw `article`. Optionally set `original_title`.
   - Call `save_article_to_db(article_data, source)` instead of `storage.save_article(article_data)` when DB save is enabled (e.g. when `NEWS_SAVE_TO_DB=true`).
   - Map `image_url` → `image`; ensure `keywords` and `topics` are JSON; set `status = 'pending'`, `slug` from title, `is_deleted = false`.

2. **Server – Pending from DB**
   - In `ArticleController::index`, when `status === 'pending'`: replace `getPendingArticlesFromRedis(...)` with a DB query for `status = 'pending'` with the same filters and pagination; return `ArticleResource::collection(...)`.
   - In `getStatusCounts`, set `pendingCount = Article::where('is_deleted', false)->where('status', 'pending')->count()` and use it for `pending` and `all`; do not add Redis total for pending.

3. **Server – Publish / Update / Delete**
   - In `publish`: only call `$this->redisService->deleteArticle($id)` when the article was actually loaded from Redis (e.g. when `$existing` is null and `$redisArticle` is present).
   - In `updatePending`: load the article from DB by `id` and `status = 'pending'`; if found, update in DB; otherwise 404.
   - In `destroy` / `hardDelete`: keep current logic (DB first); no Redis delete needed for DB-origin pending.

4. **Optional**
   - Env var `NEWS_SAVE_TO_DB=true` in Script to toggle “save to DB” vs “save to Redis” for a safe rollout.
   - Script’s `purge_old_articles` only affects Redis; once new articles go to DB, it just cleans old Redis data. A separate job can purge or archive old **pending** rows in DB (e.g. `status = 'pending'` and `created_at` older than X days) if desired.

---

## 5. Environment Variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `DATABASE_URL` | Script `.env` | MySQL connection string (same DB as Laravel, e.g. `mysql+pymysql://user:pass@host:3306/homestv`). |
| `NEWS_SAVE_TO_DB` | Script `.env` (optional) | If `true`, save scraped articles to DB with `status = 'pending'`; if `false` or unset, keep saving to Redis (legacy behavior). |
| `REDIS_URL` / `REDIS_PREFIX` | Script `.env` | Still used for dedup (e.g. `scraped_urls`, `title_hashes`) so the same URL/title is not processed twice. |

---

## 6. Summary

- **Same fields:** Script already has the core fields; add `source` (and optionally `original_title`) and map `image_url` → `image`, `keywords`/`topics` → JSON so the row matches the server `articles` table.
- **Blast radius:** Script = scheduler (and optional cron) + one new DB save helper; Server = index (pending), getStatusCounts, publish (no Redis delete for DB rows), updatePending (DB), and optionally show/destroy cleanup once all pending are in DB.
- **Goal:** On news trigger, the scraper inserts one row per processed article into `articles` with `status = 'pending'`. Admin sees them in the Pending tab and can publish, edit, or delete; new pending articles no longer depend on Redis.
