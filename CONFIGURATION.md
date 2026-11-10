# Configuration Reference

## .env File (Local Development)

**Location:** Project root (next to `package.json`)

**File: `.env`** (DO NOT COMMIT - already in .gitignore)

```bash
# Airtable API Credentials
# Get these from:
# - Token: https://airtable.com/account/api
# - Base ID: https://airtable.com/api

AIRTABLE_TOKEN=pat_eXxxxxxxxxxxxxxxxxxxxx
AIRTABLE_BASE_ID=appXxxxxxxxxxxxxxxxxxxx
```

### How to Get These Values

#### Step 1: Get Airtable Personal Access Token

1. Go to https://airtable.com/account/api
2. Click "Create token"
3. Name: "Tabitemu Staff API" (or similar)
4. Scopes needed:
   - ✓ data.records:read (to read staff records)
   - ✓ schema.bases:read (to access base schema)
5. Click Create Token
6. **Copy the token immediately** (won't show again)
7. Format: starts with `pat_`

Example token (yours will be different):
```
pat_abcd1234efgh5678ijkl9012mnop3456
```

#### Step 2: Get Airtable Base ID

1. Go to https://airtable.com/api
2. Select your base from the sidebar
3. In the "Introduction" section, you'll see:
   ```
   The ID of this base is appXxxxxxxxxxxxxxxxxxxx
   ```
4. **Copy the Base ID** (starts with `app_`)

Example base ID (yours will be different):
```
appXxxxxxxxxxxxxxxxxxxx
```

#### Step 3: Create .env File

Create file `.env` in project root:

```
AIRTABLE_TOKEN=pat_your_token_here
AIRTABLE_BASE_ID=appYourBaseIdHere
```

Replace with your actual values.

## .env.example (Template)

**Location:** Project root  
**Status:** Committed to git (safe, no secrets)

```bash
# Airtable Configuration
# Get your Personal Access Token from: https://airtable.com/account/api
# Get your Base ID from the Airtable API documentation
AIRTABLE_TOKEN=your_personal_access_token_here
AIRTABLE_BASE_ID=your_base_id_here
```

This file shows required variables but no actual secrets.

## Airtable Table Setup

### Create Staff Table

1. In your Airtable base, create a new table called **`Staff`**
2. Or use existing table (must be named exactly `Staff`)

### Add Fields

| Field Name | Type | Configuration | Example |
|------------|------|----------------|---------|
| **name** | Single line text | Required | Ren |
| **bio** | Long text | Required | From iconic anime... |
| **role** | Single line text | Required | Anime & gaming specialist |
| **tags** | Single line text | Required | Anime, Gaming, Akihabara |
| **photo** | Attachments | Required (single) | [image file] |

### Field Setup Details

#### name (Single line text)
```
Field name: name
Field type: Single line text
Options: None
Example: Ren
```

#### bio (Long text)
```
Field name: bio
Field type: Long text
Options: None
Example: From iconic anime neighborhoods to hidden figure shops and 
         retro arcades, Ren knows where fandom comes to life.
```

#### role (Single line text)
```
Field name: role
Field type: Single line text
Options: None
Example: Anime & gaming specialist
```

#### tags (Single line text)
```
Field name: tags
Field type: Single line text
Options: None
Format: Comma-separated values
Example: Anime, Gaming, Akihabara
Note: Each tag separated by comma; spaces automatically trimmed
```

#### photo (Attachments)
```
Field name: photo
Field type: Attachments
Options: 
  - Allow multiple files: OFF (only need first image)
Example: [upload PNG, JPG, or WebP file]
Note: First attachment in this field will be used
```

### Sample Records

#### Record 1: Ren
| Field | Value |
|-------|-------|
| name | Ren |
| bio | From iconic anime neighborhoods to hidden figure shops and retro arcades, Ren knows where fandom comes to life. |
| role | Anime & gaming specialist |
| tags | Anime, Gaming, Akihabara |
| photo | [upload ren.jpg] |

#### Record 2: Mika
| Field | Value |
|-------|-------|
| name | Mika |
| bio | Explore Tokyo's independent labels, vintage stores, streetwear corners and the people shaping local style. |
| role | Fashion & street culture |
| tags | Fashion, Vintage, Streetwear |
| photo | [upload mika.jpg] |

## Deployment Configuration

### For Vercel

1. Go to your project dashboard
2. Click "Settings"
3. Go to "Environment Variables"
4. Add 2 new variables:

**Variable 1:**
- Name: `AIRTABLE_TOKEN`
- Value: `pat_your_token_here`
- Environments: ✓ Production ✓ Preview ✓ Development

**Variable 2:**
- Name: `AIRTABLE_BASE_ID`
- Value: `appYourBaseIdHere`
- Environments: ✓ Production ✓ Preview ✓ Development

5. Redeploy your application
6. Verify deployment succeeded

### For Netlify

1. Go to "Site settings" → "Build & deploy"
2. Click "Environment"
3. Click "Edit variables"
4. Add:

```
AIRTABLE_TOKEN=pat_your_token_here
AIRTABLE_BASE_ID=appYourBaseIdHere
```

5. Trigger a new deploy (or push to git)
6. Wait for build to complete

### For Other Platforms

**Heroku:**
```bash
heroku config:set AIRTABLE_TOKEN=pat_...
heroku config:set AIRTABLE_BASE_ID=app_...
```

**AWS Lambda:**
- Set in Lambda function environment variables
- Or use AWS Secrets Manager

**Docker:**
Add to docker-compose.yml or Dockerfile:
```dockerfile
ENV AIRTABLE_TOKEN=pat_...
ENV AIRTABLE_BASE_ID=app_...
```

## Verification

### Verify Local Setup

1. `.env` file exists in project root
2. File contains both variables:
   - `AIRTABLE_TOKEN=pat_...`
   - `AIRTABLE_BASE_ID=app_...`
3. `.gitignore` includes `.env` (don't commit credentials)
4. Run `npm run dev`
5. Check browser console (F12) - no errors
6. Check Network tab - `/api/staff` returns 200
7. Staff photos load on home page

### Verify Production Setup

1. Environment variables set in deployment platform
2. No `.env` file uploaded
3. Deployed version runs without errors
4. Visit production URL
5. Staff loads from Airtable
6. Check browser console - no errors
7. Check Network tab - `/api/staff` returns 200

### Troubleshooting Configuration

**Error: "Missing Airtable credentials"**
- ✓ Check `.env` exists
- ✓ Check both variables present
- ✓ Check token format starts with `pat_`
- ✓ Check base ID format starts with `app_`

**Error: "Airtable authentication failed"**
- ✓ Token may be expired
- ✓ Create new token at https://airtable.com/account/api
- ✓ Update `.env` and restart dev server

**Error: "Airtable base or table not found"**
- ✓ Base ID incorrect
- ✓ `Staff` table doesn't exist
- ✓ Verify base ID at https://airtable.com/api

**No staff showing but no errors**
- ✓ Check Airtable `Staff` table has records
- ✓ Check records have `photo` attachments
- ✓ Wait up to 5 minutes for cache refresh

## Security Checklist

- ✓ Never commit `.env` file
- ✓ Use `.env.example` as template (in git)
- ✓ Keep token secret (regenerate if exposed)
- ✓ Environment variables set on deployment
- ✓ No token in code comments
- ✓ No token in git history
- ✓ No token in PR/review comments

## File Locations Reference

```
tabitemu-react/
├── .env                    ← Your credentials (DO NOT COMMIT)
├── .env.example            ← Template (DO COMMIT)
├── api/
│   └── staff.js           ← Uses AIRTABLE_TOKEN & AIRTABLE_BASE_ID
├── src/
│   ├── api.js             ← Calls /api/staff
│   ├── App.jsx            ← Calls fetchStaffData()
│   └── ...
└── ...
```

## Quick Commands

```bash
# Check if .env exists
ls -la .env

# View .env contents (verify values)
cat .env

# Test API locally
curl http://localhost:5173/api/staff

# Run dev server with fresh env
npm run dev

# Build for production
npm run build
```

---

**Ready to configure? Follow the steps above and you'll be set!** ✅
