# Article Flow: Being Processed → Pending (Bulk Move to DB)

This doc captures the plan for splitting the admin article workflow into **Being Processed** (Redis only) and **Pending** (DB only), plus bulk **Move to DB** so articles can be inserted into the database in batch, then published/edited/saved as draft from the Pending list.

---

## 1. Goal

| Concept | Meaning | Where data lives | Actions |
|--------|---------|-------------------|--------|
| **Being Processed** | Scraper output, not in DB yet | Redis only | Multi-select → **Move to DB** (bulk insert as Pending) |
| **Pending** | In DB, not published | Database, `status = 'pending review'` | Publish, Edit, Save as draft |

**Flow:** Being Processed (Redis) → [Move to DB] → Pending (DB) → Publish / Edit / Save as draft.

---

## 2. Current State (Before)

- **"Pending Review" tab** uses `status=pending` and shows **Redis-only** list (`getPendingArticlesFromRedis`).
- **Count** for that tab = Redis count + DB "pending review" count combined — but the **list** is Redis only, so DB "pending review" articles never appear in that tab.
- Only way Redis → DB today: open single article → **Publish** (creates/updates in DB and sets published). No "move to DB as pending only" and no bulk action.

---

## 3. Desired State (After)

### 3.1 Tabs

- **All** – combined (DB + Redis counts; list from DB + Redis merge on page 1 as today, or adjust per product choice).
- **Published** – DB only, `status = 'published'`.
- **Being Processed** – Redis only. List from `getPendingArticlesFromRedis`. Count = Redis count.
- **Pending Review** – DB only, `status = 'pending review'`. List from DB query. Count = DB pending review count.
- **Deleted** – DB only, soft-deleted (unchanged).

### 3.2 Being Processed tab

- List: Redis-only articles (same as current "pending" list source).
- **Multi-select** + button **"Move to DB"** (or "Process").
- On action: call new API with selected IDs → backend inserts each into DB with `status = 'pending review'`, then removes from Redis (so they disappear from Being Processed and appear in Pending Review).
- Insert can be **chunked/throttled** ("mag hinayx2 nana og insert") to avoid overloading DB (e.g. 5–10 per chunk, small delay between chunks).

### 3.3 Pending Review tab

- List: DB articles where `status = 'pending review'`.
- Actions: **Publish**, **Edit**, **Save as draft** (normal update). No Redis involved.

### 3.4 Article detail page

- If `article.is_redis` → show **"Being Processed"** (in Redis only, not in DB yet). CTA: Publish (single) or user can go back and use bulk Move to DB.
- If in DB with status pending → show **"Pending"** (in DB); offer Publish / Edit / Save as draft.

---

## 4. Design Decisions

| Topic | Decision |
|-------|----------|
| **After Move to DB** | Remove article from Redis after successful insert. Being Processed = strictly "not in DB yet". |
| **Bulk insert** | One API call with multiple IDs; server does chunked insert (e.g. 5 per chunk, 100–200ms between chunks). |
| **Errors** | Best-effort: return `{ inserted: ids[], failed: [{ id, reason }] }`. UI can show "X moved, Y failed". |
| **Save as draft** | Same DB row, same status `pending review`; "draft" = just saving edits. No separate status unless we add "draft" later. |
| **Edit** | Allow edit in both Being Processed (Redis) and Pending (DB). After Move to DB, further edits go to DB row. |

---

## 5. Backend Changes

### 5.1 `ArticleController.php`

- **index()**
  - When `status === 'being_processed'` → call `getPendingArticlesFromRedis` (Redis-only list).
  - When `status === 'pending review'` → use existing DB query only (no redirect to Redis). So Pending Review tab = DB only.
  - Keep `status === 'pending'` for backward compatibility if desired (e.g. still return Redis-only list), or retire it in favor of `being_processed`.

- **getStatusCounts()**
  - Return separate counts:
    - `being_processed` = Redis count only.
    - `pending` or `pending_review` = DB "pending review" count only.
  - `all` = e.g. `dbTotal + being_processed`.

