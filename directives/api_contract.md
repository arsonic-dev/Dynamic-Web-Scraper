# API Contract — Dynamic Web Scraper SaaS Platform

**Version:** `v1`
**Status:** `Draft — Production Ready`
**Last Updated:** 2026-02-26
**Audience:** Frontend Engineers, Backend Engineers, AI Orchestration Layer

---

## 1. Base URL

| Environment | Base URL |
|---|---|
| Development | `http://localhost:8000/api/v1` |
| Staging | `https://staging-api.dynamicscraper.io/api/v1` |
| Production | `https://api.dynamicscraper.io/api/v1` |

All endpoints are prefixed with `/api/v1`.

---

## 2. Global Conventions

| Convention | Detail |
|---|---|
| Protocol | HTTPS (TLS 1.2+) |
| Content-Type | `application/json` for all request/response bodies |
| Encoding | UTF-8 |
| Timestamps | ISO 8601 UTC — `2026-02-26T07:22:06Z` |
| Pagination | Cursor-based (`next_cursor` / `prev_cursor`) |
| Auth Header | `Authorization: Bearer <token>` *(all endpoints)* |

---

## 3. Enum Definitions

### 3.1 `DataType`

```
products   — E-commerce product listings
jobs       — Job board listings
articles   — Blog posts, news, editorial content
custom     — User-defined field extraction schema
```

### 3.2 `JobStatus`

| Value | Terminal? | Description |
|---|---|---|
| `pending` | No | Job accepted, queued, not yet started |
| `running` | No | Actively scraping pages |
| `completed` | ✅ Yes | All pages scraped, results validated |
| `failed` | ✅ Yes | Unrecoverable error; see `error_message` |

---

## 4. Error Response Format

All errors — regardless of endpoint — use this envelope:

```json
{
  "success": false,
  "error_code": "STRING_CODE",
  "message": "Human-readable description of the error.",
  "details": {}
}
```

| Field | Type | Description |
|---|---|---|
| `success` | `boolean` | Always `false` on error |
| `error_code` | `string` | Machine-readable constant (see table below) |
| `message` | `string` | Human-readable explanation |
| `details` | `object` | Optional; field-level validation errors or extra context |

### 4.1 Standard Error Codes

| HTTP Status | `error_code` | Meaning |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Request body failed schema validation |
| `400` | `INVALID_URL` | Provided URL is malformed or unreachable |
| `401` | `UNAUTHORIZED` | Missing or invalid Bearer token |
| `403` | `FORBIDDEN` | Authenticated but lacks permission |
| `404` | `JOB_NOT_FOUND` | `job_id` does not exist for this user |
| `409` | `DUPLICATE_JOB` | Identical job already running for this URL |
| `422` | `UNPROCESSABLE_ENTITY` | Semantic validation failure |
| `429` | `RATE_LIMITED` | Too many requests; see `Retry-After` header |
| `500` | `INTERNAL_ERROR` | Unexpected server-side failure |
| `503` | `SCRAPER_UNAVAILABLE` | Scraping worker pool is saturated |

---

## 5. Endpoints

---

### 5.1 `POST /scrape` — Submit a Scraping Job

Start a new asynchronous scraping job. Returns immediately with a `job_id` to poll.

**Request**

