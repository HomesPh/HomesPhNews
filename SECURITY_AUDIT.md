# Security Audit Report

**Project:** HomesPh News Platform  
**Audit Date:** February 2, 2026  
**Auditor:** Automated Security Analysis  

## Executive Summary

This security audit covers the three main components of the HomesPh News platform:
- **Client** - Next.js (React) frontend application
- **Server** - Laravel (PHP) backend API
- **Script** - Python FastAPI news scraper and AI processor

The audit identifies potential security concerns and recommendations for each component.

---

## Client Security Findings (Next.js/React)

| # | Severity | Finding | File/Location | Description | Recommendation |
|---|----------|---------|---------------|-------------|----------------|
| C1 | Medium | Token Storage in localStorage | `client/lib/api-v2/admin/store.ts:65` | Authentication tokens are stored in localStorage using Zustand persist middleware. localStorage is vulnerable to XSS attacks. | Consider using httpOnly cookies for token storage, or implement additional XSS protections. Use secure session management. |
| C2 | Low | SVG Allowed in Images | `client/next.config.ts:6` | `dangerouslyAllowSVG: true` is enabled, which can expose the app to SVG-based XSS attacks if untrusted SVG content is loaded. | Only enable this if SVG sources are fully trusted. Consider implementing Content-Security-Policy headers. |
| C3 | Low | Remote Image Patterns | `client/next.config.ts:7-24` | Multiple remote image domains are allowed. If any of these domains are compromised, malicious content could be served. | Ensure all remote domains are trusted and implement Content-Security-Policy for images. |
| C4 | Info | API URL from Environment | `client/lib/api-v2/admin/axios-instance.ts:7` | API URL is configured via environment variable with fallback to localhost. | Ensure production deployments use HTTPS for API URLs. Current implementation is standard practice. |
| C5 | Info | Credentials Included | `client/lib/api-v2/admin/axios-instance.ts:17` | `withCredentials: true` is set for cross-origin requests. | Ensure CORS is properly configured on the server to only allow trusted origins. |
| C6 | Low | No Token Expiry Handling | `client/lib/api-v2/admin/store.ts` | No mechanism to handle token expiry or refresh tokens. | Implement token refresh mechanism or automatic logout on token expiry. |

---

## Server Security Findings (Laravel/PHP)

| # | Severity | Finding | File/Location | Description | Recommendation |
|---|----------|---------|---------------|-------------|----------------|
| S1 | Medium | CORS Overly Permissive | `server/config/cors.php:20-21` | `allowed_methods` and `allowed_headers` are set to `['*']` which allows all methods and headers. | Restrict to only necessary HTTP methods (GET, POST, PATCH, DELETE) and required headers. |
| S2 | Low | Debug Mode in Example | `server/.env.example:4` | `APP_DEBUG=true` is set in the example file. If used in production, detailed error messages could leak sensitive information. | Ensure production uses `APP_DEBUG=false`. Add documentation warning. |
| S3 | Medium | Empty Database Password | `server/.env.example:28` | `DB_PASSWORD=` is empty in the example file. | Require strong database passwords in production. Update example with placeholder. |
| S4 | High | Public Redis/DB Test Endpoints | `server/routes/api.php:30-31` | `/redis-test` and `/db-test` endpoints are publicly accessible without authentication. These could expose internal infrastructure information. | Add authentication middleware or remove these endpoints in production. |
| S5 | Medium | No Token Expiration | `server/config/sanctum.php:50` | Sanctum token expiration is set to `null` (never expires). | Set a reasonable token expiration time (e.g., 60-1440 minutes). |
| S6 | Low | Login Throttling Only | `server/routes/api.php:34` | Only the login route has throttle middleware. Other endpoints could be vulnerable to rate limiting attacks. | Apply rate limiting to other sensitive endpoints (subscription, view increment). |
| S7 | Medium | SQL Injection Potential | `server/app/Http/Controllers/Api/Admin/ArticleController.php:49` | Search functionality uses LIKE with user input: `"%{$s}%"`. While Laravel escapes this, pattern is worth noting. | Consider using full-text search or parameterized queries with explicit binding. |
| S8 | Low | Sensitive Info in Logs | `server/app/Http/Controllers/Api/AuthController.php:23` | Login attempts are logged with email address. | Consider anonymizing or hashing email in logs for privacy. |
| S9 | Low | Origin Validation Bypass | `server/app/Http/Middleware/VerifySiteApiKey.php:34-45` | Origin validation only runs in production. Development mode allows any origin. | Document this behavior and ensure proper environment detection. |
| S10 | Medium | UUID Not Validated | `server/app/Http/Controllers/Api/Admin/ArticleController.php:259-260` | Article ID format check allows non-UUID IDs through to database query without validation. | Add consistent UUID validation for all article ID inputs. |
| S11 | Low | Mass Assignment Risk | `server/app/Models/User.php:21-26` | `is_admin` is in the fillable array, which could allow privilege escalation if user registration is added. | Remove `is_admin` from fillable or implement additional guards. |
| S12 | Info | Request Validation | Multiple request files | All request classes properly validate input using Laravel's validation system. | Good practice. Continue using Form Requests for input validation. |