- **New endpoint: Move to DB (bulk)**
  - e.g. `POST /api/admin/articles/move-to-db`
  - Body: `{ ids: string[] }` (UUIDs of Redis articles).
  - For each ID: get from Redis → build article payload → insert into `articles` with `status = 'pending review'` (slug, required fields, etc.) → on success delete from Redis.
  - Throttle: e.g. process in chunks of 5–10, 100–200ms between chunks.
  - Response: `{ inserted: string[], failed: { id: string, reason: string }[] }`.
  - Validation: only UUIDs; optionally check article exists in Redis.

### 5.2 Request validation

- **ArticleQueryRequest.php** – allow `being_processed` (and keep `pending review`) in the `status` rule for list API.

### 5.3 Routes

- Register `POST .../articles/move-to-db` (or equivalent path) and point to the new controller method.

---

## 6. Frontend Changes

### 6.1 Tabs

- **ArticlesTabs.tsx**: Two tabs:
  - **Being Processed** → `status=being_processed`, count from `status_counts.being_processed`.
  - **Pending Review** → `status=pending review`, count from `status_counts.pending` or `status_counts.pending_review`.
- Ensure tab `id` / filter value matches backend (`being_processed` vs `pending review`).

### 6.2 Admin articles page

- **page.tsx** (and URL/filter config): support `being_processed` and `pending review`; pass through to API; use new counts for badges.
- **Being Processed tab**: add **multi-select** (checkboxes on list items) + **"Move to DB"** button. On submit: call move-to-db API with selected IDs; then refresh list and counts; show toast/summary (e.g. "X moved, Y failed" if any failed).

### 6.3 API client

- **getAdminArticles.ts**: add `being_processed` to status type; ensure `pending review` is sent as-is when that tab is active.
- **New**: e.g. `moveArticlesToDb(ids: string[])` calling `POST .../articles/move-to-db` with `{ ids }`.

### 6.4 Article detail page

- ** [id]/page.tsx**: For `article.is_redis` → change wording to **"Being Processed"** (in Redis only, not in DB yet). Keep CTA to Publish single article if desired.
- For DB article with status pending → show "Pending (in DB)" and Publish / Edit / Save as draft.

### 6.5 Types

- **ArticleResource / status_counts**: add `being_processed` in types and any dashboard/stats types that show admin counts.

---

## 7. Files to Touch (Checklist)

- [x] `server/app/Http/Controllers/Api/Admin/ArticleController.php` – index, getStatusCounts, new moveToDb
- [x] `server/app/Http/Requests/Articles/ArticleQueryRequest.php` – status validation (`being_processed`)
- [x] `server/routes/api.php` – POST `articles/move-to-db` route
- [x] `client/components/features/admin/articles/ArticlesTabs.tsx` – Being Processed + Pending Review tabs, counts
- [x] `client/app/admin/articles/page.tsx` – filters, multi-select, Move to DB button, refresh
- [x] `client/lib/api-v2/admin/service/article/getAdminArticles.ts` – status type `being_processed`
- [x] `client/lib/api-v2/admin/service/article/moveArticlesToDb.ts` – new API call
- [x] `client/app/admin/articles/[id]/page.tsx` – Being Processed wording for Redis articles
- [x] `client/components/features/admin/articles/ArticleListItem.tsx` + `BaseArticleCard.tsx` – selection/checkbox for Being Processed
- [x] `AdminArticleStatusCounts` + `StatusBadge` – `being_processed` count and badge

---

## 8. Test Plan (Quick)

1. Put a few articles in Redis (Being Processed).
2. Multi-select 2–3 → **Move to DB**. Check: they disappear from Being Processed; they appear in Pending Review.
3. Open one from Pending Review → Edit, Save as draft; then Publish. Check: it appears in Published, DB row has `status = 'published'`.
4. If move-to-db returns failed: verify UI shows "X moved, Y failed" and failed IDs still in Being Processed (or show reason).

---

## 9. References

- Current Redis list: `ArticleController::getPendingArticlesFromRedis` (status `pending`).
- Current counts: `ArticleController::getStatusCounts()` – `pending` = Redis + DB combined.
- Article resource: `ArticleResource.php` – `is_redis => !$isModel`.
- Detail copy: `client/app/admin/articles/[id]/page.tsx` – amber box for Redis (change to "Being Processed").
