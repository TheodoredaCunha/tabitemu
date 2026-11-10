# Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
│                   (React App)                                │
├─────────────────────────────────────────────────────────────┤
│  App.jsx                                                     │
│  ├── Calls: fetchStaffData() on component mount              │
│  ├── Manages state: guides, guidesLoading, guidesError       │
│  └── Renders: Guide cards with photos, bios, tags           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                      HTTP GET
                    /api/staff
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               NODE.JS BACKEND (Serverless)                   │
│                   api/staff.js                               │
├─────────────────────────────────────────────────────────────┤
│  Handler Function:                                           │
│  ├── Reads: AIRTABLE_TOKEN, AIRTABLE_BASE_ID from .env       │
│  ├── Checks: 5-minute cache                                  │
│  ├── If cache miss: Fetches fresh data                       │
│  └── Normalizes: Records → Frontend data structure           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                      HTTP GET
                  https://api.airtable.com/v0
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   AIRTABLE CLOUD                             │
│                                                              │
│   Base: your_base_id                                         │
│   Table: Staff                                               │
│   ├── Record 1: Ren (name, bio, tags, photo, role)          │
│   ├── Record 2: Mika (name, bio, tags, photo, role)         │
│   ├── Record 3: Daichi (...)                                 │
│   └── ... more records ...                                   │
│                                                              │
│   Auth: Bearer {AIRTABLE_TOKEN}                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Transformation Flow

```
┌─ Airtable Record (Raw) ──────────────────────────────────────┐
│                                                              │
│  {                                                           │
│    "id": "recABCD1234",                                      │
│    "fields": {                                               │
│      "name": "Ren",                                          │
│      "bio": "From iconic anime neighborhoods...",           │
│      "role": "Anime & gaming specialist",                   │
│      "tags": "Anime, Gaming, Akihabara",                    │
│      "photo": [                                             │
│        {                                                    │
│          "id": "attXXXXXXXXXXXXXX",                          │
│          "url": "https://dl.airtable.com/.../filename.jpg", │
│          "filename": "ren.jpg",                             │
│          "size": 245123,                                    │
│          "type": "image/jpeg"                               │
│        }                                                    │
│      ]                                                      │
│    }                                                        │
│  }                                                          │
│                                                            │
└───────────────────────┬──────────────────────────────────────┘
                        │
          Normalize in api/staff.js
                        │
                        ▼
┌─ Frontend Data Structure (Normalized) ──────────────────────┐
│                                                             │
│  {                                                          │
│    "id": "recABCD1234",              // Airtable record ID  │
│    "name": "Ren",                    // Direct from name    │
│    "bio": "From iconic anime...",    // Direct from bio     │
│    "role": "Anime & gaming...",      // Direct from role    │
│    "tags": ["Anime", "Gaming", "Akihabara"],   // Split & trimmed
│    "photo": "https://dl.airtable.com/.../filename.jpg" // First attachment
│  }                                                         │
│                                                            │
└───────────────────────┬──────────────────────────────────────┘
                        │
          React renders in App.jsx
                        │
                        ▼
┌─ Browser Display ──────────────────────────────────────────┐
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                                                     │  │
│  │  [Profile Photo Image]                              │  │
│  │                                                     │  │
│  │  REN                                                │  │
│  │  Anime & gaming specialist                          │  │
│  │  From iconic anime neighborhoods...                 │  │
│  │                                                     │  │
│  │  [Anime] [Gaming] [Akihabara]                       │  │
│  │                                                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Caching Strategy

```
Request comes in at /api/staff
        │
        ▼
Is cache valid? (< 5 minutes old)
        │
    ┌───┴───┐
    │       │
   YES      NO
    │       │
    ▼       ▼
Return   Fetch from
Cached   Airtable
Data     │
         ▼
      Normalize
         │
         ▼
      Update Cache
      (timestamp = now)
         │
         ▼
      Return Data
```

## Error Handling Flow

```
App.jsx tries to fetch staff
        │
        ▼
