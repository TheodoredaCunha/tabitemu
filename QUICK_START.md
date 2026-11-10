# Quick Start: Airtable Integration

## 🚀 Get Running in 5 Minutes

### Step 1: Create Airtable Credentials (2 min)

1. Go to https://airtable.com/account/api
2. Click "Create token"
3. Name it "Tabitemu Staff API"
4. Grant `data.records:read` and `schema.bases:read` scopes
5. **Copy the token** (save it!)

6. Go to https://airtable.com/api
7. Find your base and **copy the Base ID** (looks like `appXXXXXXXXXXXXXX`)

### Step 2: Set Up Airtable Table (1 min)

In your Airtable base, create or verify you have a table named `Staff` with:
- `name` - Staff member name
- `bio` - Biography text  
- `role` - Role/title
- `tags` - Comma-separated tags (e.g., "Anime, Gaming, Culture")
- `photo` - Attachment field (upload one image)

Add your staff members!

### Step 3: Configure Environment (1 min)

Create `.env` file in project root:

```
AIRTABLE_TOKEN=your_token_from_step_1
AIRTABLE_BASE_ID=your_base_id_from_step_1
```

### Step 4: Run & Test (1 min)

```bash
npm run dev
```

Visit http://localhost:5173 and look for staff photos with names and tags!

## ✅ Deployment

### Vercel / Netlify

Set environment variables in project settings:
- `AIRTABLE_TOKEN` = your token
- `AIRTABLE_BASE_ID` = your base ID

Redeploy. Done!

## 📋 Files to Know About

| File | Purpose |
|------|---------|
| `api/staff.js` | Backend that fetches from Airtable |
| `src/api.js` | Frontend utility to call backend |
| `src/App.jsx` | Updated to use Airtable data |
| `.env.example` | Shows what goes in `.env` |
| `AIRTABLE_INTEGRATION.md` | Full documentation |

## 🆘 If Staff Don't Show

1. Check browser console (F12) for errors
2. Verify `.env` file exists with correct values
3. Confirm Airtable `Staff` table exists
4. Make sure at least one staff record has a photo
5. Check Network tab → `/api/staff` response

## 🎯 Common Tasks

**Add a new staff member?**
- Add row to Airtable `Staff` table
- Wait ~5 minutes
- Refresh website
- Done! No code changes needed

**Change staff name/bio?**
- Edit in Airtable
- Within 5 minutes it updates on website
- No redeploy needed

**Change staff photo?**
- Upload new photo to `photo` field in Airtable
- Within 5 minutes new photo appears
- No code changes needed

## 📞 Need Help?

See `AIRTABLE_INTEGRATION.md` for complete guide and troubleshooting.

---

**That's it!** Your staff profiles are now managed in Airtable. 🎉
