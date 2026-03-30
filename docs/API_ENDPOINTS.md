# HomesPhNews API Endpoints Documentation

> **Framework**: Laravel (PHP) + Next.js (Client)
> **Production Base URL**: `https://homesphnews-api-394504332858.asia-southeast1.run.app/api`
> **Local Base URL**: `http://127.0.0.1:8000/api`
> **HTTP Client**: Axios (with Bearer token interceptor)
> **Last updated**: 2026-03-24

---

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Middleware Reference](#middleware-reference)
3. [External Site Routes](#external-site-routes)
4. [System Health Routes](#system-health-routes)
5. [Public Routes](#public-routes)
   - [Articles](#public-articles)
   - [Restaurants](#public-restaurants)
   - [Ads](#public-ads)
   - [Categories & Countries](#public-categories--countries)
   - [Subscriptions](#public-subscriptions)
   - [Upload Proxy](#upload-proxy)
6. [Authentication Routes](#authentication-routes)
7. [Authenticated User Routes](#authenticated-user-routes)
8. [Subscriber Routes](#subscriber-routes)
9. [Admin Routes (v1)](#admin-routes-v1)
   - [Dashboard & Analytics](#dashboard--analytics)
   - [Articles (Admin)](#articles-admin)
   - [Restaurants (Admin)](#restaurants-admin)
   - [Sites](#sites)
   - [Ad Campaigns & Units](#ad-campaigns--units)
   - [Mailing List & Newsletter](#mailing-list--newsletter)
   - [Article Publications & Events](#article-publications--events)
   - [Categories (Admin)](#categories-admin)
   - [Countries (Admin)](#countries-admin)
   - [Provinces](#provinces)
   - [Cities](#cities)
   - [Generation (AI)](#generation-ai)
   - [Upload (Admin)](#upload-admin)
10. [V2 Admin Routes](#v2-admin-routes)
    - [Users (V2)](#users-v2)
    - [Roles (V2)](#roles-v2)
11. [External Service Calls](#external-service-calls)
    - [AI / News Scraper Service](#ai--news-scraper-service)
    - [Restaurant Scraper Service](#restaurant-scraper-service)
    - [Third-Party APIs](#third-party-apis)
12. [Web Routes](#web-routes)

---

## Base Configuration

| Config | Value |
|---|---|
| Production API Base URL | `https://homesphnews-api-394504332858.asia-southeast1.run.app/api` |
| Local API Base URL | `http://127.0.0.1:8000/api` |
| Env Var | `process.env.NEXT_PUBLIC_API_URL` |
| AI Service URL | `process.env.NEXT_PUBLIC_AI_SERVICE_URL` (default: `http://localhost:8001`) |
| Restaurant Scraper URL | `process.env.NEXT_PUBLIC_RESTAURANTS_SERVICE_URL` (default: `http://localhost:8012`) |
| Auth Header | `Authorization: Bearer {access_token}` |
| Token Storage | `localStorage` (`access_token`, `token`) |

Client API layer: [client/lib/api-v2/](../client/lib/api-v2/)

---

## Middleware Reference

| Middleware | Description |
|---|---|
| `site.auth` | Validates API key for external site integrations |
| `auth:sanctum` | Requires a valid Sanctum Bearer token |
| `is.verified` | Requires the authenticated user to be verified |
| `is.authenticated:admin` | Restricts to `admin` role |
| `is.authenticated:admin,ceo` | Restricts to `admin` or `ceo` roles |
| `is.authenticated:admin,editor` | Restricts to `admin` or `editor` roles |
| `is.authenticated:admin,ceo,editor` | Restricts to `admin`, `ceo`, or `editor` roles |
| `throttle:login` | Rate limiting on login attempts |

---

## External Site Routes

**Prefix**: `/api/external` | **Middleware**: `site.auth`

> Partner sites integrate via API key. The `site.auth` middleware reads the `X-Site-Key` header to identify the requesting site.

| Method | Endpoint | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|
| `GET` | `/api/external/articles` | Pull published articles into partner site | `category` (string), `country` (string), `province` (string, exact name), `city` (string, exact name), `per_page`, `page`, `limit`, `offset` | Integration demo in [client/app/admin/sites/integration/page.tsx](../client/app/admin/sites/integration/page.tsx) | Inline fetch with `X-Site-Key` or `X-Site-Api-Key` |
| `GET` | `/api/external/restaurants` | Pull published restaurants into partner site | `country`, `city`, `per_page`, `page`, `limit`, `offset` | — | — |

> **Note on Article Response Transformation**:
> - Includes `published_at` (formatted string) as the primary timestamp.
> - **Hidden Fields (Public/Partner Consumption)**: `created_at`, `date`, `source`, `original_url`, `is_deleted`, `is_redis`, and `image` are automatically removed for all non-admin requests to provide a clean, content-focused payload. `published_at` and `image_url` remain available for public use.


| `POST` | `/api/external/subscribe` | Register user subscription from partner site widget | `email`, `categories[]`, `countries[]`, `company_name`, `features`, `time`, `logo` | [client/app/admin/sites/integration/page.tsx:72](../client/app/admin/sites/integration/page.tsx) | Inline axios POST |

---

## System Health Routes

**Prefix**: `/api/v1`

> DevOps/monitoring — verify backing service connectivity.

| Method | Endpoint | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|
| `GET` | `/api/v1/redis-test` | Check Redis connection | — | Not called from client | — |
| `GET` | `/api/v1/db-test` | Check DB connection | — | Not called from client | — |
| `GET` | `/api/v1/scheduler/run` | Manually trigger Laravel scheduler | — | Not called from client | — |

---

## Public Routes

### Public Articles

> No auth required. Used by the public-facing site and sitemap generation.

| Method | Endpoint | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|
| `GET` | `/api/v1/articles` | List/search published articles | `search`/`q`, `country`, `province`, `city`, `category`, `topic`, `per_page`, `page`, `sort_by`, `sort_direction`, `start_date`, `end_date` | [client/lib/api-v2/public/services/article/getArticlesList.ts:41](../client/lib/api-v2/public/services/article/getArticlesList.ts) | `getArticlesList(params?)` |
| `GET` | `/api/v1/article` | Alias — backward compat | Same as above | Same file | Same function |
| `GET` | `/api/v1/articles/feed` | Homepage curated feed (trending, most-read, latest, counts) | `country`, `province`, `city`, `category` | [client/lib/api-v2/public/services/article/getArticlesFeed.ts:34](../client/lib/api-v2/public/services/article/getArticlesFeed.ts) | `getArticlesFeed(params?)` |
| `GET` | `/api/v1/articles/{id}` | Fetch single article detail | `id` (path) | [client/lib/api-v2/public/services/article/getArticleById.ts:121](../client/lib/api-v2/public/services/article/getArticleById.ts) | `getArticleById(id)` |
| `POST` | `/api/v1/articles/{id}/view` | Increment article view count on page load | `id` (path) | [client/lib/api-v2/public/services/article/incrementArticleViews.ts:7](../client/lib/api-v2/public/services/article/incrementArticleViews.ts) | `incrementArticleViews(id)` |
| `GET` | `/api/v1/stats` | Fetch Redis-cached total stats (articles, countries, categories) | — | [client/lib/api-v2/public/services/article/getStats.ts:17](../client/lib/api-v2/public/services/article/getStats.ts) | `getStats()` |

**Also used by sitemap:**
- [client/app/sitemap.ts:15](../client/app/sitemap.ts) — native `fetch` calls `/v1/articles?per_page=...&status=published` server-side to generate `sitemap.xml`

---

### Public Restaurants

| Method | Endpoint | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|
| `GET` | `/api/v1/restaurants` | List/search published restaurants | `limit`/`per_page`, `page`, `topic`, `country`, `city`, `category`, `search` | [client/lib/api-v2/public/services/restaurant/getRestaurants.ts:26](../client/lib/api-v2/public/services/restaurant/getRestaurants.ts) | `getRestaurants(params?)` |
| `GET` | `/api/v1/restaurants/{id}` | Fetch single restaurant detail | `id` (path) | [client/lib/api-v2/public/services/restaurant/getRestaurantById.ts](../client/lib/api-v2/public/services/restaurant/getRestaurantById.ts) | `getRestaurantById(id)` |
| `GET` | `/api/v1/restaurants/country/{country}` | Restaurants by country (max 20) | `country` (path) | Not directly called from client | — |

---

### Public Ads

| Method | Endpoint | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|
| `GET` | `/api/v1/ads` | List all active ad campaigns | — | Not directly called from client | — |
| `GET` | `/api/v1/ads/{name}` | Fetch campaign by name for ad placements | `name` (path) | [client/lib/api-v2/public/services/ads/getAdsByCampaign.ts:5](../client/lib/api-v2/public/services/ads/getAdsByCampaign.ts) | `getAdsByCampaign(campaign)` |
| `POST` | `/api/v1/ads/metrics` | Record impression/click from frontend | Ad metric payload | [client/lib/api-v2/admin/service/ads/getAdMetrics.ts](../client/lib/api-v2/admin/service/ads/getAdMetrics.ts) | `getAdMetrics()` |

---

### Public Categories & Countries

| Method | Endpoint | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|
| `GET` | `/api/v1/categories` | Populate filter dropdowns on public site | — | [client/lib/api-v2/public/services/metadata/getCategories.ts:5](../client/lib/api-v2/public/services/metadata/getCategories.ts) | `getPublicCategories()` |
| `GET` | `/api/v1/countries` | Populate country filters on public site | — | [client/lib/api-v2/public/services/metadata/getCountries.ts:5](../client/lib/api-v2/public/services/metadata/getCountries.ts) | `getPublicCountries()` |

---

### Public Subscriptions

| Method | Endpoint | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|
| `POST` | `/api/v1/subscribe` | Subscribe to newsletter from public site | `email`, `categories[]`, `countries[]`, `company_name`, `features`, `time`, `logo` | [client/lib/api-v2/public/services/subscription/index.ts](../client/lib/api-v2/public/services/subscription/index.ts) | `createSubscription(data)` |
| `GET` | `/api/v1/subscribe/{id}` | Load subscription preferences (from email link) | `id` (path, UUID) | [client/lib/api-v2/public/services/subscription/index.ts:31](../client/lib/api-v2/public/services/subscription/index.ts) | `getSubscriptionById(id)` |
| `PATCH` | `/api/v1/subscribe/{id}` | Update subscription preferences | `id` (path), `categories[]`, `countries[]`, `features`, `time` | [client/lib/api-v2/public/services/subscription/index.ts:42](../client/lib/api-v2/public/services/subscription/index.ts) | `updateSubscription(id, data)` |

---

### Upload Proxy

| Method | Endpoint | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|
| `GET` | `/api/v1/upload/proxy` | Proxy external image URLs to bypass CORS in editor | `url` (query) | Used inline in article editor | Direct URL construction |

---

## Authentication Routes

| Method | Endpoint | Middleware | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/login` | `throttle:login` | Login with email + password | `email`, `password` | [client/lib/api-v2/admin/service/auth/login.ts:19](../client/lib/api-v2/admin/service/auth/login.ts) | `login(body)` |
| `POST` | `/api/v1/auth/register` | — | Register new user account | `email`, `password`, `first_name`, `last_name` | [client/lib/api-v2/admin/service/auth/register.ts:29](../client/lib/api-v2/admin/service/auth/register.ts) | `register(body)` |
| `GET` | `/api/v1/auth/google/redirect` | — | Start Google OAuth flow | — | Browser redirect | — |
| `GET` | `/api/v1/auth/google/callback` | — | Handle Google OAuth callback, issue token | `code`, `state` (query) | Server-side callback | — |

> Login page also calls `/api/v2/public/user-info?email={email}` (native fetch) to pre-fill user data: [client/components/features/admin/login/SignInForm.tsx:73](../client/components/features/admin/login/SignInForm.tsx)

---

## Authenticated User Routes

**Middleware**: `auth:sanctum`

| Method | Endpoint | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|
| `GET` | `/api/v1/user` | Fetch current user profile | — | [client/lib/api-v2/admin/service/auth/user.ts:16](../client/lib/api-v2/admin/service/auth/user.ts) | `getUser()` — also via `useAuth()` hook in [client/hooks/useAuth.ts](../client/hooks/useAuth.ts) |
| `GET` | `/api/v1/login` | Legacy alias for current user info | — | Same as above | Same |
| `PATCH` | `/api/v1/user/profile` | Update name and avatar | `first_name`, `last_name`, `avatar` (base64) | [client/lib/api-v2/admin/service/auth/updateProfile.ts:23](../client/lib/api-v2/admin/service/auth/updateProfile.ts) | `updateProfile(payload)` |
| `PATCH` | `/api/v1/user/password` | Change password | `current_password`, `new_password`, `new_password_confirmation` | [client/lib/api-v2/admin/service/auth/changePassword.ts:22](../client/lib/api-v2/admin/service/auth/changePassword.ts) | `changePassword(payload)` |
| `POST` | `/api/v1/logout` | Revoke token + clear localStorage | — | [client/lib/api-v2/admin/service/auth/logout.ts:16](../client/lib/api-v2/admin/service/auth/logout.ts) | `logout()` |
| `POST` | `/api/v1/plans/subscribe` | Subscribe user to a paid plan | `email`, `plan_name`, `price`, `company_name`, `categories[]`, `countries[]`, `logo` | Not directly found in client | — |
| `POST` | `/api/v1/otp/email/send` | Send OTP to email for verification | `email` | [client/lib/api-v2/admin/service/auth/sendEmailOTP.ts:21](../client/lib/api-v2/admin/service/auth/sendEmailOTP.ts) | `sendEmailOTP(body)` |
| `POST` | `/api/v1/otp/email/verify` | Verify submitted OTP | `email`, `otp` | [client/lib/api-v2/admin/service/auth/verifyOTP.ts:25](../client/lib/api-v2/admin/service/auth/verifyOTP.ts) | `verifyOTP(body)` |

---

## Subscriber Routes

**Middleware**: `auth:sanctum`, `is.verified`

| Method | Endpoint | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|
| `GET` | `/api/v1/subscriber/articles` | Fetch articles scoped to subscriber's allowed categories/countries | `search`/`q`, `category`, `country`, `per_page`, `page`, `allowed_categories[]`, `allowed_countries[]` | Not directly found — expected in subscriber portal | — |
| `GET` | `/api/v1/subscriber/articles/{id}` | Fetch single article (ID or slug) within subscriber scope | `id` (path) | Not directly found — expected in subscriber portal | — |

---

## Admin Routes (v1)

**Prefix**: `/api/v1/admin` | **Base Middleware**: `auth:sanctum`, `is.authenticated:admin,ceo,editor`

---

### Dashboard & Analytics

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/stats` | `admin` | Dashboard KPIs: totals, recent articles | — | [client/lib/api-v2/admin/service/dashboard/getAdminStats.ts:33](../client/lib/api-v2/admin/service/dashboard/getAdminStats.ts) | `getAdminStats()` |
| `GET` | `/api/v1/admin/analytics` | `admin` | Article analytics (views, engagement) | `period` (today, yesterday, 7days, 30days, custom), `category`, `country`, `start_date`, `end_date` | [client/lib/api-v2/admin/service/analytics/getAdminAnalytics.ts:81](../client/lib/api-v2/admin/service/analytics/getAdminAnalytics.ts) | `getAdminAnalytics(params?)` |
| `GET` | `/api/v1/admin/analytics/mailing-list` | `admin,ceo,editor` | Newsletter performance stats | `period`, `category`, `country`, `start_date`, `end_date` | [client/lib/api-v2/admin/service/analytics/getMailingListStats.ts](../client/lib/api-v2/admin/service/analytics/getMailingListStats.ts) | `getMailingListStats()` |

---

### Articles (Admin)

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/articles` | `admin,ceo,editor` | List articles with advanced filters | `status` (published, pending review, being_processed, edited, rejected, deleted, all), `search`/`q`, `country`, `province_id`, `city_id`, `category`, `per_page`/`limit`, `page`/`offset`, `sort_by` (created_at, views_count, title, timestamp, published_at), `sort_direction`, `start_date`, `end_date`, `editor_id` | [client/lib/api-v2/admin/service/article/getAdminArticles.ts:92](../client/lib/api-v2/admin/service/article/getAdminArticles.ts) | `getAdminArticles(params?)` |
| `POST` | `/api/v1/admin/articles` | `admin,editor` | Create new article | `title`, `summary`, `content_blocks` (JSON), `image`/`image_url`, `category`, `country`, `province_id`, `city_id`, `topics[]`, `published_sites[]`, `status`, `template`, `author`, `slug`, `original_url` | [client/lib/api-v2/admin/service/article/createArticle.ts:37](../client/lib/api-v2/admin/service/article/createArticle.ts) | `createArticle(body)` |
| `GET` | `/api/v1/admin/articles/{id}` | `admin,ceo,editor` | Fetch single article | `id` (path) | [client/lib/api-v2/admin/service/article/getAdminArticleById.ts:18](../client/lib/api-v2/admin/service/article/getAdminArticleById.ts) | `getAdminArticleById(id)` |
| `PUT/PATCH` | `/api/v1/admin/articles/{id}` | `admin,ceo,editor` | Update article fields | `id` (path), article fields (same as POST) | [client/lib/api-v2/admin/service/article/updateArticle.ts:43](../client/lib/api-v2/admin/service/article/updateArticle.ts) | `updateArticle(articleId, body)` |
| `PATCH` | `/api/v1/admin/articles/{id}/titles` | `admin,editor` | Update only title + summary | `id` (path), `title`, `summary` | [client/lib/api-v2/index.ts:34](../client/lib/api-v2/index.ts) | `updateArticleTitles()` |
| `PATCH` | `/api/v1/admin/articles/{id}/pending` | `admin,editor` | Update a pending (Redis) article | `id` (path), article fields | [client/lib/api-v2/index.ts](../client/lib/api-v2/index.ts) | `updatePendingArticle()` |
| `DELETE` | `/api/v1/admin/articles/{id}` | `admin` | Soft-delete article | `id` (path) | [client/lib/api-v2/admin/service/article/deleteArticle.ts:19](../client/lib/api-v2/admin/service/article/deleteArticle.ts) | `deleteArticle(id)` |
| `DELETE` | `/api/v1/admin/articles/{id}/hard-delete` | `admin` | Permanently delete article | `id` (path) | [client/lib/api-v2/index.ts](../client/lib/api-v2/index.ts) | `hardDeleteArticle()` |
| `POST` | `/api/v1/admin/articles/{id}/restore` | `admin` | Restore soft-deleted article | `id` (path) | [client/lib/api-v2/admin/service/article/restoreArticle.ts:11](../client/lib/api-v2/admin/service/article/restoreArticle.ts) | `restoreArticle(id)` |
| `POST` | `/api/v1/admin/articles/{id}/publish` | `admin,ceo` | Publish a pending article (supports Atomic Publish) | `id` (path), `published_sites`, and any article fields for final update | [client/lib/api-v2/admin/service/article/publishArticle.ts:43](../client/lib/api-v2/admin/service/article/publishArticle.ts) | `publishArticle(id, body)` |
| `POST` | `/api/v1/admin/articles/{id}/send-newsletter` | `admin,editor` | Send article to newsletter subscribers | `id` (path), `subscriberIds?` | [client/lib/api-v2/admin/service/article/sendNewsletter.ts:10](../client/lib/api-v2/admin/service/article/sendNewsletter.ts) | `sendNewsletter(id, subscriberIds?)` |
| `POST` | `/api/v1/admin/articles/move-to-db` | `admin,editor` | Move Redis-queued articles to DB as 'pending review' | `article_ids[]` | [client/lib/api-v2/admin/service/article/moveArticlesToDb.ts:19](../client/lib/api-v2/admin/service/article/moveArticlesToDb.ts) | `moveArticlesToDb(ids)` |
| `POST` | `/api/v1/admin/articles/bulk-publish` | `admin,ceo` | Publish multiple articles | `article_ids[]`, `published_sites` | [client/lib/api-v2/admin/service/article/bulkPublishArticles.ts:10](../client/lib/api-v2/admin/service/article/bulkPublishArticles.ts) | `bulkPublishArticles(ids, published_sites)` |
| `POST` | `/api/v1/admin/articles/bulk-unpublish` | `admin,ceo` | Unpublish multiple articles (status -> draft) | `article_ids[]` | [client/lib/api-v2/admin/service/article/bulkUnpublishArticles.ts:8](../client/lib/api-v2/admin/service/article/bulkUnpublishArticles.ts) | `bulkUnpublishArticles(ids)` |
| `POST` | `/api/v1/admin/articles/bulk-reject` | `admin,ceo` | Reject multiple articles | `article_ids[]` | [client/lib/api-v2/admin/service/article/bulkRejectArticles.ts:9](../client/lib/api-v2/admin/service/article/bulkRejectArticles.ts) | `bulkRejectArticles(ids)` |
| `POST` | `/api/v1/admin/articles/bulk-delete` | `admin,ceo` | Delete multiple articles | `article_ids[]`, `hard_delete` (boolean) | [client/lib/api-v2/admin/service/article/bulkDeleteArticles.ts:10](../client/lib/api-v2/admin/service/article/bulkDeleteArticles.ts) | `bulkDeleteArticles(ids, hard_delete)` |
| `POST` | `/api/v1/admin/articles/bulk-send-newsletter` | `admin,ceo,editor` | Send multiple articles to mailing list | `article_ids[]`, `mailing_list_id` | [client/lib/api-v2/index.ts](../client/lib/api-v2/index.ts) | `bulkSendNewsletter()` |
| `GET` | `/api/v1/admin/subscribers` | `admin,ceo,editor` | List all newsletter subscribers | — | [client/lib/api-v2/index.ts](../client/lib/api-v2/index.ts) | `getSubscribers()` |

---

### Restaurants (Admin)

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/restaurants` | `admin` | List restaurants merging Redis/DB | `per_page`/`limit`, `page`, `status` (published, draft, pending_review, being_processed, all), `search`, `country`, `city`, `category` | [client/lib/api-v2/admin/service/restaurant/getAdminRestaurants.ts:19](../client/lib/api-v2/admin/service/restaurant/getAdminRestaurants.ts) | `getAdminRestaurants(params?)` |
| `POST` | `/api/v1/admin/restaurants` | `admin` | Create new restaurant | `name`, `description`, `image_url`, `country`, `city`, `cuisine_type`, `price_range`, `address`, `rating`, `status`, `published_sites`, `is_featured`, `is_filipino_owned`, `tags[]`, `features[]` | [client/lib/api-v2/admin/service/restaurant/createRestaurant.ts:49](../client/lib/api-v2/admin/service/restaurant/createRestaurant.ts) | `createRestaurant(body)` |
| `GET` | `/api/v1/admin/restaurants/stats` | `admin` | Restaurant stats overview | — | [client/lib/api-v2/admin/service/restaurant/getAdminRestaurantStats.ts](../client/lib/api-v2/admin/service/restaurant/getAdminRestaurantStats.ts) | `getAdminRestaurantStats()` |
| `GET` | `/api/v1/admin/restaurants/country/{country}` | `admin` | Restaurants by country | `country` (path) | Not directly found in client | — |
| `GET` | `/api/v1/admin/restaurants/{id}` | `admin` | Fetch single restaurant (Redis/DB) | `id` (path) | [client/lib/api-v2/admin/service/restaurant/getAdminRestaurantById.ts](../client/lib/api-v2/admin/service/restaurant/getAdminRestaurantById.ts) | `getAdminRestaurantById(id)` |
| `PUT` | `/api/v1/admin/restaurants/{id}` | `admin` | Update restaurant (triggers publish if status=published) | `id` (path), restaurant fields | [client/lib/api-v2/admin/service/restaurant/updateRestaurant.ts:51](../client/lib/api-v2/admin/service/restaurant/updateRestaurant.ts) | `updateRestaurant(id, body)` |
| `DELETE` | `/api/v1/admin/restaurants/{id}` | `admin` | Delete restaurant | `id` (path) | [client/lib/api-v2/admin/service/restaurant/deleteAdminRestaurant.ts](../client/lib/api-v2/admin/service/restaurant/deleteAdminRestaurant.ts) | `deleteAdminRestaurant(id)` |
| `POST` | `/api/v1/admin/restaurants/{id}/publish` | `admin,ceo` | Publish single restaurant from Redis to DB | `id` (path), `published_sites`, and any additional fields | [client/lib/api-v2/admin/service/restaurant/publishRestaurant.ts:15](../client/lib/api-v2/admin/service/restaurant/publishRestaurant.ts) | `publishRestaurant(id, body?)` |
| `POST` | `/api/v1/admin/restaurants/{id}/restore` | `admin` | Restore deleted restaurant | `id` (path) | [client/lib/api-v2/admin/service/restaurant/restoreRestaurant.ts](../client/lib/api-v2/admin/service/restaurant/restoreRestaurant.ts) | `restoreRestaurant(id)` |
| `POST` | `/api/v1/admin/restaurants/move-to-db` | `admin` | Move Redis-queued restaurants to DB as 'draft' | `ids[]` | [client/lib/api-v2/admin/service/restaurant/moveRestaurantsToDb.ts](../client/lib/api-v2/admin/service/restaurant/moveRestaurantsToDb.ts) | `moveRestaurantsToDb(ids)` |
| `POST` | `/api/v1/admin/restaurants/bulk-publish` | `admin` | Publish multiple restaurants | `ids[]`, `published_sites` | [client/lib/api-v2/admin/service/restaurant/bulkPublishRestaurants.ts](../client/lib/api-v2/admin/service/restaurant/bulkPublishRestaurants.ts) | `bulkPublishRestaurants(ids)` |
| `POST` | `/api/v1/admin/restaurants/bulk-unpublish` | `admin` | Unpublish multiple restaurants (status -> draft) | `ids[]` | [client/lib/api-v2/admin/service/restaurant/bulkUnpublishRestaurants.ts](../client/lib/api-v2/admin/service/restaurant/bulkUnpublishRestaurants.ts) | `bulkUnpublishRestaurants(ids)` |
| `POST` | `/api/v1/admin/restaurants/bulk-reject` | `admin` | Reject multiple restaurants (status -> rejected) | `ids[]` | [client/lib/api-v2/admin/service/restaurant/bulkRejectRestaurants.ts](../client/lib/api-v2/admin/service/restaurant/bulkRejectRestaurants.ts) | `bulkRejectRestaurants(ids)` |
| `POST` | `/api/v1/admin/restaurants/bulk-delete` | `admin` | Delete multiple restaurants | `ids[]`, `hard_delete` (boolean) | [client/lib/api-v2/admin/service/restaurant/bulkDeleteRestaurants.ts](../client/lib/api-v2/admin/service/restaurant/bulkDeleteRestaurants.ts) | `bulkDeleteRestaurants(ids)` |

---

### Sites

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/sites/names` | `admin,ceo,editor` | Dropdown list of site names + IDs | — | [client/lib/api-v2/admin/service/sites/getSiteNames.ts](../client/lib/api-v2/admin/service/sites/getSiteNames.ts) | `getSiteNames()` |
| `GET` | `/api/v1/admin/sites` | `admin,ceo,editor` | List all partner sites | `status` (all, active, suspended), `search` | [client/lib/api-v2/admin/service/sites/getAdminSites.ts:28](../client/lib/api-v2/admin/service/sites/getAdminSites.ts) | `getAdminSites(params?)` |
| `GET` | `/api/v1/admin/sites/{id}` | `admin,ceo,editor` | Fetch single site details | `id` (path) | [client/lib/api-v2/admin/service/sites/getAdminSiteById.ts](../client/lib/api-v2/admin/service/sites/getAdminSiteById.ts) | `getAdminSiteById(id)` |
| `POST` | `/api/v1/admin/sites` | `admin` | Register new partner site | `name`, `domain`, `contact_name`, `contact_email`, `description`, `categories[]`, `image`, `original_logo`, `dark_logo`, `light_logo` | [client/lib/api-v2/admin/service/sites/createSite.ts:31](../client/lib/api-v2/admin/service/sites/createSite.ts) | `createSite(body)` |
| `PUT` | `/api/v1/admin/sites/{id}` | `admin` | Update site details | `id` (path), same fields as POST + `status` (active, suspended) | [client/lib/api-v2/admin/service/sites/updateSite.ts](../client/lib/api-v2/admin/service/sites/updateSite.ts) | `updateSite(id, body)` |
| `DELETE` | `/api/v1/admin/sites/{id}` | `admin` | Delete partner site | `id` (path) | [client/lib/api-v2/admin/service/sites/deleteSite.ts](../client/lib/api-v2/admin/service/sites/deleteSite.ts) | `deleteSite(id)` |
| `PATCH` | `/api/v1/admin/sites/{id}/toggle-status` | `admin` | Enable/disable site API access | `id` (path) | [client/lib/api-v2/admin/service/sites/toggleSiteStatus.ts](../client/lib/api-v2/admin/service/sites/toggleSiteStatus.ts) | `toggleStatus(id)` |
| `PATCH` | `/api/v1/admin/sites/{id}/refresh-key` | `admin` | Rotate site API key | `id` (path) | [client/lib/api-v2/admin/service/sites/refreshKey.ts:18](../client/lib/api-v2/admin/service/sites/refreshKey.ts) | `refreshKey(id)` |

---

### Ad Campaigns & Units

#### Campaigns

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/campaigns` | `admin` | List all campaigns paginated | `per_page` | [client/lib/api-v2/admin/service/campaigns/getCampaigns.ts:5](../client/lib/api-v2/admin/service/campaigns/getCampaigns.ts) | `getCampaigns(page?)` |
| `POST` | `/api/v1/admin/campaigns` | `admin` | Create new campaign | `name`, `status`, `start_date`, `end_date`, `image_url`/`headline`/`banner_image_urls`, `target_url`, `ad_units[]` | [client/lib/api-v2/admin/service/campaigns/createCampaign.ts](../client/lib/api-v2/admin/service/campaigns/createCampaign.ts) | `createCampaign(data)` |
| `GET` | `/api/v1/admin/campaigns/{id}` | `admin` | Fetch single campaign | `id` (path) | Not directly found | — |
| `PUT` | `/api/v1/admin/campaigns/{id}` | `admin` | Update campaign | `id` (path), campaign fields | [client/lib/api-v2/admin/service/campaigns/updateCampaign.ts](../client/lib/api-v2/admin/service/campaigns/updateCampaign.ts) | `updateCampaign(id, data)` |
| `DELETE` | `/api/v1/admin/campaigns/{id}` | `admin` | Delete campaign | `id` (path) | [client/lib/api-v2/admin/service/campaigns/deleteCampaign.ts](../client/lib/api-v2/admin/service/campaigns/deleteCampaign.ts) | `deleteCampaign(id)` |

#### Ad Units

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/ad-units` | `admin` | List all ad units paginated | `per_page` | Not directly found | — |
| `POST` | `/api/v1/admin/ad-units` | `admin` | Create new ad unit | `name`, `type`, `page_url`, `campaigns[]` | Not directly found | — |
| `GET` | `/api/v1/admin/ad-units/{id}` | `admin` | Fetch single ad unit | `id` (path) | Not directly found | — |
| `PUT` | `/api/v1/admin/ad-units/{id}` | `admin` | Update ad unit | `id` (path), ad unit fields | Not directly found | — |
| `DELETE` | `/api/v1/admin/ad-units/{id}` | `admin` | Delete ad unit | `id` (path) | Not directly found | — |

#### Ad Metrics

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/ad-metrics` | `admin` | List all ad metrics | — | [client/lib/api-v2/admin/service/ads/getAdMetrics.ts](../client/lib/api-v2/admin/service/ads/getAdMetrics.ts) | `getAdMetrics()` |
| `GET` | `/api/v1/admin/ad-metrics/units/{adUnit}` | `admin` | Metrics by ad unit | `adUnit` (path) | Not directly found | — |
| `GET` | `/api/v1/admin/ad-metrics/campaigns/{campaign}` | `admin` | Metrics by campaign | `campaign` (path) | Not directly found | — |

---

### Mailing List & Newsletter

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/mailing-list-groups` | `admin,ceo,editor` | List all mailing list groups | — | [client/lib/api-v2/admin/service/mailing-list/groups.ts](../client/lib/api-v2/admin/service/mailing-list/groups.ts) | `getMailingListGroups()` |
| `POST` | `/api/v1/admin/mailing-list-groups` | `admin,ceo,editor` | Create mailing list group | `name`, `description` | Same file | `createMailingListGroup(data)` |
| `GET` | `/api/v1/admin/mailing-list-groups/{id}` | `admin,ceo,editor` | Fetch single group | `id` (path) | Same file | `getMailingListGroupById(id)` |
| `PUT` | `/api/v1/admin/mailing-list-groups/{id}` | `admin,ceo,editor` | Update group | `id` (path), `name`, `description` | Same file | `updateMailingListGroup(id, data)` |
| `DELETE` | `/api/v1/admin/mailing-list-groups/{id}` | `admin,ceo,editor` | Delete group | `id` (path) | Same file | `deleteMailingListGroup(id)` |

---

### Article Publications & Events

#### Article Publications

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/article-publications` | `admin,ceo,editor` | List scheduled publications | — | Not directly found | — |
| `POST` | `/api/v1/admin/article-publications` | `admin,ceo,editor` | Schedule article for future publish | `article_id`, `publish_at` | Not directly found | — |
| `GET` | `/api/v1/admin/article-publications/{id}` | `admin,ceo,editor` | Fetch single publication | `id` (path) | Not directly found | — |
| `PUT` | `/api/v1/admin/article-publications/{id}` | `admin,ceo,editor` | Update scheduled time | `id` (path), `publish_at` | Not directly found | — |
| `DELETE` | `/api/v1/admin/article-publications/{id}` | `admin,ceo,editor` | Cancel scheduled publication | `id` (path) | Not directly found | — |

#### Events

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/events` | `admin,ceo,editor` | List editorial calendar events | — | [client/lib/api-v2/admin/service/events/getAdminEvents.ts:12](../client/lib/api-v2/admin/service/events/getAdminEvents.ts) | `getAdminEvents()` |
| `POST` | `/api/v1/admin/events` | `admin,ceo,editor` | Create new event | `name`, `date`, `description` | [client/lib/api-v2/admin/service/events/createEvent.ts](../client/lib/api-v2/admin/service/events/createEvent.ts) | `createEvent(data)` |
| `GET` | `/api/v1/admin/events/{id}` | `admin,ceo,editor` | Fetch single event | `id` (path) | [client/lib/api-v2/admin/service/events/getEventById.ts](../client/lib/api-v2/admin/service/events/getEventById.ts) | `getEventById(id)` |
| `PUT` | `/api/v1/admin/events/{id}` | `admin,ceo,editor` | Update event | `id` (path), event fields | [client/lib/api-v2/admin/service/events/updateEvent.ts](../client/lib/api-v2/admin/service/events/updateEvent.ts) | `updateEvent(id, data)` |
| `DELETE` | `/api/v1/admin/events/{id}` | `admin,ceo,editor` | Delete event | `id` (path) | [client/lib/api-v2/admin/service/events/deleteEvent.ts](../client/lib/api-v2/admin/service/events/deleteEvent.ts) | `deleteEvent(id)` |

---

### Categories (Admin)

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/categories` | `admin,ceo,editor` | List all categories | — | [client/lib/api-v2/admin/service/scraper/getCategories.ts:11](../client/lib/api-v2/admin/service/scraper/getCategories.ts) | `getCategories()` |
| `GET` | `/api/v1/admin/categories/{id}` | `admin,ceo,editor` | Fetch single category | `id` (path) | Not directly found | — |
| `POST` | `/api/v1/admin/categories` | `admin` | Create category | `name`, `is_active` | [client/lib/api-v2/admin/service/scraper/createCategory.ts](../client/lib/api-v2/admin/service/scraper/createCategory.ts) | `createCategory(data)` |
| `PUT` | `/api/v1/admin/categories/{id}` | `admin` | Update category | `id` (path), `name`, `is_active` | [client/lib/api-v2/admin/service/scraper/updateCategory.ts](../client/lib/api-v2/admin/service/scraper/updateCategory.ts) | `updateCategory(id, data)` |
| `DELETE` | `/api/v1/admin/categories/{id}` | `admin` | Delete category | `id` (path) | [client/lib/api-v2/admin/service/scraper/deleteCategory.ts](../client/lib/api-v2/admin/service/scraper/deleteCategory.ts) | `deleteCategory(id)` |

---

### Countries (Admin)

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/countries` | `admin,ceo,editor` | List all countries | — | [client/lib/api-v2/admin/service/scraper/getCountries.ts](../client/lib/api-v2/admin/service/scraper/getCountries.ts) | `getCountries()` |
| `GET` | `/api/v1/admin/countries/{id}` | `admin,ceo,editor` | Fetch single country | `id` (path) | Not directly found | — |
| `POST` | `/api/v1/admin/countries` | `admin` | Create country | `id`, `name`, `gl`, `h1`, `ceid`, `is_active` | [client/lib/api-v2/admin/service/scraper/createCountry.ts](../client/lib/api-v2/admin/service/scraper/createCountry.ts) | `createCountry(data)` |
| `PUT` | `/api/v1/admin/countries/{id}` | `admin` | Update country | `id` (path), country fields | [client/lib/api-v2/admin/service/scraper/updateCountry.ts](../client/lib/api-v2/admin/service/scraper/updateCountry.ts) | `updateCountry(id, data)` |
| `DELETE` | `/api/v1/admin/countries/{id}` | `admin` | Delete country | `id` (path) | [client/lib/api-v2/admin/service/scraper/deleteCountry.ts](../client/lib/api-v2/admin/service/scraper/deleteCountry.ts) | `deleteCountry(id)` |

---

### Provinces

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/provinces` | `admin,ceo,editor` | List provinces, filtered by country | `country_id` (query) | [client/lib/api-v2/admin/service/scraper/getProvinces.ts](../client/lib/api-v2/admin/service/scraper/getProvinces.ts) | `getProvinces(countryId?)` |
| `GET` | `/api/v1/admin/provinces/{id}` | `admin,ceo,editor` | Fetch single province | `id` (path) | Not directly found | — |
| `POST` | `/api/v1/admin/provinces` | `admin` | Create province | `country_id`, `name`, `is_active` | [client/lib/api-v2/admin/service/scraper/createProvince.ts](../client/lib/api-v2/admin/service/scraper/createProvince.ts) | `createProvince(data)` |
| `PUT` | `/api/v1/admin/provinces/{id}` | `admin` | Update province | `id` (path), province fields | [client/lib/api-v2/admin/service/scraper/updateProvince.ts](../client/lib/api-v2/admin/service/scraper/updateProvince.ts) | `updateProvince(id, data)` |
| `DELETE` | `/api/v1/admin/provinces/{id}` | `admin` | Delete province | `id` (path) | [client/lib/api-v2/admin/service/scraper/deleteProvince.ts](../client/lib/api-v2/admin/service/scraper/deleteProvince.ts) | `deleteProvince(id)` |

---

### Cities

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/cities` | `admin,ceo,editor` | List cities, filtered by country | `country_id` (query) | [client/lib/api-v2/admin/service/cities/getCities.ts](../client/lib/api-v2/admin/service/cities/getCities.ts) | `getCities(countryId?)` |
| `GET` | `/api/v1/admin/cities/{id}` | `admin,ceo,editor` | Fetch single city | `id` (path) | Not directly found | — |
| `POST` | `/api/v1/admin/cities` | `admin` | Create city | `country_id`, `province_id`, `name`, `is_active` | [client/lib/api-v2/admin/service/cities/createCity.ts](../client/lib/api-v2/admin/service/cities/createCity.ts) | `createCity(data)` |
| `PUT` | `/api/v1/admin/cities/{id}` | `admin` | Update city | `id` (path), city fields | [client/lib/api-v2/admin/service/cities/updateCity.ts](../client/lib/api-v2/admin/service/cities/updateCity.ts) | `updateCity(id, data)` |
| `DELETE` | `/api/v1/admin/cities/{id}` | `admin` | Delete city | `id` (path) | [client/lib/api-v2/admin/service/cities/deleteCity.ts](../client/lib/api-v2/admin/service/cities/deleteCity.ts) | `deleteCity(id)` |

---

### Generation (AI)

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/admin/generate/text` | `admin,editor` | Generate article text via AI | `prompt`, `options` (instructions) | [client/lib/api-v2/admin/service/ai/generateText.ts:27](../client/lib/api-v2/admin/service/ai/generateText.ts) | `generateText(body)` |
| `POST` | `/api/v1/admin/generate/image` | `admin,editor` | Generate images via AI | `prompt`, `options` (count, quality, aspect_ratio) | [client/lib/api-v2/admin/service/ai/generateImages.ts:37](../client/lib/api-v2/admin/service/ai/generateImages.ts) | `generateImages(prompt, n?)` |

---

### Upload (Admin)

| Method | Endpoint | Roles | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/admin/upload/image` | `admin,editor` | Upload image to S3, get public URL | `image` (file), `type` (optional) | [client/lib/api-v2/admin/service/upload/uploadImage.ts:23](../client/lib/api-v2/admin/service/upload/uploadImage.ts) | `uploadImage(image)` |
| `POST` | `/api/v1/admin/upload/image` | `admin,editor` | Upload article-specific image | `image` (file) | [client/lib/api-v2/admin/service/upload/uploadArticleImage.ts:23](../client/lib/api-v2/admin/service/upload/uploadArticleImage.ts) | `uploadArticleImage(image)` |

---

## V2 Admin Routes

**Prefix**: `/api/v2` | **Middleware**: `auth:sanctum`, `is.authenticated:admin`

---

### Users (V2)

| Method | Endpoint | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|
| `GET` | `/api/v2/users` | List all users paginated | `page`, `per_page`, `search` | [client/lib/api-v2/admin/service/users/getUsers.ts:34](../client/lib/api-v2/admin/service/users/getUsers.ts) | `getUsers(params?)` |
| `POST` | `/api/v2/users` | Create new user/staff account (auto-generates password and sends email) | `first_name`, `last_name`, `email`, `role` (blogger, admin, ceo, editor) | [client/lib/api-v2/admin/service/users/createUser.ts](../client/lib/api-v2/admin/service/users/createUser.ts) | `createUser(data)` |
| `GET` | `/api/v2/users/{id}` | Fetch single user | `id` (path) | [client/lib/api-v2/admin/service/users/getUser.ts](../client/lib/api-v2/admin/service/users/getUser.ts) | `getUser(id)` |
| `PUT` | `/api/v2/users/{id}` | Update user info | `id` (path), `name`, `first_name`, `last_name`, `email`, `password`, `password_confirmation`, `roles[]` | Not directly found | — |
| `DELETE` | `/api/v2/users/{id}` | Delete user account | `id` (path) | Not directly found | — |
| `PUT` | `/api/v2/users/{id}/role` | Update user role | `id` (path), `roles` (array of role names) | Not directly found | — |
| `GET` | `/api/v2/public/user/info` | Get public user info by email (no auth) | `email` (query) | [client/components/features/admin/login/SignInForm.tsx:73](../client/components/features/admin/login/SignInForm.tsx) | Inline native `fetch` |

---

### Roles (V2)

| Method | Endpoint | Use Case | Parameters | Client File | Client Function |
|---|---|---|---|---|---|
| `GET` | `/api/v2/roles` | List all roles | — | Not directly found | — |
| `POST` | `/api/v2/roles` | Create new role with permissions | `name`, `permissions[]` | Not directly found | — |
| `GET` | `/api/v2/roles/{id}` | Fetch single role | `id` (path) | Not directly found | — |
| `PUT` | `/api/v2/roles/{id}` | Update role and permissions | `id` (path), role fields | Not directly found | — |
| `DELETE` | `/api/v2/roles/{id}` | Delete role | `id` (path) | Not directly found | — |

---

## External Service Calls

> These are NOT Laravel API calls. They go to separate microservices.

### AI / News Scraper Service

**Base URL**: `process.env.NEXT_PUBLIC_AI_SERVICE_URL` (default: `http://localhost:8001`)
**Client File**: [client/lib/api-v2/admin/service/scraperRun/triggerScraper.ts](../client/lib/api-v2/admin/service/scraperRun/triggerScraper.ts)

| Method | Path | Use Case | Timeout | Client Function |
|---|---|---|---|---|
| `POST` | `/trigger` | Trigger full news scraper run | 60 min | `triggerScraper()` |
| `POST` | `/trigger/cancel` | Stop active scraper run | default | `stopScraper()` |
| `POST` | `/scheduler/off` | Disable automatic scraper scheduling | default | `setSchedulerOff()` |
| `POST` | `/scheduler/on` | Enable automatic scraper scheduling | default | `setSchedulerOn()` |
| `POST` | `/trigger/targeted` | Trigger scraper for specific countries + categories | default | `triggerTargetedScraper(countries, categories)` |
| `GET` | `/status` | Get current scraper run status | default | [client/lib/api-v2/admin/service/scraperRun/getScraperStatus.ts](../client/lib/api-v2/admin/service/scraperRun/getScraperStatus.ts) |

---

### Restaurant Scraper Service

**Base URL**: `process.env.NEXT_PUBLIC_RESTAURANTS_SERVICE_URL` (default: `http://localhost:8012`)
**Client File**: [client/lib/api-v2/admin/service/restaurant/triggerRestaurantScraper.ts](../client/lib/api-v2/admin/service/restaurant/triggerRestaurantScraper.ts)

| Method | Path | Use Case | Timeout | Client Function |
|---|---|---|---|---|
| `GET` | `/locations` | Fetch available scraper locations | default | `getRestaurantScraperLocations()` |
| `POST` | `/trigger/restaurants/targeted` | Trigger targeted restaurant scraper by country/city | 30 min | `triggerTargetedRestaurantScraper(countries, cities, locations)` |

---

### Third-Party APIs

| Method | URL | Use Case | Client File | Client Function |
|---|---|---|---|---|
| `GET` | `https://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}` | Fetch public holidays for editorial calendar | [client/lib/api-v2/public/services/metadata/getPublicHolidays.ts:31](../client/lib/api-v2/public/services/metadata/getPublicHolidays.ts) | `getPublicHolidays(countryCode, year)` |

---

## Web Routes

**File**: [server/routes/web.php](../server/routes/web.php)

> Server-rendered pages and email preview routes (dev use).

| Method | Endpoint | Use Case |
|---|---|---|
| `GET` | `/ads/{id}` | Display a rendered ad page by campaign ID |
| `GET` | `/preview-email` | Preview the daily newsletter email template |
| `GET` | `/preview-email/welcome-blogger` | Preview welcome email for new bloggers |
| `GET` | `/preview-email/welcome` | Preview welcome email for new subscribers |
| `GET` | `/preview-email/welcome-back` | Preview "already subscribed" email template |
| `GET` | `/preview-email/preferences-updated` | Preview preferences-updated confirmation email |

---

## Summary

| Stat | Value |
|---|---|
| Total API Endpoints | 150+ |
| API Versions | v1, v2 |
| External Microservices | 2 (AI Scraper, Restaurant Scraper) |
| Third-Party APIs | 1 (Nager.Date holidays) |
| Auth Methods | Sanctum tokens, Google OAuth, OTP |
| Key Resources | Articles, Restaurants, Ads/Campaigns, Subscriptions, Users, Sites, Categories, Countries, Provinces, Cities |
| Client API Layer | [client/lib/api-v2/](../client/lib/api-v2/) |
| Notable Features | Redis article pipeline, AI text/image gen, S3 uploads, newsletter dispatch, scheduled publications |