```
POST /api/v1/scrape
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body Schema**

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `url` | `string` | ✅ | Valid HTTP/HTTPS URL, max 2048 chars | Target page to begin scraping from |
| `pages` | `integer` | ✅ | Min: `1`, Max: `500` | Number of pages to scrape (pagination depth) |
| `data_type` | `DataType` | ✅ | Enum: `products \| jobs \| articles \| custom` | Extraction template to apply |
| `headless` | `boolean` | ✅ | — | Use headless browser (Playwright) for JS-rendered pages |
| `custom_schema` | `object` | Conditional | Required when `data_type = custom` | Key-value map of field names to CSS selectors |
| `proxy` | `string` | ❌ | Valid HTTP proxy URL | Override default proxy for this job |
| `delay_ms` | `integer` | ❌ | Min: `0`, Max: `10000`, Default: `1000` | Milliseconds to wait between page requests |
| `notify_webhook` | `string` | ❌ | Valid HTTPS URL | Webhook URL to POST result to when job completes |

**Example Request**

```json
{
  "url": "https://example.com/products",
  "pages": 10,
  "data_type": "products",
  "headless": false,
  "delay_ms": 1500,
  "notify_webhook": "https://myapp.io/webhooks/scraper"
}
```

**Success Response — `202 Accepted`**

| Field | Type | Description |
|---|---|---|
| `success` | `boolean` | `true` |
| `job_id` | `string (UUID v4)` | Unique identifier for this job |
| `status` | `JobStatus` | Always `pending` at creation |
| `estimated_duration_seconds` | `integer` | Server estimate; null if unknown |
| `created_at` | `string (ISO 8601)` | UTC timestamp |
| `status_url` | `string` | Absolute URL to poll for status |

```json
{
  "success": true,
  "job_id": "e3a1b2c4-d56f-4a7b-8c9d-0e1f2a3b4c5d",
  "status": "pending",
  "estimated_duration_seconds": 45,
  "created_at": "2026-02-26T07:22:06Z",
  "status_url": "https://api.dynamicscraper.io/api/v1/status/e3a1b2c4-d56f-4a7b-8c9d-0e1f2a3b4c5d"
}
```

**Error Examples**

```json
// 400 — Invalid URL
{
  "success": false,
  "error_code": "INVALID_URL",
  "message": "The provided URL 'ftp://bad' is not a valid HTTP/HTTPS URL.",
  "details": { "field": "url" }
}
```

```json
// 400 — Validation failure
{
  "success": false,
  "error_code": "VALIDATION_ERROR",
  "message": "Request body failed validation.",
  "details": {
    "pages": "Must be between 1 and 500.",
    "data_type": "Must be one of: products, jobs, articles, custom."
  }
}
```

---

### 5.2 `GET /status/{job_id}` — Poll Job Status

Real-time status and progress of a scraping job. Poll until `status` is `completed` or `failed`.

**Request**

```
GET /api/v1/status/{job_id}
Authorization: Bearer <token>
```

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `job_id` | `string (UUID v4)` | Job identifier returned by `POST /scrape` |

**Success Response — `200 OK`**

| Field | Type | Nullable | Description |
|---|---|---|---|
| `success` | `boolean` | — | `true` |
| `job_id` | `string (UUID v4)` | — | Job identifier |
| `status` | `JobStatus` | — | Current lifecycle state |
| `progress_percentage` | `number (float)` | — | `0.0` – `100.0` |
| `pages_scraped` | `integer` | — | Pages successfully fetched so far |
| `pages_total` | `integer` | — | Total pages requested |
| `records_extracted` | `integer` | — | Raw records found so far |
| `started_at` | `string (ISO 8601)` | ✅ | `null` if still `pending` |
| `completed_at` | `string (ISO 8601)` | ✅ | `null` until terminal state |
| `error_message` | `string` | ✅ | Human-readable error; `null` unless `status = failed` |
| `result_url` | `string` | ✅ | Populated only when `status = completed` |

```json
// In-progress example
{
  "success": true,
  "job_id": "e3a1b2c4-d56f-4a7b-8c9d-0e1f2a3b4c5d",
  "status": "running",
  "progress_percentage": 40.0,
  "pages_scraped": 4,
  "pages_total": 10,
  "records_extracted": 87,
  "started_at": "2026-02-26T07:22:10Z",
  "completed_at": null,
  "error_message": null,
  "result_url": null
}
```

```json
// Completed example
{
  "success": true,
  "job_id": "e3a1b2c4-d56f-4a7b-8c9d-0e1f2a3b4c5d",
  "status": "completed",
  "progress_percentage": 100.0,
  "pages_scraped": 10,
  "pages_total": 10,
  "records_extracted": 214,
  "started_at": "2026-02-26T07:22:10Z",
  "completed_at": "2026-02-26T07:23:02Z",
  "error_message": null,
  "result_url": "https://api.dynamicscraper.io/api/v1/result/e3a1b2c4-d56f-4a7b-8c9d-0e1f2a3b4c5d"
}
```

```json
// Failed example
{
  "success": true,
  "job_id": "e3a1b2c4-d56f-4a7b-8c9d-0e1f2a3b4c5d",
  "status": "failed",
  "progress_percentage": 30.0,
  "pages_scraped": 3,
  "pages_total": 10,
  "records_extracted": 0,
  "started_at": "2026-02-26T07:22:10Z",
  "completed_at": "2026-02-26T07:22:45Z",
  "error_message": "CAPTCHA detected on page 4. Headless mode required.",
  "result_url": null
}
```

**Polling Recommendation**

| Job Age | Suggested Interval |
|---|---|
| `0–30s` | Every `2s` |
| `30s–5min` | Every `5s` |
| `5min+` | Every `15s` |
| `status = completed \| failed` | Stop polling |

---

### 5.3 `GET /result/{job_id}` — Get Validated Structured Results

Returns the validated, cleaned, quality-scored output of a completed job.
Only available when `status = completed`.

**Request**

```
GET /api/v1/result/{job_id}?preview_limit=10
Authorization: Bearer <token>
```

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `job_id` | `string (UUID v4)` | Job identifier |

**Query Parameters**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `preview_limit` | `integer` | `10` | Max records in `preview_data`; range `1–100` |

**Success Response — `200 OK`**

| Field | Type | Description |
|---|---|---|
| `success` | `boolean` | `true` |
| `job_id` | `string (UUID v4)` | Job identifier |
| `data_type` | `DataType` | Extraction type used |
| `total_records` | `integer` | Total raw records before validation |
| `clean_records` | `integer` | Records passing all validation rules |
| `duplicates_removed` | `integer` | Exact + near-duplicate records dropped |
| `missing_fields_fixed` | `integer` | Records that had fields inferred/imputed |
| `data_quality_score` | `number (float)` | `0.0` – `100.0`; composite quality metric |
| `quality_breakdown` | `object` | Per-dimension quality scores (see below) |
| `preview_data` | `array<object>` | First N clean records; schema varies by `data_type` |
| `download_url` | `string` | Absolute URL to download full CSV |
| `download_expires_at` | `string (ISO 8601)` | When the download link expires |
| `created_at` | `string (ISO 8601)` | When job was originally submitted |
| `completed_at` | `string (ISO 8601)` | When job reached `completed` state |

**`quality_breakdown` Object**

| Field | Type | Description |
|---|---|---|
| `completeness` | `float` | % of expected fields present |
| `uniqueness` | `float` | % of records that are non-duplicate |
| `validity` | `float` | % of records passing type/format rules |
| `consistency` | `float` | % of records consistent with schema |

**`preview_data` Item Schema — `data_type: products`**

| Field | Type | Nullable |
|---|---|---|
| `record_id` | `string` | — |
| `title` | `string` | — |
| `price` | `number (float)` | ✅ |
| `currency` | `string (ISO 4217)` | ✅ |
| `rating` | `number (float)` | ✅ |
| `review_count` | `integer` | ✅ |
| `image_url` | `string` | ✅ |
| `product_url` | `string` | — |
| `scraped_at` | `string (ISO 8601)` | — |

**`preview_data` Item Schema — `data_type: jobs`**

| Field | Type | Nullable |
|---|---|---|
| `record_id` | `string` | — |
| `title` | `string` | — |
| `company` | `string` | ✅ |
| `location` | `string` | ✅ |
| `remote` | `boolean` | ✅ |
| `salary_range` | `string` | ✅ |
| `job_type` | `string` | ✅ |
| `posted_at` | `string (ISO 8601)` | ✅ |
| `job_url` | `string` | — |
| `scraped_at` | `string (ISO 8601)` | — |

**`preview_data` Item Schema — `data_type: articles`**

| Field | Type | Nullable |
|---|---|---|
| `record_id` | `string` | — |
| `title` | `string` | — |
| `author` | `string` | ✅ |
| `published_at` | `string (ISO 8601)` | ✅ |
| `summary` | `string` | ✅ |
| `tags` | `array<string>` | ✅ |
| `article_url` | `string` | — |
| `scraped_at` | `string (ISO 8601)` | — |

**`preview_data` Item Schema — `data_type: custom`**

Dynamic. Keys correspond to the field names defined in `custom_schema` at job creation. All values are `string | null`.

**Example Response**

```json
{
  "success": true,
  "job_id": "e3a1b2c4-d56f-4a7b-8c9d-0e1f2a3b4c5d",
  "data_type": "products",
  "total_records": 214,
  "clean_records": 198,
  "duplicates_removed": 11,
  "missing_fields_fixed": 5,
  "data_quality_score": 92.5,
  "quality_breakdown": {
    "completeness": 96.2,
    "uniqueness": 94.8,
    "validity": 98.1,
    "consistency": 91.0
  },
  "preview_data": [
    {
      "record_id": "rec_001",
      "title": "Wireless Noise-Cancelling Headphones",
      "price": 149.99,
      "currency": "USD",
      "rating": 4.6,
      "review_count": 2341,
      "image_url": "https://example.com/images/headphones.jpg",
      "product_url": "https://example.com/products/headphones-pro",
      "scraped_at": "2026-02-26T07:22:55Z"
    }
  ],
  "download_url": "https://api.dynamicscraper.io/api/v1/download/e3a1b2c4-d56f-4a7b-8c9d-0e1f2a3b4c5d",
  "download_expires_at": "2026-02-27T07:23:02Z",
  "created_at": "2026-02-26T07:22:06Z",
  "completed_at": "2026-02-26T07:23:02Z"
}
```

**Error — Job Not Yet Complete**

```json
{
  "success": false,
  "error_code": "JOB_NOT_COMPLETE",
  "message": "Job e3a1b2c4 is still running. Poll /status/{job_id} and retry when status is 'completed'.",
  "details": { "current_status": "running" }
}
```

---

### 5.4 `GET /history` — List Job History

Paginated list of all scraping jobs for the authenticated user.

**Request**

```
GET /api/v1/history?status=completed&limit=20&cursor=<cursor_token>
Authorization: Bearer <token>
```

**Query Parameters**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `status` | `JobStatus` | *(all)* | Filter by job status |
| `data_type` | `DataType` | *(all)* | Filter by extraction type |
| `limit` | `integer` | `20` | Records per page; range `1–100` |
| `cursor` | `string` | *(first page)* | Opaque pagination cursor |
| `sort` | `string` | `created_at:desc` | Field + direction: `created_at:asc \| created_at:desc` |

**Success Response — `200 OK`**

| Field | Type | Description |
|---|---|---|
| `success` | `boolean` | `true` |
| `jobs` | `array<JobSummary>` | List of job summary objects |
| `total_count` | `integer` | Total matching jobs (regardless of pagination) |
| `next_cursor` | `string \| null` | Cursor to fetch next page; `null` at last page |
| `prev_cursor` | `string \| null` | Cursor to fetch previous page; `null` at first page |

**`JobSummary` Object**

| Field | Type | Nullable | Description |
|---|---|---|---|
| `job_id` | `string (UUID v4)` | — | — |
| `url` | `string` | — | Original target URL |
| `data_type` | `DataType` | — | — |
| `status` | `JobStatus` | — | — |
| `pages_scraped` | `integer` | — | — |
| `pages_total` | `integer` | — | — |
| `records_extracted` | `integer` | — | Clean records in final output |
| `data_quality_score` | `number (float)` | ✅ | `null` if not yet completed |
| `created_at` | `string (ISO 8601)` | — | — |
| `completed_at` | `string (ISO 8601)` | ✅ | `null` if not terminal |

**Example Response**

```json
{
  "success": true,
  "jobs": [
    {
      "job_id": "e3a1b2c4-d56f-4a7b-8c9d-0e1f2a3b4c5d",
      "url": "https://example.com/products",
      "data_type": "products",
      "status": "completed",
      "pages_scraped": 10,
      "pages_total": 10,
      "records_extracted": 198,
      "data_quality_score": 92.5,
      "created_at": "2026-02-26T07:22:06Z",
      "completed_at": "2026-02-26T07:23:02Z"
    },
    {
      "job_id": "f4b2c3d5-e67a-4b8c-9d0e-1f2a3b4c5d6e",
      "url": "https://careers.acme.io/jobs",
      "data_type": "jobs",
      "status": "failed",
      "pages_scraped": 3,
      "pages_total": 5,
      "records_extracted": 0,
      "data_quality_score": null,
      "created_at": "2026-02-25T14:10:00Z",
      "completed_at": "2026-02-25T14:10:45Z"
    }
  ],
  "total_count": 47,
  "next_cursor": "eyJsYXN0X2lkIjoiZjRiMmMzZDUiLCJkaXJlY3Rpb24iOiJuZXh0In0=",
  "prev_cursor": null
}
```

---

### 5.5 `GET /download/{job_id}` — Download CSV

Stream or redirect to a signed CSV export of the job's clean records.
Only available for jobs with `status = completed`.

**Request**

```
GET /api/v1/download/{job_id}
Authorization: Bearer <token>
```

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `job_id` | `string (UUID v4)` | Job identifier |

**Success Response — `302 Found`**

Redirects to a time-limited, pre-signed object storage URL.

```
HTTP/1.1 302 Found
Location: https://storage.dynamicscraper.io/exports/e3a1b2c4.csv?sig=<signed_token>&expires=1740556800
Content-Disposition: attachment; filename="scraper_export_e3a1b2c4_20260226.csv"
```

The CSV file itself is streamed directly from storage with:

```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="scraper_export_{job_id}_{date}.csv"
```

**CSV Structure**

Row 1 is a header row. Columns match the fields in `preview_data` for the corresponding `data_type`.

**Download Link Expiry**

Download URLs expire **24 hours** after job completion. After expiry, re-request via `GET /result/{job_id}` to get a refreshed `download_url`.

**Error — Link Expired**

```json
{
  "success": false,
  "error_code": "DOWNLOAD_EXPIRED",
  "message": "The download link for job e3a1b2c4 has expired. Request a new link via GET /result/{job_id}.",
  "details": { "expired_at": "2026-02-27T07:23:02Z" }
}
```

---

## 6. Rate Limits

| Endpoint | Limit |
|---|---|
| `POST /scrape` | 10 requests / minute per user |
| `GET /status/{job_id}` | 60 requests / minute per user |
| `GET /result/{job_id}` | 30 requests / minute per user |
| `GET /history` | 20 requests / minute per user |
| `GET /download/{job_id}` | 5 requests / minute per user |

When rate limited, the response includes:
```
HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1740643200
```

---

## 7. Webhook Payload (on completion)

When `notify_webhook` is set, the server sends a `POST` to that URL on job completion or failure.

```json
{
  "event": "job.completed",
  "job_id": "e3a1b2c4-d56f-4a7b-8c9d-0e1f2a3b4c5d",
  "status": "completed",
  "result_url": "https://api.dynamicscraper.io/api/v1/result/e3a1b2c4-d56f-4a7b-8c9d-0e1f2a3b4c5d",
  "download_url": "https://api.dynamicscraper.io/api/v1/download/e3a1b2c4-d56f-4a7b-8c9d-0e1f2a3b4c5d",
  "timestamp": "2026-02-26T07:23:02Z"
}
```

Webhook deliveries include a signature header for verification:
```
X-Scraper-Signature: sha256=<hmac_hex>
```

---

## 8. Changelog

| Version | Date | Change |
|---|---|---|
| `v1.0` | 2026-02-26 | Initial contract definition |
