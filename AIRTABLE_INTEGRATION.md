# Airtable Integration Guide

## Overview

This project now uses **Airtable** as the CMS for staff/guide profiles. The integration consists of:

- **Backend API**: `/api/staff.js` - Serverless function that fetches data from Airtable
- **Frontend**: `src/api.js` - Client-side utility to call the backend
- **React Component**: Updated `src/App.jsx` to render guides from Airtable data

## Setup Instructions

### 1. Create an Airtable Personal Access Token

1. Go to https://airtable.com/account/api
2. Click "Create token"
3. Give it a descriptive name (e.g., "Tabitemu Staff API")
4. Grant these scopes:
   - `data.records:read`
   - `schema.bases:read`
5. Copy the token and save it securely

### 2. Get Your Airtable Base ID

1. Go to https://airtable.com/api
2. Select your base
3. Your Base ID will be shown in the introduction (format: `appXXXXXXXXXXXXXX`)
4. Copy it

### 3. Create Your Airtable Table

1. In your Airtable base, create or use a table named **`Staff`**
2. Add these fields:
   - **name** (Single line text) - Staff member's name
   - **bio** (Long text) - Staff member's biography
   - **tags** (Single line text) - Comma-separated tags (e.g., "Anime, Gaming, Culture")
   - **photo** (Attachments) - Staff profile photo (first attachment will be used)
   - **role** (Single line text) - Staff member's role (e.g., "Anime & gaming specialist")

### 4. Configure Environment Variables

1. Create a `.env` file in the project root (next to `package.json`):

```
AIRTABLE_TOKEN=your_personal_access_token_here
AIRTABLE_BASE_ID=your_base_id_here
```

**Important:** Never commit the `.env` file. It's already in `.gitignore`.

### 5. Install Dependencies (if needed)

The backend API uses Node.js built-in fetch (available in Node 18+). If you're using an older version, you may need to install:

```bash
npm install node-fetch
```

## Running Locally

### Development Mode

```bash
# Start the dev server
npm run dev
```

The app will run on `http://localhost:5173` (or similar, as shown in terminal).

The API endpoint will be available at `/api/staff` (Vite dev server proxies it automatically).

### Testing the API

To verify the Airtable integration is working:

1. Open your browser's Developer Console (F12 or right-click → Inspect → Console)
2. Navigate to the home page
3. Check the console for any errors
4. Look for the guides section - it should display staff from Airtable
5. If there are errors, check the Network tab to see the API response

## Deployment

### Environment Variables for Deployment

Set the following environment variables in your deployment platform:

**Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add:
   - `AIRTABLE_TOKEN` = (your token)
   - `AIRTABLE_BASE_ID` = (your base ID)

**Netlify:**
1. Go to Site settings → Build & deploy → Environment
2. Add the same variables

**Other Platforms:**
Refer to your platform's documentation for setting environment variables.

### Important Security Notes

- ✅ Tokens are only used on the server (`/api/staff.js`)
- ✅ Frontend never has access to the token
- ✅ All API calls go through the backend proxy
- ✅ `.env` file is in `.gitignore` and won't be committed
- ✅ `.env.example` shows the required variables without secrets

## Data Normalization

The backend normalizes Airtable records into this structure:

```javascript
{
  id: "recXXXXXXXXXXXXXX",      // Airtable record ID
  name: "John Doe",              // From name field
  bio: "A passionate guide...",  // From bio field
  tags: ["Anime", "Gaming"],     // Split from tags field
  photo: "https://...",          // From first photo attachment
  role: "Anime specialist"       // From role field
}
```

## Caching Strategy

The API caches staff data for **5 minutes** to reduce API calls and improve performance:

- First page load: Fetches fresh data from Airtable
- Subsequent loads within 5 minutes: Uses cached data
- After 5 minutes: Fetches fresh data again

This means changes in Airtable will be reflected within 5 minutes on live sites.

## Error Handling

### If Airtable is Unavailable

- The app falls back to hardcoded staff data (defined in `fallbackGuides`)
- A console message indicates the error
- Users will still see the staff section with default data

### Common Issues

**Problem:** "Missing Airtable credentials"
- **Solution:** Check that `.env` file has both `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID`

**Problem:** 401 Unauthorized
- **Solution:** Your token may be invalid or expired. Create a new one

**Problem:** 404 Not Found
- **Solution:** Check that your Base ID is correct and the `Staff` table exists

**Problem:** No guide photos showing
- **Solution:** Ensure the `photo` field in Airtable has attachments, and the first attachment is the photo URL

## Monitoring & Debugging

### Check API Response

In development, check the Network tab:
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for `/api/staff` request
5. Click it and check the Response

### Enable Verbose Logging

Add this to `src/api.js` for debugging:

```javascript
export const fetchStaffData = async () => {
  try {
    const apiBase = process.env.REACT_APP_API_URL || '/api';
    console.log('Fetching from:', `${apiBase}/staff`);
    const response = await fetch(`${apiBase}/staff`);
    
    if (!response.ok) {
      console.error('API returned:', response.status, response.statusText);
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Staff data received:', result.data);
    
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

## Troubleshooting

### Guides not loading from Airtable

1. Check browser console for errors
2. Open Network tab and check `/api/staff` response
3. Verify `.env` file is in project root
4. Make sure environment variables are set correctly
5. Check Airtable base is accessible with your token

### Deployment issues

1. Verify environment variables are set on your deployment platform
2. Check that build succeeds without errors
3. View logs to see if API errors are occurring
4. Ensure token is correct (test locally first)

### Performance concerns

- Currently caches for 5 minutes
- To reduce cache time, modify `CACHE_DURATION` in `/api/staff.js`
- To disable caching entirely, set `CACHE_DURATION = 0`

## File Structure

```
tabitemu-react/
├── api/
│   └── staff.js           # Serverless API endpoint
├── src/
│   ├── App.jsx            # Updated to fetch from Airtable
│   ├── api.js             # Frontend API utility
│   ├── i18n.js            # Updated with loading/error messages
│   └── approachable.css   # Updated with loading/error styles
├── .env                   # Environment variables (DO NOT COMMIT)
├── .env.example           # Template showing required variables
└── .gitignore             # Already includes .env
```

## Next Steps

1. Set up your Airtable base with the required table structure
2. Create environment variables locally and on deployment
3. Test locally to ensure data loads correctly
4. Deploy and verify on staging
5. Monitor Airtable API usage in your Airtable account

## Support

For Airtable API issues, see: https://airtable.com/api
For this integration, check the error messages in browser console.
