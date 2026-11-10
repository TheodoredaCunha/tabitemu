# Airtable Integration - Complete Implementation

## Summary

Integrated Airtable as CMS for staff profiles. Backend API fetches from Airtable, frontend displays data with fallback to hardcoded guides. Design and UI fully preserved.

## Files Changed

### Created Files

1. **`api/staff.js`** (New)
   - Serverless backend endpoint
   - Fetches staff from Airtable API
   - Normalizes records for frontend
   - Implements 5-minute caching
   - Error handling with fallback support

2. **`src/api.js`** (New)
   - Frontend utility function `fetchStaffData()`
   - Calls `/api/staff` endpoint
   - Handles response and errors

3. **`.env.example`** (New)
   - Template for environment variables
   - Shows required fields without secrets
   - Safe to commit to git

4. **Documentation Files** (New)
   - `QUICK_START.md` - 5-minute setup guide
   - `AIRTABLE_INTEGRATION.md` - Complete documentation
   - `API_SPEC.md` - Endpoint specification
   - `ARCHITECTURE.md` - System design diagrams
   - `INTEGRATION_SUMMARY.md` - Implementation details
   - `AIRTABLE_README.md` - Project overview

### Modified Files

1. **`src/App.jsx`**
   - Import `fetchStaffData` from `api.js`
   - Added fallback guides constant
   - Added state: `guides`, `guidesLoading`, `guidesError`
   - Added useEffect to fetch staff on mount
   - Updated guides rendering with Airtable data support
   - Graceful fallback if Airtable unavailable
   - Backward compatible with existing i18n

2. **`src/i18n.js`**
   - Added English: `guides.loading`, `guides.error`
   - Added Indonesian: `guides.loading`, `guides.error`
   - All guide info still pulled from i18n for compatibility

3. **`src/approachable.css`**
   - Added `.guides-loading` styling
   - Added `.guides-error` styling (red text)
   - Preserves all existing guide card styles

4. **`.gitignore`**
   - Already contained `.env` (no changes needed)

## Configuration

### Environment Variables Required

```
AIRTABLE_TOKEN=your_personal_access_token
AIRTABLE_BASE_ID=your_base_id
```

### Airtable Table Structure

**Table Name:** `Staff`

| Field | Type | Required |
|-------|------|----------|
| name | Single line text | Yes |
| bio | Long text | Yes |
| role | Single line text | Yes |
| tags | Single line text | Yes (comma-separated) |
| photo | Attachments | Yes (first used) |

## Key Features

✅ Secrets kept on server (token never exposed)  
✅ Frontend remains fast and cacheable  
✅ 5-minute caching reduces API calls  
✅ Graceful fallback with hardcoded guides  
✅ Loading and error states  
✅ Bilingual support (English & Indonesian)  
✅ Existing design preserved  
✅ No new npm dependencies  
✅ Compatible with Vercel, Netlify, etc.  

## Data Flow

```
1. App mounts → useEffect calls fetchStaffData()
2. fetchStaffData() → GET /api/staff
3. Backend checks cache → if valid, return cached
4. If cache invalid → fetch from Airtable API
5. Normalize records → store in cache
6. Return JSON to frontend
7. Frontend renders guides with Airtable data
8. If error → show error message, use fallback guides
```

## Backward Compatibility

- Hardcoded guides still exist as fallback
- If Airtable unavailable → uses fallback + error message
- User sees guides even if API fails
- Console shows errors for debugging
- No breaking changes to existing functionality

## Deployment

### Local Development

```bash
# Create .env file
echo "AIRTABLE_TOKEN=your_token" > .env
echo "AIRTABLE_BASE_ID=your_base_id" >> .env

# Run dev server
npm run dev

# Visit http://localhost:5173
```

### Production (Vercel/Netlify)

1. Set environment variables in platform UI
2. Redeploy application
3. API automatically uses production credentials

## Testing

```bash
# Verify staff loads
npm run dev
# Browser → http://localhost:5173
# Console (F12) → Check for errors
# Network tab → See /api/staff response
```

## Security Measures

- ✓ Token in `.env` (not committed)
- ✓ `.env.example` in git (shows template)
- ✓ Frontend never sees token
- ✓ All Airtable calls through backend
- ✓ Error messages don't leak secrets
- ✓ CORS headers configured

## Performance

- **Cache duration:** 5 minutes (configurable)
- **Cache invalidation:** Automatic after 5 minutes
- **Fallback:** Hardcoded data loads instantly if API fails
- **Bundle impact:** No additional npm packages

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Airtable unavailable | Show error, use fallback guides |
| Invalid token | Console error, use fallback guides |
| Missing .env vars | Server error logged, fallback used |
| Network error | Console error, fallback guides shown |
| Successful fetch | Display Airtable data, cache it |

## Git Commit Files

```
git add api/staff.js
git add src/api.js
git add src/App.jsx
git add src/i18n.js
git add src/approachable.css
git add .env.example
git add QUICK_START.md
git add AIRTABLE_INTEGRATION.md
git add API_SPEC.md
git add ARCHITECTURE.md
git add INTEGRATION_SUMMARY.md
git add AIRTABLE_README.md

# DO NOT COMMIT:
# - .env (your actual credentials)
```

## Verification Steps

After deployment, verify:

1. ✓ Staff photos display on home page
2. ✓ Names match Airtable records
3. ✓ Bios/descriptions show correctly
4. ✓ Tags display as chips
5. ✓ Console has no errors
6. ✓ Network tab shows `/api/staff` 200 response
7. ✓ Loading state shows briefly
8. ✓ Works in both English & Indonesian

## Future Enhancements

Possible improvements (not in scope now):

- Pagination for large staff lists
- Search/filter by tags
- Staff detail page links
- Direct edit from frontend (requires auth)
- Webhook for real-time updates
- Extended caching strategies

## Support

**For setup help:** See `QUICK_START.md`  
**For complete docs:** See `AIRTABLE_INTEGRATION.md`  
**For API details:** See `API_SPEC.md`  
**For architecture:** See `ARCHITECTURE.md`  

---

**Integration complete and ready for production!** 🚀
