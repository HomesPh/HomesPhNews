# 📊 Article Publishing Flow - Complete Database Storage Map

## ✅ **SUCCESS! Your Article is Published**

**Article ID**: `d2a1c32b-4d2c-4e65-8c53-442db50ad31a`
**Title**: "From Hong Kong to Champion Chef: Inspiring Success Story for Filipinos in Canada!"
**Status**: `published`

---

## 🗄️ **Where the Article is Stored**

When you click "Publish", the article data is saved across **3 database tables**:

### **1. `articles` Table** (Main Storage)

**Database**: `homestv`
**Table**: `articles`
**Primary Key**: `id` (UUID)

**Stored Fields**:
```
✅ id: d2a1c32b-4d2c-4e65-8c53-442db50ad31a
✅ title: From Hong Kong to Champion Chef...
✅ status: published
✅ category: Success Stories
✅ country: Canada
✅ author: Maria Santos
✅ template: single
✅ content_blocks: [4 blocks] ← JSON array
✅ summary: Article summary text
✅ content: Main article content
✅ image: Main article image URL
✅ topics: [array of topics]
✅ keywords: Article keywords
✅ source: Original source
✅ original_url: Source URL
✅ slug: URL-friendly slug
✅ is_deleted: false
✅ views_count: 0
✅ created_at: 2026-02-13 06:14:58
✅ updated_at: 2026-02-13 06:18:38
```

**Content Blocks Structure** (stored as JSON):
```json
[
  {
    "type": "image",
    "content": {
      "src": "https://filipinohomes123.s3.ap-southeast-1.amazonaws.com/..."
    }
  },
  {
    "type": "text",
    "content": {
      "text": "<p>Patrick Lin, originally from Hong Kong...</p>"
    }
  },
  {
    "type": "text",
    "content": {
      "text": "<p>Test123</p>"
    }
  },
  {
    "type": "left-image",
    "content": {
      "text": "<p>12345666</p>",
      "image": "blob:http://localhost:3000/..."
    }
  }
]
```

---

### **2. `article_site` Table** (Pivot Table - Published Sites)

**Database**: `homestv`
**Table**: `article_site`
**Purpose**: Links articles to the sites where they're published

**Stored Data**:
```
✅ article_id: d2a1c32b-4d2c-4e65-8c53-442db50ad31a
✅ site_id: 5
```

**Related Site**:
```
✅ Site Name: Main News Portal
✅ Site ID: 5
```

This means the article is published on **"Main News Portal"** site.

---

### **3. `article_images` Table** (Gallery Images)

**Database**: `homestv`
**Table**: `article_images`
**Purpose**: Stores additional gallery images for the article

**Current Status**:
```
❌ No gallery images (empty)
```

If you had uploaded gallery images, they would be stored here as:
```
article_id | image_path
-----------|------------------------------------------
{uuid}     | https://s3.amazonaws.com/image1.jpg
{uuid}     | https://s3.amazonaws.com/image2.jpg
```

---

## 🔄 **Complete Publishing Flow**

Here's the step-by-step flow when you click "Publish":

### **Frontend Flow** (`/admin/articles/[id]/page.tsx`)

```
1. User clicks "Publish" button
   ↓
2. Validation: Check if sites are selected
   ↓
3. Show confirmation dialog
   ↓
4. User confirms
   ↓
5. API Call: POST /api/admin/articles/{id}/publish
   {
     published_sites: ["Main News Portal"],
     custom_titles: []
   }
```

### **Backend Flow** (`ArticleController@publish`)

```
1. Validate UUID format
   ✅ d2a1c32b-4d2c-4e65-8c53-442db50ad31a is valid
   ↓
2. Check if article exists in database
   ✅ Article::where('id', $id)->first()
   ✅ FOUND: Article exists with status "pending review"
   ↓
3. Check if article exists in Redis
   ✅ $redisService->getArticle($id)
   ❌ NOT FOUND in Redis (already deleted or never existed)
   ↓
4. Update existing article in database
   ✅ Update status: 'pending review' → 'published'
   ✅ Set is_deleted: false
   ✅ PRESERVE content_blocks: [4 blocks] (from database)
   ✅ PRESERVE template: 'single' (from database)
   ✅ PRESERVE author: 'Maria Santos' (from database)
   ↓
5. Sync published sites
   ✅ Find site: Main News Portal (ID: 5)
   ✅ Insert into article_site table:
      - article_id: d2a1c32b-4d2c-4e65-8c53-442db50ad31a
      - site_id: 5
   ↓
6. Sync gallery images
   ❌ No gallery images to sync
   ↓
7. Delete from Redis (if existed)
   ✅ Redis key deleted: article:d2a1c32b-4d2c-4e65-8c53-442db50ad31a
   ↓
8. Return success response
   ✅ HTTP 201 Created
   ✅ Return ArticleResource with full article data
```

