# Airtable Integration - Implementation Summary

## ✅ What Was Done

I've successfully integrated Airtable as the Staff Profile CMS for your Tabitemu website. The integration maintains your existing UI/design while replacing hardcoded staff data with data from Airtable.

## 📁 Files Created/Modified

### New Files Created:

1. **`api/staff.js`** - Backend serverless API endpoint
   - Fetches staff data from Airtable
   - Normalizes records into frontend-friendly format
   - Implements 5-minute caching to reduce API calls
   - Handles errors gracefully

2. **`src/api.js`** - Frontend API utility
   - Single function to fetch staff from backend
   - Handles error propagation

3. **`.env.example`** - Template for environment variables
   - Shows required variables without exposing secrets
   - Committed to git for reference

4. **`AIRTABLE_INTEGRATION.md`** - Complete integration guide
   - Setup instructions
   - API configuration
   - Deployment steps
   - Troubleshooting guide

### Modified Files:

1. **`src/App.jsx`** - Updated React component
   - Imports `fetchStaffData` from API utility
   - Added state for `guides`, `guidesLoading`, `guidesError`
   - Added useEffect to fetch data on component mount
   - Updated guides rendering to support loading/error states
   - Falls back to hardcoded guides if Airtable unavailable
   - Maintains backward compatibility with fallback data

2. **`src/i18n.js`** - Added translations
   - `guides.loading` - Loading state message
   - `guides.error` - Error state message
   - Both English and Indonesian versions

3. **`src/approachable.css`** - Added loading/error styling
   - `.guides-loading` - Loading state styling
   - `.guides-error` - Error state styling (red color)

## 🔐 Security Implementation

✅ **Token Management:**
- Airtable token only stored on server (`/api/staff.js`)
- Frontend never has access to credentials
- All API calls proxied through backend
- Environment variables used (never hardcoded)

✅ **Git Safety:**
- `.env` is in `.gitignore` (won't be committed)
- `.env.example` committed (shows template only)
- Credentials never exposed in version control

✅ **API Security:**
- GET-only endpoint (no data modification)
- CORS headers configured
- Error messages don't leak sensitive info

## 📊 Data Normalization

Airtable records are transformed to:

```javascript
{
  id: "recXXXXXXXXXXXXXX",  // Unique Airtable record ID
  name: "John Doe",          // Staff name
  bio: "...",               // Biography
  tags: ["Anime", "Gaming"], // Array of interest tags
  photo: "https://...",     // Profile photo URL (first attachment)
  role: "Anime specialist"   // Staff role
}
```

## 🚀 Deployment Ready

### Required Configuration:

**For All Deployment Platforms** (Vercel, Netlify, etc.):

```
AIRTABLE_TOKEN=pat_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### Platform-Specific Steps:

**Vercel:**
1. Go to Project → Settings → Environment Variables
2. Add both variables with Production scope
3. Redeploy

**Netlify:**
1. Go to Site settings → Build & deploy → Environment
2. Add both variables
3. Trigger redeploy

**Other platforms:** Follow their environment variable documentation

## ⚡ Performance Features

- **5-minute caching:** Reduces Airtable API calls significantly
- **Fallback data:** If Airtable unreachable, displays cached fallback
- **Minimal bundle impact:** No additional npm packages needed
- **Lazy loading:** Data fetches on component mount, not at build time

## 🔄 Workflow

### Local Development:

1. Create `.env` file with credentials
2. Run `npm run dev`
3. Visit `http://localhost:5173`
4. Staff data fetches automatically
5. Changes in Airtable reflected within 5 minutes

### Adding New Staff:

1. Add record to Airtable `Staff` table
2. Include: `name`, `bio`, `tags` (comma-separated), `photo` (attachment), `role`
3. Within 5 minutes, appears on website
4. No code changes needed

### Updating Staff:

1. Edit any field in Airtable
2. Within 5 minutes, changes live on website
3. No code redeploy needed

## 🎯 Airtable Table Structure

**Table Name:** `Staff`

**Fields Required:**
| Field | Type | Example |
|-------|------|---------|
| name | Single line text | "Ren" |
| bio | Long text | "From iconic anime neighborhoods..." |
| tags | Single line text | "Anime, Gaming, Akihabara" |
| photo | Attachments | (upload image file) |
| role | Single line text | "Anime & gaming specialist" |

## 🧪 Testing Checklist

- [ ] Local `.env` configured with test Airtable credentials
- [ ] Staff data loads on home page
- [ ] Loading state shows briefly
- [ ] Staff photos display correctly
- [ ] Tags split and display properly
- [ ] Error state works (disconnect internet to test)
- [ ] Fallback guides display if Airtable unavailable
- [ ] Both English and Indonesian translations work
- [ ] Responsive design preserved
- [ ] Console has no errors

## 📝 Files to Commit to Git

```bash
git add api/staff.js
git add src/api.js
git add src/App.jsx
git add src/i18n.js
git add src/approachable.css
git add .env.example
git add AIRTABLE_INTEGRATION.md
git add .gitignore  # (already updated)
```

⚠️ **DO NOT COMMIT:**
- `.env` (your actual credentials)

## 🔗 Next Steps

1. **Create Airtable Setup:**
   - Get personal access token from https://airtable.com/account/api
   - Find your Base ID from https://airtable.com/api
   - Create `Staff` table with required fields
   - Add staff records with photos

2. **Configure Locally:**
   - Create `.env` file with your credentials
   - Test with `npm run dev`
   - Verify staff loads correctly

3. **Deploy:**
   - Set environment variables on your deployment platform
   - Redeploy the application
   - Test on staging before production

4. **Monitor:**
   - Check browser console for any errors
   - Verify API calls in Network tab
   - Confirm changes from Airtable appear within 5 minutes

## ❓ Troubleshooting

**Staff not loading?**
- Check `.env` has correct token and base ID
- Verify `Staff` table exists in Airtable
- Check browser console for errors
- Look at Network tab `/api/staff` response

**Photos not showing?**
- Ensure `photo` field in Airtable is type "Attachments"
- Upload at least one image per staff record
- The first attachment will be used

**Changes not appearing?**
- Wait up to 5 minutes for cache refresh
- Or clear browser cache and reload
- Or reduce `CACHE_DURATION` in `api/staff.js`

**API errors?**
- Check Airtable token hasn't expired
- Verify base ID is correct
- Ensure `Staff` table exists
- Check Airtable API status

See `AIRTABLE_INTEGRATION.md` for complete troubleshooting guide.

---

**Integration Complete!** 🎉

Your Tabitemu website now uses Airtable for staff profile management. The website maintains its existing design while gaining the flexibility to update staff information without code changes.
