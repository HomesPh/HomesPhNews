# Articles Image Optimization (Script/articles Only)

## Goal
Reduce the size of article images uploaded to S3 (example: ~1.6MB each) by **re-encoding and resizing** the generated images *before* upload—without changing the article generation/dedup/save logic.

Chunking is not the main fix here: your images are small enough that multipart/chunk uploads won’t meaningfully improve payload size and the real lag is bandwidth + upload time due to large file size.

## Why This Helps
- Smaller files => faster upload to S3
- Less network time per article
- Lower S3 storage and potentially faster CDN delivery

## Where Images Are Uploaded
In `Script/articles/`:
- `scheduler.py`
  - Generates an image (usually a local `gen_{article_id}.png`)
  - Calls `storage.upload_image(img_path, f"news/{article_id}.png")`

- `storage.py`
  - Uploads to AWS S3 and currently sets:
    - `ContentType: image/jpeg` (even though your destination path uses `.png`)

## Proposed Approach (Safe / Low Blast Radius)
### Step A — Add an “optimize before upload” helper
Implement a small helper using Pillow in the **articles pipeline** (recommended location: `Script/articles/scheduler.py`, near where upload happens).

Behavior:
1. Only optimize if `img_path` is a **local file** (not `http...`, not placeholder URL).
2. Open image with `PIL.Image.open(img_path)`
3. Convert to RGB (PNG may include alpha)
4. Resize with a **max width** constraint (example: `1200px`) using `thumbnail()` / high-quality resampling
5. Save to a **new optimized format**:
   - Prefer **JPEG** (smaller, simplest) OR **WEBP** (better size/quality)
6. Upload the optimized file to S3 using the **matching extension**:
   - `.jpg` => upload destination ends with `.jpg`
   - `.webp` => upload destination ends with `.webp`
7. Delete the optimized temp file after upload (cleanup)

### Step B — Keep upload logic identical otherwise
All existing logic should remain the same:
- No change to article text generation
- No change to dedup rules
- No change to Redis article save
- Only add the compress/resize step right before S3 upload

### Step C (Recommended) — Fix `ContentType` to match extension
In `Script/articles/storage.py`, update `_upload_to_s3()` to set `ContentType` based on the final file extension (or remove the hard-coded JPEG ContentType).
This prevents incorrect metadata when you upload JPG/WEBP.

## Configuration (Recommended Env Vars)
Add env vars in `Script/articles/.env.example` (optional but recommended for control):
- `ARTICLES_IMAGE_MAX_WIDTH` (default: `1200`)
- `ARTICLES_IMAGE_FORMAT` (`jpeg` or `webp`, default: `jpeg`)
- `ARTICLES_IMAGE_QUALITY` (default: `70` for jpeg, `80` for webp)
- Optional:
  - `ARTICLES_IMAGE_ENABLE_OPTIMIZATION` (default: `true`)

## Format Choice Guidance
- **JPEG**:
  - Good if images don’t need transparency
  - Simple quality control via `quality=60..75`
- **WEBP**:
  - Usually smaller than JPEG at similar quality
  - Good default if you can serve modern formats

## Expected Outcome
- Per image file size drops substantially (often 3–10x depending on content)
- Upload time per article decreases
- Overall job runtime improves noticeably

## Testing Checklist
1. Run the article job in a staging environment:
   - Confirm generated images upload successfully
   - Confirm `image_url` points to the new optimized file
2. Verify frontend rendering:
   - Images display correctly (no broken URLs)
3. Confirm S3 metadata correctness:
   - ContentType matches `.jpg`/`.webp`
4. Spot-check a few countries/articles:
   - Ensure no logic change in article content fields

## Rollback Plan
If any issue occurs:
- Disable optimization via `ARTICLES_IMAGE_ENABLE_OPTIMIZATION=false`
- Keep the upload destination as the original format/extension

## Files Involved (Script/articles only)
- `Script/articles/scheduler.py`
  - Insert compress/resize step right before `storage.upload_image(...)`
- `Script/articles/storage.py` (recommended)
  - Make S3 `ContentType` match the actual file extension
- (No required changes) `Script/articles/ai_service.py`
  - Unless you want to optimize during generation instead of before upload