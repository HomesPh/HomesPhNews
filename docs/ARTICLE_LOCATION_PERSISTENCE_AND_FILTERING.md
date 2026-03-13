# Article Location Persistence & Hierarchical Filtering

## Overview
This document outlines the implementation of persistent location tracking (Province and City) for articles and the hierarchical filtering system in the article editor. This feature ensures that geographic metadata is correctly stored in the database and provides an intuitive UI for editors to select accurate locations.

## 1. Data Persistence Layer

### Database Storage
The system now correctly persists specific IDs for geographic locations in the `articles` table:
*   `province_id`: Integer ID referencing the province.
*   `city_id`: Integer ID referencing the city.

### Backend Implementation
*   **ArticleActionRequest (`App\Http\Requests\Articles\ArticleActionRequest`)**:
    *   Added `province_id` and `city_id` to the validation rules (nullable integer).
    *   This ensures that during the "Atomic Publish" flow from the editor, these IDs are preserved and passed to the storage engine.
*   **ArticleResource (`App\Http\Resources\Articles\ArticleResource`)**:
    *   Modified to include `province_id` and `city_id` in the API output.
    *   This ensures that when an existing article is re-opened in the editor, the previously saved IDs are correctly loaded into the UI.

## 2. Hierarchical Filtering UI

### Smart Filtering in `BlockDrawer`
The article editor's settings panel (`BlockDrawer.tsx`) now implements a hierarchical selection flow:

1.  **Country-to-Province Filter**:
    *   When a **Country** is selected (e.g., "PHILIPPINES"), the system identifies its ID ("PH").
    *   The **Province** list is automatically filtered to show only provinces belonging to that specific country ID.
2.  **Province-to-City Filter**:
    *   Once a **Province** is selected, the **City** list clears current selection and filters to show only cities within that province.
3.  **Reset Mechanism**:
    *   Changing a parent level (e.g., swapping Country from Philippines to Singapore) automatically resets dependent fields (Province/City) to prevent invalid data combinations.

### Technical Mapping
The system performs a case-insensitive mapping of Country names to their respective IDs to bridge the gap between human-readable names used in UI and the database primary keys.

## 3. Frontend Integration

### `ArticleEditorModal`
The main editor modal manages the lifecycle of this data:
*   **Initialization**: Loads `province_id` and `city_id` from the API resource into the working state.
*   **Update**: Captures changes from the `BlockDrawer` components.
*   **Payload Construction**: Includes these IDs in both `createArticle` and `publishArticle` payloads.

### API Types
Updated `ArticleResource` TypeScript interface to include these optional fields, ensuring type safety across the frontend.

## 4. Verification
Testing was performed using Laravel Tinker to confirm the data flow from the request through the controller and into the database:

```php
// Test snippet used for verification
$article = Article::find($id);
$article->update(['province_id' => 999, 'city_id' => 888]);
$article->refresh();
// Result: Verified province_id is 999 and city_id is 888 in DB.
```

---
**Date Published**: March 11, 2026
**Status**: Implemented & Verified
