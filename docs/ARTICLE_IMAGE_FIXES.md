# Documentation: Article Image & Upload Enhancements

This document summarizes the improvements and fixes implemented to ensure article images (featured and content-block based) are handled reliably across the HomePh News system.

## 🚀 1. S3 Upload & Reliability Fixes

### **Local environment SSL Bypass**
- **Problem**: Local Windows environments often fail to verify S3 certificates, resulting in `cURL error 60`.
- **Solution**: Updated `config/filesystems.php` with a local-only `http.verify => false` bypass for S3. This ensures developers can upload images without configuring complex local certificate stores.
- **File**: `server/config/filesystems.php`

### **Dynamic Extension Detection**
- **Problem**: Uploads would fail if the filename extension didn't match the image's internal MIME type.
- **Solution**: The frontend and backend now both "guess" the correct extension (e.g., `.png`, `.webp`, `.jpg`) based on the image's actual data structure, ensuring 100% compatibility with backend validation rules.
- **Files**: `ArticleEditorModal.tsx`, `UploadController.php`

---

## 🛠️ 2. Article Editor (Admin) Enhancements

### **Recursive deep-scan & Processing**
- **Feature**: The article editor now performs a "recursive deep scan" of all content blocks (Grids, Split Views, Centered Images) before saving.
- **Mechanism**:
    1. It detects any temporary URLs (`blob:` or `data:`).
    2. Uploads them to S3.
    3. Replaces the temporary URL with the permanent S3 URL.
    4. **Regenerates the HTML content** using the updated S3 URLs before sending it to the database.
- **Result**: NO MORE base64 code or broken blobs in the database.

### **Fail-Safe Pre-Processing**
- Added **Deep Cloning** (`JSON.parse/stringify`) before processing saves. This prevents the editor's live state from becoming "laggy" or buggy while images are being uploaded in the background.
- If any image fails to reach S3, the process **halts and alerts the user**, preventing partial saves that would lead to broken images on the live site.

---

## 🎨 3. Frontend (User Page) Improvements

### **Featured Image Deduplication**
- **Feature**: Developed a smart deduplication logic for the public article detail page.
- **Logic**: If the article's "Featured Image" is identical to the very first image block inside the article content, the top "Featured Image" is automatically hidden.
- **Impact**: Provides a cleaner, more professional magazine-style layout for articles published from scrapers or AI generators, avoiding the "sandwich" effect (Image > Ad > Duplicate Image).
- **File**: `client/components/features/article/ArticleDetailContent.tsx`

---

## 🔧 4. Detailed Error Diagnostics

- **Backend Visibility**: The system now passes specific PHP exceptions back to the React UI. If an upload fails, the user now sees the technical reason (e.g., `S3: Access Denied` or `Bucket Not Found`) instead of a generic "Upload failed."
- **Logging**: Implemented verbose trace logging in `storage/logs/laravel.log` for any S3-related failure, making remote debugging much faster.

---

### **System Source of Truth Profile**
- **Images**: Always S3 (Permanent).
- **Format**: JSON Blocks (`content_blocks`) are mapped to HTML (`content`) dynamically.
- **Sync**: Redis (Pending) → Database (Published) data integrity preserved during the migration.
