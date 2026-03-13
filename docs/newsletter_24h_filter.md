# Newsletter 24-Hour Filter

## Overview
This change addresses the issue where the daily newsletter was resending the same news articles if no new content had been published since the last broadcast.

## Implementation Details
The `newsletter:send` command and the `newsletter:test` command have been updated to filter articles based on their publication timestamp.

### Changes in `SendDailyNewsletter` Command
The query for fetching articles now includes a constraint to only retrieve articles published within the last 24 hours. 

```php
// app/Console/Commands/SendDailyNewsletter.php
$articles = Article::whereIn('category', $subscriber->category)
    ->whereIn('country', $subscriber->country)
    ->where('status', 'published')
    ->where('published_at', '>=', now()->subDay()) // New filter
    ->latest('published_at')
    ->limit(5)
    ->get();
```

### Changes in Test Command
The `newsletter:test {email}` command in `routes/console.php` has been updated to match this logic for consistency during testing.

## Impact
- **Subscribers** will only receive news that was published in the last 24 hours.
- **Deduplication**: If no news matches a subscriber's preference within the last 24 hours, no email will be sent, preventing redundant notifications.
- **Ordering**: Articles are now explicitly ordered by `published_at` to ensure the most recent news is featured first.
