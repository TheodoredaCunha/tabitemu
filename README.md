# Tabitemu — private Japan tours prototype

A responsive React + Vite prototype for a customizable private-tour service in Japan.

## Features
- Landing page with traveler-story carousel, service explanation, and specialist guide profiles.
- Itinerary builder with travel dates, group size, destination, pace, accommodation preferences, mix-and-match interests, and notes.
- Two sample itinerary drafts: **Explore more** and **Budget-friendly**.
- Editable itinerary stops, add/remove stop controls, and a demo chat assistant.
- Optional add-on services: private HiAce/Alphard, specialist guides, local assistance, and accommodation support.
- English and Indonesian (Bahasa Indonesia) support via the EN / ID switch in the header. Translations live in `src/i18n.js`; the choice is remembered in the browser.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Build

```bash
npm run build
```

## Prototype limitations
Itinerary generation and chat are intentionally stubbed with sample responses. Service requests are only stored in the current browser session; no backend, database, payments, or booking integrations are connected. Images are loaded from Unsplash URLs, so an internet connection is needed to display them.
