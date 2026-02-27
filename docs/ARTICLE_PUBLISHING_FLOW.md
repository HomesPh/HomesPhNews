# Article Publishing Flow with Content Blocks

## Overview
This document explains how the article publishing flow works, especially when editing articles with `content_blocks` and then publishing them.

---

## Flow 1: Publishing from Article Details Page

**Route**: `/admin/articles/{id}?from=/admin/articles?status=pending`

### Frontend (`client/app/admin/articles/[id]/page.tsx`)

1. **User clicks "Publish" button** (Line 322-328)
2. **Validation** (Lines 98-105):
   - Checks if at least one site is selected
   - Shows alert if no sites selected
3. **Confirmation Dialog** (Lines 388-399):
   - User confirms the publish action
4. **API Call** (Lines 107-123):
   ```typescript
   await publishArticle(articleId, {
     published_sites: publishToSites,
     custom_titles: Object.entries(customTitles).map(([k, v]) => `${k}:${v}`)
   });
   ```
5. **Redirect**: On success → `/admin/articles?status=published`

### Backend (`server/app/Http/Controllers/Api/Admin/ArticleController.php`)

**Endpoint**: `POST /api/admin/articles/{id}/publish`

#### Logic Flow:

1. **Validate UUID** (Line 384)
2. **Check Database & Redis** (Lines 390-391):
   ```php
   $existing = Article::where('id', $id)->first();
   $redisArticle = $this->redisService->getArticle($id);
   ```

3. **If Article EXISTS in Database** (Lines 393-414):
   - Update status to 'published'
   - **IMPORTANT**: Preserve DB `content_blocks`, `template`, and `author` if they exist
   - Only use Redis data if DB fields are empty
   ```php
   'content_blocks' => (!empty($existing->content_blocks) 
       ? $existing->content_blocks 
       : ($redisArticle['content_blocks'] ?? [])),
   ```

4. **If Article ONLY in Redis** (Lines 416-447):
   - Create new article from Redis data
   - Save all fields including `content_blocks`

5. **Sync Published Sites** (Lines 449-453)
6. **Sync Gallery Images** (Lines 461-468)
7. **Delete from Redis** (Line 470)
8. **Return Success** (Line 473)

---

## Flow 2: Editing and Publishing from Modal

**Component**: `ArticleEditorModal.tsx`

### Frontend Flow

1. **User edits article** in the modal:
   - Changes title, content, category, etc.
   - Modifies `content_blocks` (text blocks, images, galleries)
   - Changes template type
   - Selects sites to publish to

2. **User clicks "Publish" button** (Line 382):
   ```typescript
   onPublish={() => handleSave(true)}
   ```

3. **handleSave function** (Lines 253-371):

   **Step 1**: Upload any base64 images to S3 (Lines 256-283):
   ```typescript
   // Upload main image
   if (isDataUrl(finalImage || '')) {
       finalImage = await uploadIfDataUrl(finalImage);
   }
   
   // Upload gallery images
   for (let i = 0; i < finalGalleryImages.length; i++) {
       if (isDataUrl(finalGalleryImages[i])) {
           finalGalleryImages[i] = await uploadIfDataUrl(finalGalleryImages[i]) || '';
       }
   }
   
   // Upload content block images
   for (let i = 0; i < finalContentBlocks.length; i++) {
       if (finalContentBlocks[i].image && isDataUrl(finalContentBlocks[i].image || '')) {
           finalContentBlocks[i] = {
               ...finalContentBlocks[i],
               image: await uploadIfDataUrl(finalContentBlocks[i].image || null) || undefined
           };
       }
   }
   ```

   **Step 2**: Build payload with ALL fields (Lines 285-304):
   ```typescript
   const payload = {
       title: articleData.title,
       slug: articleData.slug,
       summary: articleData.summary,
       content: articleData.content,
       category: articleData.category,
       country: articleData.country,
       image: finalImage,
       published_sites: articleData.publishTo,
       status: (isPublish ? 'published' : 'pending review'),
       topics: articleData.tags,
       author: articleData.author,
       date: articleData.publishDate,
       gallery_images: finalGalleryImages,
       split_images: articleData.splitImages,
       content_blocks: finalContentBlocks,  // ← IMPORTANT
       template: template,                   // ← IMPORTANT
       image_position: articleData.image_position,
       image_position_x: articleData.image_position_x
   };
   ```

   **Step 3**: Determine save path (Lines 307-360):

   **For Edit Mode + Database Article + Publishing** (Lines 349-355):
   ```typescript
   if (isPublish) {
       // 1. First update the article with all changes (including content_blocks)
       await updateArticle(initialData.id, payload);
       
       // 2. Then publish it (changes status to 'published', syncs sites)
       await publishArticle(initialData.id, {
           published_sites: articleData.publishTo,
       });
       
       alert('Article published successfully!');
   }
   ```

