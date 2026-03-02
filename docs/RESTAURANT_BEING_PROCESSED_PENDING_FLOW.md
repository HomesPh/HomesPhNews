# Restaurant Flow: Being Processed → Pending Review (same as Articles)

Restaurant admin now mirrors the article workflow: **Being Processed** (Redis only) and **Pending Review** (DB only), with bulk **Move to DB**.

## Flow

1. **Being Processed** – List from Redis (Script/Places). Multi-select → **Move to DB** → inserted into DB with `status = 'draft'`, removed from Redis.
2. **Pending Review** – List from DB where `status = 'draft'`. From here: Publish, Edit, Delete.

## Backend

- **RestaurantController::index()**: `status=being_processed` → Redis only; `status=pending_review` → DB draft only. Legacy `draft`/`pending` treated as being_processed.
- **getStatusCounts()**: `being_processed` (Redis), `pending` (DB draft), `all`, `published`, `deleted`.
- **moveToDb()**: `POST /api/admin/restaurants/move-to-db`, body `{ ids: string[] }`. Inserts each Redis restaurant into DB with `status = 'draft'`, then removes from Redis. Returns `{ inserted, failed }`.
- **show()**: Adds `is_redis: true` when returning a restaurant from Redis.

## Frontend

- **RestaurantsTabs**: All, Published, **Being Processed**, **Pending Review**, Trash. Counts from `being_processed` and `pending`.
- **Restaurant page**: URL filters (status in URL); multi-select and "Move to DB" on Being Processed tab; `moveRestaurantsToDb` API.
- **RestaurantListItem**: Optional `selection` prop; passes `is_redis` to BaseArticleCard for "Being Processed" badge.
- **Detail page**: "Being Processed" badge and amber info box when `restaurant.is_redis`.

## References

- Article flow: `docs/ARTICLE_BEING_PROCESSED_PENDING_FLOW.md`
- Redis keys: `homesph:restaurant:{id}`, `homesph:all_restaurants` (Script)
