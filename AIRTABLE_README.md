# 🎉 Airtable Integration Complete!

## What's New

Your Tabitemu website now uses **Airtable as a CMS for staff profiles**. Update staff information directly in Airtable without touching code!

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **QUICK_START.md** | 5-minute setup guide (start here!) |
| **AIRTABLE_INTEGRATION.md** | Complete integration documentation |
| **API_SPEC.md** | API endpoint reference |
| **ARCHITECTURE.md** | System design and data flow diagrams |
| **INTEGRATION_SUMMARY.md** | What was implemented |

## 🚀 Quick Start

1. **Get Airtable Token:** https://airtable.com/account/api
2. **Get Base ID:** https://airtable.com/api
3. **Create Staff Table** with fields: `name`, `bio`, `role`, `tags`, `photo`
4. **Create `.env` file:**
   ```
   AIRTABLE_TOKEN=your_token
   AIRTABLE_BASE_ID=your_base_id
   ```
5. **Run:** `npm run dev`
6. **See:** Staff photos & info loaded from Airtable!

👉 **See QUICK_START.md for details**

## 📁 Files Created

```
api/
├── staff.js                    ← Backend API endpoint

src/
├── api.js                      ← Frontend API utility
├── App.jsx                     ← Updated to fetch from Airtable
├── i18n.js                     ← Added loading/error messages
└── approachable.css            ← Added loading/error styles

Documentation:
├── .env.example                ← Environment variable template
├── QUICK_START.md              ← 5-minute setup
├── AIRTABLE_INTEGRATION.md     ← Full guide
├── API_SPEC.md                 ← Endpoint reference
├── ARCHITECTURE.md             ← System design
└── INTEGRATION_SUMMARY.md      ← What was done
```

## 🔑 Key Features

✅ **Airtable CMS** - Manage staff in Airtable UI  
✅ **No Secrets in Frontend** - Token stays on server  
✅ **Fallback Data** - Works even if Airtable unavailable  
✅ **5-Minute Caching** - Fast, reduced API calls  
✅ **Bilingual** - English & Indonesian support  
✅ **Loading/Error States** - User feedback  
✅ **Responsive Design** - Preserved existing design  

## 📋 Environment Setup

### Local Development

Create `.env` in project root:

```bash
AIRTABLE_TOKEN=pat_XXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### Deployment (Vercel/Netlify/etc)

Set these in your platform's environment variables:
- `AIRTABLE_TOKEN`
- `AIRTABLE_BASE_ID`

## 🧪 Testing

```bash
# Start dev server
npm run dev

# Visit http://localhost:5173
# Check Console (F12) for any errors
# Verify staff photos and info load
# Check Network tab → /api/staff response
```

## 🔄 Workflow

**Adding Staff:**
1. Add row to Airtable `Staff` table
2. Fill: name, bio, role, tags (comma-separated), photo
3. Within 5 minutes, appears on website!

**Updating Staff:**
1. Edit any field in Airtable
2. Within 5 minutes, changes live on website!

**Removing Staff:**
1. Delete row from Airtable
2. Within 5 minutes, removed from website!

## 🔐 Security

✓ Token never exposed in frontend  
✓ All API calls go through backend  
✓ `.env` file in `.gitignore` (won't commit)  
✓ `.env.example` committed (shows template)  
✓ No hardcoded secrets in code  

## ⚡ Performance

- **Caching:** 5-minute cache reduces Airtable API calls
- **Fallback:** Hardcoded data loads if Airtable unavailable
- **Fast:** Data fetched server-side, browser gets JSON
- **Responsive:** Existing design unchanged

## 🆘 Troubleshooting

**Staff not showing?**
- Check `.env` has correct token and base ID
- Verify Airtable `Staff` table exists
- Check browser console for errors (F12)

**Photos not showing?**
- Ensure `photo` field is Attachments type
- Upload at least one image per staff

**Need more help?**
→ See **AIRTABLE_INTEGRATION.md**

## 📞 Implementation Details

### Backend (`api/staff.js`)
- Reads Airtable token from environment
- Fetches from Airtable API
- Normalizes records
- Implements 5-minute cache
- Returns JSON to frontend

### Frontend (`src/App.jsx`)
- Calls `/api/staff` on mount
- Handles loading state
- Handles error state with fallback
- Renders guides with Airtable data
- Falls back to hardcoded data if needed

### API (`src/api.js`)
- Simple function to fetch staff
- Error handling
- Used by React component

## 📊 Data Flow

```
Airtable → Backend API → Frontend → Browser Display
(Staff DB)   (Normalizes)  (Fetches)  (Shows photos)
```

## 🎯 Next Steps

1. **Set up Airtable** (QUICK_START.md)
2. **Test locally** (npm run dev)
3. **Deploy** with environment variables
4. **Monitor** - check console logs first few days
5. **Update staff** directly in Airtable!

## 📝 Important Files to Review

| File | Action |
|------|--------|
| `.env.example` | Shows what goes in `.env` |
| `api/staff.js` | Backend logic |
| `src/api.js` | Frontend API call |
| `src/App.jsx` | React component using data |
| `.gitignore` | Confirms .env won't commit |

## ✅ Checklist

- [ ] Read QUICK_START.md
- [ ] Create Airtable token
- [ ] Get Airtable Base ID
- [ ] Create `.env` file locally
- [ ] Add Staff table to Airtable
- [ ] Add staff records with photos
- [ ] Run `npm run dev` and test
- [ ] Set environment variables on deployment platform
- [ ] Deploy and verify
- [ ] Update staff info in Airtable

## 🚀 Ready to Go!

Your website is now ready to:
- ✓ Fetch staff from Airtable
- ✓ Display them beautifully
- ✓ Update without code changes
- ✓ Handle errors gracefully
- ✓ Work in English & Indonesian

**Start with QUICK_START.md →**

---

Questions? See AIRTABLE_INTEGRATION.md for complete documentation.

**Happy iterating!** 🎊