### Backend Flow

**Step 1**: `updateArticle` endpoint is called first
- **Endpoint**: `PATCH /api/admin/articles/{id}`
- **Controller**: `ArticleController@update` (Lines 330-368)
- **What it does**:
  1. Validates all fields (including `content_blocks`, `template`, `author`)
  2. Syncs published sites
  3. Syncs gallery images
  4. **Updates the article** with ALL validated data:
     ```php
     $article->update($validated);
     ```
  5. This saves `content_blocks`, `template`, `author`, etc. to the database

**Step 2**: `publishArticle` endpoint is called
- **Endpoint**: `POST /api/admin/articles/{id}/publish`
- **Controller**: `ArticleController@publish` (Lines 377-471)
- **What it does**:
  1. Finds the existing article in the database
  2. **PRESERVES** the `content_blocks`, `template`, and `author` from the database:
     ```php
     'content_blocks' => (!empty($existing->content_blocks) 
         ? $existing->content_blocks 
         : ($redisArticle['content_blocks'] ?? [])),
     ```
  3. Updates status to 'published'
  4. Syncs published sites (again, to ensure they're correct)
  5. Deletes from Redis (if it existed there)

---

## Key Points

### ✅ Content Blocks Are Preserved

When you edit an article and click publish:

1. **First**, `updateArticle` saves ALL your changes including `content_blocks`
2. **Then**, `publishArticle` changes the status to 'published' BUT:
   - It checks if `content_blocks` exist in the database
   - If they do, it **keeps them** (doesn't overwrite with Redis data)
   - Only uses Redis data if the database field is empty

### ✅ Supported Fields

The following fields are properly saved and preserved:

- `content_blocks` (array of content blocks)
- `template` (template type: 'single', 'inline', 'textwrap', etc.)
- `author` (author name)
- `gallery_images` (array of image URLs)
- `split_images` (array of split layout images)
- `image_position` (image focal point Y)
- `image_position_x` (image focal point X)

### ✅ Database Schema

The `articles` table has these JSON columns:
```php
protected $casts = [
    'content_blocks' => 'array',  // Automatically casts to/from JSON
    'topics' => 'array',
    'published_sites' => 'array',
    'image' => 'array',
];
```

### ✅ Validation

Both `StoreArticleRequest` and `UpdateArticleRequest` validate:
```php
'content_blocks' => 'nullable|array',
'template' => 'nullable|string',
'author' => 'nullable|string',
'gallery_images' => 'nullable|array',
'split_images' => 'nullable|array',
```

---

## Testing the Flow

### Test Case 1: Edit and Publish

1. Go to `/admin/articles/{id}`
2. Click "Edit Article"
3. Modify the content blocks (add text, images, etc.)
4. Select sites to publish to
5. Click "Publish"
6. **Expected Result**:
   - Article is updated with new content_blocks
   - Status changes to 'published'
   - Article appears in Published tab
   - Content blocks are preserved and visible

### Test Case 2: Publish from Details Page

1. Go to `/admin/articles/{id}?from=/admin/articles?status=pending`
2. Select sites to publish to
3. Click "Publish"
4. **Expected Result**:
   - If article has content_blocks in DB → They are preserved
   - If article only in Redis → Redis content_blocks are used
   - Status changes to 'published'

---

## Troubleshooting

### Issue: Content blocks not showing after publish

**Cause**: Article might not have content_blocks in the database

**Solution**: 
1. Edit the article first
2. Add content blocks
3. Click "Save as Draft"
4. Then publish

### Issue: Article not found (404)

**Cause**: Article ID doesn't exist in Redis or Database

**Solution**:
1. Check if article exists: `php artisan tinker`
   ```php
   Article::find('article-id-here');
   ```
2. Check Redis: Run the test script
3. Ensure the Python scraper is running to populate Redis

---

## Summary

The publishing flow now properly handles `content_blocks` by:

1. ✅ Saving them when you edit an article
2. ✅ Preserving them when you publish
3. ✅ Not overwriting them with stale Redis data
4. ✅ Supporting all template types and content block types

This ensures that your edited content is never lost during the publish process.