---

## Script Security Findings (Python/FastAPI)

| # | Severity | Finding | File/Location | Description | Recommendation |
|---|----------|---------|---------------|-------------|----------------|
| P1 | High | CORS Allow All Origins | `Script/main.py:102-108` | CORS middleware allows all origins with `allow_origins=["*"]` and `allow_credentials=True`. This is a security anti-pattern. | Restrict CORS to specific allowed origins. Never use `*` with `allow_credentials=True`. |
| P2 | Medium | No Authentication | `Script/routes.py` | All API endpoints are publicly accessible without authentication. Delete and clear-all endpoints could cause data loss. | Add API key authentication or token-based auth for admin endpoints. |
| P3 | Medium | Destructive Endpoints Public | `Script/routes.py:73-93` | `/articles/{id}` DELETE and `/articles/clear-all` POST endpoints can delete data without authentication. | Require authentication for all destructive operations. |
| P4 | Medium | Trigger Endpoint Public | `Script/main.py:142-151` and `Script/routes.py:226-260` | Manual trigger endpoints for the scraper are publicly accessible. Could be abused for resource exhaustion. | Add authentication or rate limiting to trigger endpoints. |
| P5 | Low | Cloud Credentials in Environment | `Script/storage.py:44-46, 65-66` | AWS and GCP credentials are loaded from environment variables. | Ensure credentials are never committed to version control. Use secrets management in production. |
| P6 | Low | Cache File on Disk | `Script/scraper.py:25` | Scraper cache is stored in `scraper_cache.json` on disk. | Ensure cache file has proper permissions and is excluded from version control. |
| P7 | Low | User-Agent Spoofing | `Script/config.py:62` | Custom user-agent string is used for web scraping. | Ensure compliance with target websites' robots.txt and terms of service. |
| P8 | Info | API Key Validation | `Script/ai_service.py:36-43` | Google AI API key is properly loaded from environment. | Good practice. Continue using environment variables for secrets. |
| P9 | Medium | No Input Validation | `Script/routes.py:64-70, 97-108` | Path parameters like `article_id`, `country`, and `category` are not validated before use in Redis keys. | Add input validation and sanitization for all user inputs. |
| P10 | Low | Error Messages Expose Details | `Script/storage.py:239-240, 95-97` | Error messages may expose internal details like bucket names and paths. | Sanitize error messages in production to avoid information disclosure. |
| P11 | Info | Image Generation Prompt | `Script/ai_service.py:254-272` | AI prompts are constructed from article content. | Ensure AI-generated content is reviewed before publication to prevent prompt injection issues. |
| P12 | Medium | No Rate Limiting | `Script/main.py` | No rate limiting on any endpoints. | Implement rate limiting to prevent abuse and resource exhaustion. |

---

## Summary by Severity

### Critical (0)
No critical vulnerabilities identified.

### High (2)
| Component | Finding | Action Required |
|-----------|---------|-----------------|
| Script | P1 - CORS Allow All Origins | Restrict CORS to specific origins |
| Server | S4 - Public Redis/DB Test Endpoints | Add authentication or remove in production |

