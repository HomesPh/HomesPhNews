# Scraper Manual Controls — Implementation Plan

## Overview

Add manual ON/OFF controls, loading states, result feedback, and targeted scraping (per country + category) to the AutoNews Configuration page (`/admin/autonews`). Currently these controls only exist on the Articles admin page.

---

## Features to Implement

1. **Global Scraper ON/OFF + Run Now** — on the autonews page (reuse existing `ScraperControlPanel`)
2. **Loading state** — while scraper is turning on / running
3. **Post-scrape results** — show what was crawled immediately after finishing
4. **Quick is_active toggle** — per country card and per category card (no modal needed)
5. **Per-country Scrape button** — run scraper for a specific country
6. **Manual Scrape tab** — select specific countries + categories and trigger a targeted run

---

## Backend Changes

### `Script/main.py`

Add a new endpoint for targeted scraping:

```python
POST /trigger/targeted
Body: { "countries": ["Philippines", "Singapore"], "categories": ["Community"] }
Returns: TriggerScraperResponse (synchronous — waits for all combinations to finish)
Raises: 409 if a job is already running
```

Also verify `/trigger/cancel` exists (referenced in client but not visible in `main.py`). Add if missing:
```python
POST /trigger/cancel
Calls: request_job_cancel()
Returns: { "message": "...", "cancelled": true }
```

---

### `Script/scheduler.py`

Add new function `run_targeted_job`:

```python
async def run_targeted_job(countries: list[str], categories: list[str]) -> dict:
    """
    Runs process_single_country() for each country×category pair in parallel.
    Returns same structure as run_hourly_job but does NOT update the global job_status.
    """
    # Uses existing ThreadPoolExecutor + process_single_country(country, category)
    # Calculates success_count, error_count, duration_seconds, results
```

**Key:** Reuses existing `process_single_country(country, category)` at `scheduler.py:286`.

---

## Client API Changes

### `client/lib/api-v2/admin/service/scraperRun/triggerScraper.ts`

Add new exported function:

```typescript
export async function triggerTargetedScraper(
    countries: string[],
    categories: string[]
): Promise<TriggerScraperResponse> {
    // POST /trigger/targeted
    // timeout: 30 minutes (shorter than full run)
}
```

---

## Client UI Changes

### `client/app/admin/autonews/page.tsx`

- Import and render `ScraperControlPanel` **above the tabs** (from `client/components/features/admin/articles/ScraperControlPanel.tsx`)
- Add a 4th tab: **"Manual Scrape"** (icon: `Zap` from lucide-react)

```tsx
// Above tabs
<ScraperControlPanel />

// 4th tab
<TabsTrigger value="manual-scrape">
    <Zap className="w-4 h-4" />
    <span>Manual Scrape</span>
</TabsTrigger>

<TabsContent value="manual-scrape">
    <ManualScrapePanel />
</TabsContent>
```

---

### `client/components/features/admin/autonews/CountryList.tsx`

Add two new controls to each country card:

**1. Quick Toggle Button** (is_active ON/OFF):
- Calls `updateCountry(id, { ...country, is_active: !country.is_active })`
- Shows `Loader2` spinner while saving
- Updates local state on success (no full refetch needed)
- Visual: green badge = Active, gray badge = Paused

**2. Scrape Button** (per country):
- Calls `triggerTargetedScraper([country.name], allActiveCategories)`
- Shows loading spinner while running (can take 30–60 seconds)
- Shows inline result chip after completion: `✓ 1 article` or `✗ Error`
- One scrape at a time per card (button disabled while running)

```tsx
// Example card footer
<div className="flex justify-between items-center gap-2 border-t pt-4">
    <ToggleButton country={country} onToggle={handleToggle} />
    <div className="flex gap-2">
        <ScrapeButton country={country} categories={activeCategories} />
        <EditButton ... />
        <DeleteButton ... />
    </div>
</div>
```

---

### `client/components/features/admin/autonews/CategoryList.tsx`

Add a **Quick Toggle Button** (is_active ON/OFF) to each category card:
- Calls `updateCategory(id, { ...category, is_active: !category.is_active })`
- Shows spinner while saving
- Same visual pattern as country toggle

