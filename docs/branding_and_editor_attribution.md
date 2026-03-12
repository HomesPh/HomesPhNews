# Branding and Editor Attribution Updates

## Overview
This update focuses on two main areas:
1. **Branding consistency**: Adjusting logos in email templates and the welcome page to match production standards.
2. **Editorial Crediting**: Refining when and how editors are credited to ensure accuracy.

## Changes

### 1. Logo Adjustments
- **Daily Newsletter Template (`daily.blade.php`)**:
    - Switched to dynamic `$logo` variable.
    - Adjusted height to `28px` for better balance.
    - Updated `DailyNewsletterMail` to use the production URL (`https://news.homes.ph/images/HomesLogo.png`).
- **Welcome Page (`welcome.blade.php`)**:
    - Replaced Laravel default logo with Homes.ph News branding.
    - Applied premium grayscale/opacity styling for light/dark mode compatibility.

### 2. Editor Attribution Logic
- **Conditional Credit (`ArticleController.php`)**:
    - The `edited_by` field is now only updated if **content-bearing fields** (Title, Summary, Content, etc.) are modified.
    - Status changes (e.g., publishing or rejecting) no longer overwrite the original editor's credit unless the content itself was also tweaked.
- **Scraper Baseline**: Articles moved from the Redis scraper to the database now start with `edited_by = null` until a human editor actually opens and saves them.
- **Resource Privacy (`ArticleResource.php`)**:
    - Hidden the "Edited by" information for articles in **Pending Review** or **Pending** status.
    - This ensures articles awaiting their first edit don't appear as "Edited by" the person who merely approved the move to the database.

## Impact
- **Professionalism**: Emails and landing pages look more curated.
- **Accountability**: The system now accurately tracks who did the actual writing/editing work.
- **UX**: The management dashboard is cleaner by removing irrelevant metadata for unedited articles.
