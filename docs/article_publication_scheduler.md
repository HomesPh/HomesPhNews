# Article Publication Scheduler

## Overview
The **Article Publication Scheduler** is a professional tool designed for administrators to schedule bulk article publications across the HomesPh network. It transitions the platform from a simple event calendar to a powerful content distribution system.

## Key Features

### 1. Multi-Site Targeting
Administrators can now select specific destination sites for each scheduled publication.
- **Dynamic Fetching**: Automatically retrieves all active sites from the database.
- **Smart Selection**: Defaults to all active sites for convenience, with full manual override.
- **Visual Feedback**: Selection state is clearly indicated in the scheduler UI.

### 2. Automated Publishing Engine
A robust background system has been implemented to handle the actual publishing logic without manual intervention.
- **Artisan Command**: `php artisan articles:publish-scheduled`
- **Source Flexibility**: Can resolve article data from both the **Database** (drafts) and **Redis** (Python scraper source).
- **Cleanup**: Automatically removes temporary data from Redis once publication is successful to optimize storage.

### 3. Production Readiness
- **High Frequency**: The scheduler is configured to check for pending publications **every minute**.
- **Docker Integrated**: The production `Dockerfile` is pre-configured with `crond` to ensure the background engine starts automatically on container launch.
- **Fail-Safe**: Includes logging and error tracking for failed publication attempts.

## Technical Details

### Database Schema
A new column `target_sites` (JSON) has been added to the `article_publications` table to persist site IDs.

### Backend Workflow
1. **Selection**: Admin selects articles, date, time, and target sites in the frontend.
2. **Scheduling**: Data is sent to `POST /admin/article-publications` and stored with a `pending` status.
3. **Execution**: The `articles:publish-scheduled` command runs via the Laravel scheduler.
4. **Completion**: The command updates article statuses to `published` in the main `articles` table, syncs the site relationships, and updates the publication log to `published`.

### Frontend Deduplication
The system includes logic to prevent duplicate display of public holidays and recurring events on the calendar, ensuring a clean and accurate schedule view.

## Usage Guide
1. Navigate to **Admin > Calendar**.
2. Click **Article Scheduler**.
3. Select the articles you wish to group.
4. Set the **Date** and **Time**.
5. Customize the **Target Sites** list if necessary.
6. Click **Schedule Articles**.

---
*Last Updated: 2026-03-13*