Call fetchStaffData()
        │
        ▼
Make HTTP request to /api/staff
        │
    ┌───┴─────────┐
    │             │
Success        Error/Exception
    │             │
    ▼             ▼
Parse JSON   Log to console
    │             │
    ▼             ▼
Return        Throw error
data          to App.jsx
              │
              ▼
          App.jsx catch block
              │
              ▼
          Set guidesError state
          Keep using fallback guides
              │
              ▼
          User sees fallback guides
          + error message in console
              
(Website keeps working with fallback data)
```

## Security: Secrets & Tokens

```
┌──────────────────────────────────────────────────────────┐
│  .env (LOCAL - NEVER COMMIT)                             │
│  ├── AIRTABLE_TOKEN=pat_XXXXX...                         │
│  └── AIRTABLE_BASE_ID=appXXXX...                         │
│                                                          │
│  .env.example (COMMITTED - NO SECRETS)                   │
│  ├── AIRTABLE_TOKEN=your_token_here                      │
│  └── AIRTABLE_BASE_ID=your_base_id_here                  │
│                                                          │
│  .gitignore                                              │
│  ├── .env  ← Prevents commit of real secrets             │
│  └── ... (other ignored files)                           │
└──────────────────────────────────────────────────────────┘

Frontend Code (Public - In Browser):
  ✓ Can see: API endpoint URLs
  ✓ Can see: Guide names, photos, bios
  ✗ Cannot see: Airtable token (only on server)

Backend Code (Private - Server Only):
  ✓ Has access to: AIRTABLE_TOKEN
  ✓ Only backend calls Airtable API
  ✓ Frontend only gets normalized JSON response

Network Flow:
  Frontend → Backend → Airtable
  (Frontend never directly contacts Airtable)
```

## Deployment Environment Setup

```
Local Development:
  .env file (not committed, only on your machine)

Staging/Production Deployment:
  Environment Variables
  (set via platform UI or CLI)
  
  Vercel/Netlify/etc:
  ├── AIRTABLE_TOKEN (from Project Settings)
  └── AIRTABLE_BASE_ID (from Project Settings)
  
  These replace the .env file at runtime
```

## File Relationships

```
src/App.jsx
├── imports fetchStaffData from src/api.js
├── uses fallbackGuides constant
├── renders guides in JSX
├── uses translations from src/i18n.js
└── applies styles from src/approachable.css

src/api.js
├── exports fetchStaffData function
├── calls /api/staff endpoint
└── handles errors and JSON parsing

api/staff.js
├── reads AIRTABLE_TOKEN from process.env
├── reads AIRTABLE_BASE_ID from process.env
├── calls Airtable API
├── normalizes records
├── implements caching
└── sends JSON response

src/i18n.js
├── has 'guides.loading' translation
├── has 'guides.error' translation
└── has 'guides.eyebrow', 't1', 't2', etc.

src/approachable.css
├── has .guides-loading styles
├── has .guides-error styles
└── has existing .guide-card, .guide-grid styles
```

## Request/Response Examples

### API Request (from Browser)

```
GET /api/staff HTTP/1.1
Host: localhost:5173 (or your domain)
Accept: application/json
```

### API Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "recABCD1234",
      "name": "Ren",
      "bio": "From iconic anime neighborhoods to hidden figure shops...",
      "role": "Anime & gaming specialist",
      "tags": ["Anime", "Gaming", "Akihabara"],
      "photo": "https://dl.airtable.com/.../filename.jpg"
    },
    {
      "id": "recEFGH5678",
      "name": "Mika",
      ...
    }
  ]
}
```

### API Error Response

```json
{
  "success": false,
  "error": "Missing Airtable credentials: AIRTABLE_TOKEN and AIRTABLE_BASE_ID are required"
}
```

---

This architecture ensures:
✓ Secrets stay on server
✓ Frontend remains fast and cacheable
✓ Airtable updates reflect within 5 minutes
✓ Graceful fallback if Airtable unavailable
✓ Simple, maintainable code