---

### New: `client/components/features/admin/autonews/ManualScrapePanel.tsx`

New component for the "Manual Scrape" tab:

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Manual Scrape                                       │
│  Select countries and categories, then hit Scrape.  │
├───────────────────────┬─────────────────────────────┤
│  Countries            │  Categories                  │
│  [Select All] [None]  │  [Select All] [None]         │
│  ☑ Philippines        │  ☑ Community                 │
│  ☑ Singapore          │  ☑ Labor & Employment        │
│  ☐ UAE                │  ☐ Healthcare                │
│  ...                  │  ...                         │
├───────────────────────┴─────────────────────────────┤
│  [▶ Scrape X countries × Y categories]              │
└─────────────────────────────────────────────────────┘
```

**Loading state** (while scraping):
```
⏳ Scraping 2 countries × 1 category (2 combinations)...
[animated progress bar or pulse]
```

**Results panel** (after completion):
```
✓ Scrape complete — 2 articles | 0 errors | took 45s
┌───────────────┬───────────────┬──────────┬───────────────────────┐
│ Country       │ Category      │ Status   │ Article               │
├───────────────┼───────────────┼──────────┼───────────────────────┤
│ Philippines   │ Community     │ ✓ Done   │ "OFW reunites with..." │
│ Singapore     │ Community     │ ✓ Done   │ "Pinoy workers in..." │
└───────────────┴───────────────┴──────────┴───────────────────────┘
```

**State management:**
```typescript
const [selectedCountries, setSelectedCountries] = useState<string[]>(
    countries.filter(c => c.is_active).map(c => c.name)
);
const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories.filter(c => c.is_active).map(c => c.name)
);
const [isScraping, setIsScraping] = useState(false);
const [scrapeResult, setScrapeResult] = useState<TriggerScraperResponse | null>(null);
const [scrapeError, setScrapeError] = useState<string | null>(null);
```

---

## File Summary

| File | Action |
|---|---|
| `Script/main.py` | Add `POST /trigger/targeted` + verify `/trigger/cancel` |
| `Script/scheduler.py` | Add `run_targeted_job(countries, categories)` function |
| `client/lib/api-v2/admin/service/scraperRun/triggerScraper.ts` | Add `triggerTargetedScraper()` |
| `client/components/features/admin/autonews/CountryList.tsx` | Add toggle + scrape buttons |
| `client/components/features/admin/autonews/CategoryList.tsx` | Add toggle button |
| `client/app/admin/autonews/page.tsx` | Add `ScraperControlPanel` + "Manual Scrape" tab |
| `client/components/features/admin/autonews/ManualScrapePanel.tsx` | **New file** |

---

## Reused Existing Code

| Utility | Location |
|---|---|
| `process_single_country(country, category)` | `Script/scheduler.py:286` |
| `ScraperControlPanel` component | `client/components/features/admin/articles/ScraperControlPanel.tsx` |
| `getCountries()` / `getCategories()` | `client/lib/api-v2` |
| `updateCountry()` / `updateCategory()` | `client/lib/api-v2` |
| `TriggerScraperResponse` interface | `client/lib/api-v2/admin/service/scraperRun/triggerScraper.ts` |

---

## Testing Checklist

- [ ] `/admin/autonews` shows `ScraperControlPanel` above tabs (scheduler ON/OFF, Run Now, status)
- [ ] Countries tab: each card has a toggle button that flips `is_active` without a modal
- [ ] Countries tab: each card has a "Scrape" button that shows loading, then shows result inline
- [ ] Categories tab: each card has a toggle button that flips `is_active`
- [ ] "Manual Scrape" tab renders with country + category checklists
- [ ] Countries pre-checked based on `is_active`; categories pre-checked based on `is_active`
- [ ] Deselect all except Philippines + one category → click "Scrape Selected"
- [ ] Loading indicator shows during scraping
- [ ] Results table appears after completion with country, category, status, article title
- [ ] `POST /trigger/targeted` tested via `/docs` with specific body
- [ ] 409 returned if a full job is already running when targeted scrape is triggered
