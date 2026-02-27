# ⏰ Global Scheduler Endpoint

This endpoint serves as a remote trigger for the Laravel task scheduler. It allows external services (like Google Cloud Scheduler, EasyCron, or a separate worker) to execute the application's scheduled tasks over HTTP.

## Endpoint
**GET** `/api/scheduler/run`

## Description
Triggers the `php artisan schedule:run` command on the server. This is essential for environments like Google Cloud Run or Docker, where running a persistent background cron daemon is not possible.

## Usage
This endpoint should be called every minute by an external scheduler.

### Request:

GET [https://news.homes.ph/api/scheduler/run](https://news.homes.ph/api/scheduler/run) HTTP/1.1
Content-Type: application/json

### Response Example:
```json
{
    "message": "Schedule executed",
    "output": "Running scheduled command: App\\Console\\Commands\\NewsletterSend..."
}
```

---
*Note: This route is defined in `server/routes/api.php`.*