### Medium (9)
| Component | Finding | Action Required |
|-----------|---------|-----------------|
| Client | C1 - Token Storage in localStorage | Improve token storage security |
| Server | S1 - CORS Overly Permissive | Restrict allowed methods/headers |
| Server | S3 - Empty Database Password | Enforce strong passwords |
| Server | S5 - No Token Expiration | Set token expiration |
| Server | S7 - SQL Injection Potential | Review query patterns |
| Server | S10 - UUID Not Validated | Add consistent validation |
| Script | P2 - No Authentication | Add authentication |
| Script | P3 - Destructive Endpoints Public | Require auth for destructive ops |
| Script | P4 - Trigger Endpoint Public | Add auth/rate limiting |
| Script | P9 - No Input Validation | Add input validation |
| Script | P12 - No Rate Limiting | Implement rate limiting |

### Low (11)
| Component | Count | Examples |
|-----------|-------|----------|
| Client | 3 | SVG allowed, remote patterns, no token expiry handling |
| Server | 6 | Debug mode, login logging, origin bypass, mass assignment |
| Script | 4 | Credentials in env, cache file, user-agent, error messages |

### Informational (5)
| Component | Count | Examples |
|-----------|-------|----------|
| Client | 2 | API URL config, credentials included |
| Server | 1 | Request validation (positive) |
| Script | 2 | API key validation (positive), AI prompts |

---

## Recommendations by Priority

### Immediate Actions (High Priority)
1. **Restrict Python Script CORS** - Change from `allow_origins=["*"]` to specific allowed domains
2. **Secure or Remove System Test Endpoints** - Add authentication to `/redis-test` and `/db-test` or remove them
3. **Add Authentication to Script Admin Endpoints** - Protect DELETE, trigger, and clear-all endpoints

### Short-Term Actions (Medium Priority)
4. **Implement Token Expiration** - Set reasonable expiration for Sanctum tokens
5. **Add Rate Limiting** - Apply to all public endpoints across all components
6. **Restrict CORS Headers/Methods** - Only allow necessary HTTP methods and headers
7. **Add Input Validation to Python Routes** - Validate path parameters before use
8. **Review Token Storage Strategy** - Consider httpOnly cookies instead of localStorage

### Long-Term Actions (Low Priority)
9. **Audit External Image Sources** - Regularly review trusted image domains
10. **Implement Content-Security-Policy** - Add CSP headers for XSS protection
11. **Review Logging Practices** - Ensure no sensitive data in logs
12. **Documentation Updates** - Add security hardening guide for production deployment

---

## Dependencies Security Status

### Client (npm packages)
| Package | Version | Status |
|---------|---------|--------|
| next | ^16.1.6 | Current |
| react | 19.2.3 | Current |
| axios | ^1.13.4 | Current |
| zustand | ^5.0.10 | Current |

### Server (Composer packages)
| Package | Version | Status |
|---------|---------|--------|
| laravel/framework | ^12.0 | Current |
| laravel/sanctum | ^4.2 | Current |
| predis/predis | ^3.3 | Current |

### Script (Python packages)
| Package | Version | Status |
|---------|---------|--------|
| fastapi | 0.109.0 | Current |
| uvicorn | 0.27.0 | Current |
| redis | 7.1.0 | Current |
| requests | 2.32.5 | Current |

**Recommendation:** Regularly update dependencies and use tools like `npm audit`, `composer audit`, and `pip-audit` to check for known vulnerabilities.

---

## Conclusion

The HomesPh News platform has a generally solid security foundation with proper use of Laravel Sanctum for authentication, input validation through Form Requests, and proper credential management via environment variables. However, there are several areas requiring attention:

1. **The Python Script component** has the most significant security gaps, particularly around CORS configuration and lack of authentication for admin endpoints.
2. **The Server component** has some configuration issues that should be addressed, particularly around test endpoints and token management.
3. **The Client component** has minor concerns around token storage that could be improved.

Following the prioritized recommendations above will significantly improve the overall security posture of the application.
