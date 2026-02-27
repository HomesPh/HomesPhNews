# Ads Management Documentation

This document explains the technical architecture, data flow, and components that make up the Ads Management system in the HomesPhNews project.

## 1. Overview
The Ads Management system provides a comprehensive mechanism to create Ad Units (ad spaces), attach Campaigns (the actual advertisements) to those units, render the ads on external or internal pages via isolated iframe embeds, and track performance metrics such as impressions and clicks.

## 2. Management Flows

### Understanding Campaigns and Ad Units
Before managing ads, it's essential to understand the basic entities:
- **Ad Units** represent the physical spaces or "placeholders" on a website where advertisements will be displayed. They define structural properties like the dimensions, location, and the type of ad supported (image or text).
- **Campaigns** are the actual advertisements. They contain the creative assets (images, texts, headlines), target URLs when clicked, and scheduling bounds (start/end dates). A Campaign is attached to one or more Ad Units to dictate when and where its creative will appear on the site.

### Creating an Ad Unit
1. Navigate to the **Ad Units** management dashboard in the admin panel.
2. Click on **Create New Ad Unit**.
3. Provide the required configuration:
   - **Name**: A simple descriptive name for the ad placement.
   - **Type**: Select either `image` or `text` based on the desired format.
   - **Page URL**: The location where this ad unit is expected to be displayed.
4. Submit the form to generate the Ad Unit. Once created, the system generates a unique **Ad Unit ID** that can be used snippet generation.

### Creating an Ad Campaign
1. Navigate to the **Campaigns** management dashboard.
2. Click on **Create New Campaign**.
3. Provide the required campaign parameters:
   - **Name**: An internal name to identify the campaign.
   - **Schedule**: Provide explicit `start_date` and `end_date` bounds defining when the ad is active.
   - **Status**: Set to `active`, `paused`, or `archived`.
   - **Targeting/Links**: The destination `target_url` when the ad is clicked.
   - **Creative Assets**: Supply an `image_url` (for static image ads), multiple `banner_image_urls` (for image carousels), or a text `headline` (for text-based ads). Uploaded banner images are restricted to standard fixed sizes (300x250, 728x90, 160x600, 320x50, 970x250, 300x600, 320x100).
4. Save the Campaign.
5. Link the Campaign to one or more Ad Units via the **Campaign Details** or **Ad Unit Details** sections, which will assign them via the `ad_unit_campaign` pivot table. This dictates where the creative will appear during delivery.

---

## 3. Core Entities

The system relies on three primary database models located in `server/app/Models`:

### **AdUnit** (`ad_units` table)
Represents a predefined location or "placeholder" where advertisements will be displayed.
- **Properties**: `id`, `name`, `page_url`, `type`, `impressions`, `clicks`
- **Supported Types**: `image` or `text`
- **Relationship**: Belongs-to-many `Campaign` models (via the `ad_unit_campaign` pivot table).

### **Campaign** (`campaigns` table)
Represents the actual ad content, including targeting dates and creative properties.
- **Properties**: `id`, `name`, `status`, `start_date`, `end_date`, `image_url`, `target_url`, `headline`, `banner_image_urls`, `impressions`, `clicks`
- **Statuses**: `active`, `paused`, `archived`
- **Creatives**: Supports simple images (`image_url`), carousels (`banner_image_urls` array), and text ads (`headline`).
- **Scopes**: Provides an `active()` query scope which validates the status is "active" and the current date falls between `start_date` and `end_date`.
- **Relationship**: Belongs-to-many `AdUnit` models.

### **AdMetric** (`ad_metrics` table)
An append-only table used to store historical analytics events for both ad units and campaigns.
- **Properties**: `ad_unit_id`, `campaign_id`, `type`, `created_at`
- **Metric Types**: `impression`, `click`
- **Purpose**: Used for generating aggregated ad analytical reports (time-series data) and performance charts.

---

## 4. Backend Controllers

The backend endpoints manage the CRUD operations and serving logic:

- **`Api\Admin\AdUnitController` & `Api\Admin\CampaignController`**: Standard CRUD controllers for administrators to manage units and campaigns, as well as their many-to-many assignments.
- **`Api\User\AdController`**: Provides endpoints to fetch available campaigns list (`index`) and campaigns by name (`showByName`).
- **`Api\Admin\AdMetricController`**: 
  - `store()`: Receives telemetry data (impressions/clicks). It records a row in `ad_metrics` and simultaneously updates the cached `impressions` or `clicks` integer counters on the respective `AdUnit` and `Campaign` models for fast reads.
  - `index()`, `showByAdUnit()`, `showByCampaign()`: Returns aggregated time-series data grouped by periods (daily, weekly, monthly) using efficient database datetime formatting.
- **`AdDisplayController`**: Responsible for the actual ad delivery. Based on an Ad Unit ID, it randomly selects one currently active Campaign that is attached to it and returns a rendered blade template (`ads.show`).

---

## 5. Frontend & Display Logic

### Rendering mechanism
Ads are rendered server-side via a minimal, self-contained layout: `server/resources/views/ads/show.blade.php`.
This prevents CSS bleed from host sites and ensures strict layout control.

- **Responsive / Size-Matched Image Ads**: Acts like Google AdSense. Based on the selected iframe dimensions (e.g. `?size=728x90`), the tracking script natively searches the Campaign's `banner_image_urls` for the specific image that perfectly matches that slot. 
  - If a specific size is requested but not found in the campaign, it results in an **unfilled impression** (the iframe safely collapses to prevent warped creative).
  - If set to `responsive`, it falls back to the first available image.
- **Text Ads**: Uses the campaign's `image_url` as a full-bleed background, overlaid with a dark gradient, the `headline` text, and a Call-To-Action (CTA).

### Tracking Telemetry
The analytics tracking is embedded directly via vanilla JavaScript in `show.blade.php`:
1. **Impressions**: Fired synchronously once the DOM `DOMContentLoaded` event triggers.
2. **Clicks**: Fired via a click event listener attached to the overarching `.ad-container` anchor wrapper, immediately before the user is navigated to the `$campaign->target_url`.
3. Tracking POST requests are sent to `/api/v1/ads/metrics` with the `ad_unit_id` and `campaign_id`.

---

## 6. Embed Guide

To display an ad unit dynamically on any static HTML or client-side application (e.g., Next.js), use an `<iframe>` element pointing to the Ad Server's display route. You can enforce a strict dimension delivery by appending a `?size=` query parameter.

```html
<!-- Example of embedding a standard 728x90 Leaderboard Ad Unit -->
<iframe 
    src="https://{THE_API_DOMAIN}/ads/units/{AD_UNIT_ID}?size=728x90" 
    width="728" 
    height="90" 
    style="border: none; overflow: hidden;" 
    scrolling="no"
    title="Advertisement">
</iframe>
```
*Note: Make sure to replace `{THE_API_DOMAIN}` with the actual domain of the backend API and `{AD_UNIT_ID}` with the ID of the specific Ad Unit. Standard size pairings are strictly enforced.*