### **Frontend Redirect**

```
Success response received
   ↓
Redirect to: /admin/articles?status=published
   ↓
Article now appears in "Published" tab
```

---

## 📋 **Database Tables Schema**

### **`articles` Table**
```sql
CREATE TABLE `articles` (
  `id` char(36) PRIMARY KEY,           -- UUID
  `article_id` char(36),                -- Legacy UUID
  `title` varchar(255),
  `original_title` varchar(255),
  `summary` text,
  `content` longtext,
  `image` json,                         -- Main image(s)
  `status` varchar(50),                 -- 'published', 'pending review', 'rejected', 'deleted'
  `category` varchar(50),
  `country` varchar(100),
  `source` varchar(255),
  `original_url` text,
  `keywords` text,
  `topics` json,                        -- Array of topics
  `published_sites` json,               -- Array of site names (deprecated, use pivot)
  `content_blocks` json,                -- ← YOUR CONTENT BLOCKS
  `template` varchar(50),               -- ← YOUR TEMPLATE TYPE
  `author` varchar(255),                -- ← YOUR AUTHOR
  `slug` varchar(255),
  `views_count` int DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp,
  `updated_at` timestamp
);
```

### **`article_site` Pivot Table**
```sql
CREATE TABLE `article_site` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `article_id` char(36),                -- Foreign key to articles.id
  `site_id` bigint,                     -- Foreign key to sites.id
  `created_at` timestamp,
  `updated_at` timestamp,
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON DELETE CASCADE
);
```

### **`article_images` Table**
```sql
CREATE TABLE `article_images` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `article_id` char(36),                -- Foreign key to articles.id
  `image_path` varchar(2000),           -- S3 URL or path
  `created_at` timestamp,
  `updated_at` timestamp,
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE
);
```

---

## 🔍 **How to Verify the Data**

### **1. Check the Article**
```bash
php artisan tinker
```
```php
$article = Article::find('d2a1c32b-4d2c-4e65-8c53-442db50ad31a');
echo $article->title;
echo $article->status;
dd($article->content_blocks);
```

### **2. Check Published Sites**
```php
$article = Article::find('d2a1c32b-4d2c-4e65-8c53-442db50ad31a');
$sites = $article->publishedSites()->get();
foreach ($sites as $site) {
    echo $site->site_name . "\n";
}
```

### **3. Check Gallery Images**
```php
$article = Article::find('d2a1c32b-4d2c-4e65-8c53-442db50ad31a');
$images = $article->images;
foreach ($images as $img) {
    echo $img->image_path . "\n";
}
```

### **4. Direct SQL Query**
```sql
-- Check article
SELECT id, title, status, category, country, author, template, is_deleted
FROM articles
WHERE id = 'd2a1c32b-4d2c-4e65-8c53-442db50ad31a';

-- Check published sites
SELECT a.title, s.site_name
FROM articles a
JOIN article_site ast ON a.id = ast.article_id
JOIN sites s ON ast.site_id = s.id
WHERE a.id = 'd2a1c32b-4d2c-4e65-8c53-442db50ad31a';

-- Check gallery images
SELECT article_id, image_path
FROM article_images
WHERE article_id = 'd2a1c32b-4d2c-4e65-8c53-442db50ad31a';
```

---

## ✅ **Summary**

Your article is successfully published and stored in:

1. **`articles` table**: Main article data (title, content, content_blocks, template, etc.)
2. **`article_site` table**: Link to "Main News Portal" site
3. **`article_images` table**: Gallery images (currently empty)
4. **Redis**: Deleted (correct behavior after publishing)

The `content_blocks` field contains **4 blocks** of structured content that you created in the editor, and they are properly preserved during the publish process! 🎉
