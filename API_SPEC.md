# API Endpoint Specification

## Endpoint: GET /api/staff

Returns a list of staff profiles from Airtable.

### Request

```
GET /api/staff HTTP/1.1
Host: localhost:5173 (or your production domain)
Accept: application/json
```

### Response: Success (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "recABCD1234",
      "name": "Ren",
      "bio": "From iconic anime neighborhoods to hidden figure shops and retro arcades, Ren knows where fandom comes to life.",
      "role": "Anime & gaming specialist",
      "tags": [
        "Anime",
        "Gaming",
        "Akihabara"
      ],
      "photo": "https://dl.airtable.com/...path.../filename.jpg"
    },
    {
      "id": "recEFGH5678",
      "name": "Mika",
      "bio": "Explore Tokyo's independent labels, vintage stores, streetwear corners and the people shaping local style.",
      "role": "Fashion & street culture",
      "tags": [
        "Fashion",
        "Vintage",
        "Streetwear"
      ],
      "photo": "https://dl.airtable.com/...path.../mika.jpg"
    }
  ]
}
```

### Response: Error - Missing Configuration (500 Internal Server Error)

```json
{
  "success": false,
  "error": "Missing Airtable credentials: AIRTABLE_TOKEN and AIRTABLE_BASE_ID are required"
}
```

### Response: Error - Invalid Token (401 Unauthorized)

```json
{
  "success": false,
  "error": "Airtable authentication failed. Check your token."
}
```

### Response: Error - Base/Table Not Found (404 Not Found)

```json
{
  "success": false,
  "error": "Airtable base or table not found."
}
```

### Response: Error - Generic API Error (500 Internal Server Error)

```json
{
  "success": false,
  "error": "Airtable API error: 429 Too Many Requests"
}
```

## Data Field Specifications

### Response Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| success | boolean | yes | Always present; `true` on success, `false` on error |
| data | array | conditional | Array of staff objects (only when success=true) |
| error | string | conditional | Error message (only when success=false) |

### Staff Object Schema

| Field | Type | Example | Source |
|-------|------|---------|--------|
| id | string | "recABCD1234" | Airtable record ID (auto) |
| name | string | "Ren" | From Airtable `name` field |
| bio | string | "From iconic anime..." | From Airtable `bio` field |
| role | string | "Anime & gaming specialist" | From Airtable `role` field |
| tags | array[string] | ["Anime", "Gaming"] | Split from Airtable `tags` field |
| photo | string (URL) | "https://..." | URL of first photo in Airtable `photo` field |

## Airtable Table Requirements

**Table Name:** `Staff`

| Airtable Field | Type | Required | Notes |
|----------------|------|----------|-------|
| name | Single line text | Yes | Staff member's full name |
| bio | Long text | Yes | Biography or role description |
| role | Single line text | Yes | Job title or specialization |
| tags | Single line text | Yes | Comma-separated values (e.g., "Anime, Gaming, Culture") |
| photo | Attachments | Yes | Upload at least one image; first image used |

### Example Airtable Record

| Field | Value |
|-------|-------|
| name | Ren |
| bio | From iconic anime neighborhoods to hidden figure shops and retro arcades, Ren knows where fandom comes to life. |
| role | Anime & gaming specialist |
| tags | Anime, Gaming, Akihabara |
| photo | (image file uploaded) |

## Normalization Logic

The API processes raw Airtable records as follows:

```javascript
const normalizeStaffRecord = (record) => {
  const fields = record.fields || {};
  return {
    // Use Airtable's unique record ID
    id: record.id,
    
    // Direct field mapping with defaults
    name: fields.name || '',
    bio: fields.bio || '',
    role: fields.role || '',
    
    // Split comma-separated tags, trim whitespace, remove empty strings
    tags: (fields.tags || '')
      .split(',')                    // Split by comma
      .map(tag => tag.trim())        // Remove leading/trailing whitespace
      .filter(Boolean),              // Remove empty strings
    
    // Extract first attachment URL, fallback to null
    photo: fields.photo?.[0]?.url || null,
  };
};
```

### Examples

**Input:**
```json
{
  "id": "recABCD1234",
  "fields": {
    "name": "Ren",
    "bio": "Anime expert",
    "role": "Specialist",
    "tags": "  Anime  ,  Gaming  , Akihabara  ",
    "photo": [
      {
        "id": "attXXX",
        "url": "https://...",
        "filename": "ren.jpg"
      }
    ]
  }
}
```

**Output:**
```json
{
  "id": "recABCD1234",
  "name": "Ren",
  "bio": "Anime expert",
  "role": "Specialist",
  "tags": ["Anime", "Gaming", "Akihabara"],
  "photo": "https://..."
}
```

## Caching Behavior

| Scenario | Behavior |
|----------|----------|
| First request | Fetches from Airtable, caches result, returns data |
| Request < 5 min later | Returns cached data without calling Airtable |
| Request > 5 min later | Cache expired, fetches fresh data, updates cache |
| Airtable error | Returns error response with `success: false` |
| No cache & error | Error returned immediately |

### Cache Duration
- **Duration:** 5 minutes (300,000 milliseconds)
- **Configurable:** Modify `CACHE_DURATION` in `/api/staff.js`
- **Per-process:** Cache is in-memory; resets on deployment

## CORS Headers

The endpoint includes CORS headers for cross-origin requests:

```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,OPTIONS
Access-Control-Allow-Headers: Content-Type
```

This allows the frontend (any domain) to fetch staff data.

## Rate Limiting

Airtable API rate limits:
- **Free plan:** 5 requests/second
- **Paid plans:** 30 requests/second

The 5-minute cache effectively reduces calls to ~1 request per 5 minutes per user, well within limits.

## Error Codes

| HTTP Status | Condition | Recovery |
|-------------|-----------|----------|
| 200 | Success | Data returned |
| 405 | Method not GET | Only GET is supported |
| 500 | Internal error | Check console logs, verify .env |
| 401 | Invalid token | Regenerate token in Airtable |
| 404 | Base/table not found | Verify base ID and table name |
| 429 | Rate limit | Wait, then retry (unlikely with caching) |

## Frontend Integration

The frontend calls this endpoint via `src/api.js`:

```javascript
export const fetchStaffData = async () => {
  try {
    const apiBase = process.env.REACT_APP_API_URL || '/api';
    const response = await fetch(`${apiBase}/staff`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch staff data');
    }

    return result.data || [];
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    throw error;
  }
};
```

### Usage in React

```javascript
useEffect(() => {
  const loadGuides = async () => {
    setGuidesLoading(true);
    try {
      const data = await fetchStaffData();
      setGuides(data);
    } catch (error) {
      setGuidesError(error.message);
      // Falls back to hardcoded guides
    } finally {
      setGuidesLoading(false);
    }
  };
  
  loadGuides();
}, []);
```

## Testing the Endpoint

### Using curl

```bash
# Local development
curl http://localhost:5173/api/staff

# With headers
curl -H "Accept: application/json" http://localhost:5173/api/staff

# With verbose output
curl -v http://localhost:5173/api/staff
```

### Using browser DevTools

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for `/api/staff` request
5. Click it to see Response

### Using JavaScript

```javascript
fetch('/api/staff')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));
```

## Troubleshooting

**Issue:** 500 error with "Missing Airtable credentials"
- **Fix:** Ensure `.env` file has `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID`

**Issue:** 401 Unauthorized
- **Fix:** Token may be invalid or expired; generate a new one

**Issue:** 404 Not Found
- **Fix:** Base ID incorrect or `Staff` table doesn't exist

**Issue:** Empty array returned
- **Fix:** No records in `Staff` table or all records are missing required fields

**Issue:** Photos not in response
- **Fix:** Records missing `photo` field or field has no attachments

---

**Complete API Reference**

Use this as reference when integrating the staff API or debugging issues.
