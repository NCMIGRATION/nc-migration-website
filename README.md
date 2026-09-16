# NC Migration Website

Production-ready React + Vite project for the NC Migration website.

## Tech stack

- React 18
- Vite 5
- lucide-react (icons)

No CSS framework is used — the site is styled entirely with inline styles
plus one small injected `<style>` block (animations, responsive breakpoints)
inside `src/App.jsx`.

## Project structure

```
nc-migration-website/
├── index.html          # HTML entry point
├── package.json
├── vite.config.js
├── vercel.json          # Vercel build config
├── .gitignore
└── src/
    ├── main.jsx         # React root / mounts <App />
    ├── App.jsx          # The entire website (all pages + components)
    └── index.css        # Minimal baseline reset
```

The whole site — navbar, all 7 pages (Home, Work Visa, Visitor Visa, Visit
to Work, UK Visa Extension, About, Contact), the currency ticker, footer,
and floating WhatsApp/call buttons — lives in `src/App.jsx`. Page navigation
is handled with internal React state (no react-router), so there is only
ever one real route (`/`) as far as the browser/Vercel is concerned.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

Output goes to `dist/`. To preview the production build locally:

```bash
npm run preview
```

## Deploy to Vercel

### Option A — GitHub import (recommended)

1. Push this project to your `nc-migration-website` GitHub repo (see
   commands below).
2. Go to https://vercel.com/new and import the repository.
3. Vercel auto-detects the **Vite** framework preset from `vercel.json`:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Click **Deploy**. No environment variables are required.

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel        # first deploy (follow prompts)
vercel --prod # subsequent production deploys
```

## Pushing to your existing GitHub repo

From inside this project folder:

```bash
git init
git add .
git commit -m "Initial production-ready NC Migration site"
git branch -M main
git remote add origin https://github.com/<your-username>/nc-migration-website.git
git push -u origin main
```

If the GitHub repo already has a README/license, pull first:

```bash
git pull origin main --allow-unrelated-histories
```

then resolve any conflicts and push.

## Notes

- Country flags are rendered as native emoji (real Unicode characters, not
  escape codes) and are verified to render correctly in the source.
- The ₹ symbol in the currency ticker is a real character in the source.
- The currency ticker fetches live rates from `exchangerate.host` on load
  and every 30 minutes; if the request fails (e.g. blocked by a network
  policy) it silently falls back to the built-in reference rates so the
  ticker never breaks or shows an error to visitors.
- Images use `picsum.photos` (deterministic seeded placeholders) and
  verified `images.pexels.com` URLs — both are public CDNs and need no API
  key. Swap the `WORK_VISA_IMG` / `VISITOR_VISA_IMG` / `VISIT_TO_WORK_IMG` /
  `UK_EXTENSION_IMG` constants near the top of `App.jsx` for your own
  hosted photography whenever you're ready.
- The NC Migration logo is embedded directly as a base64 data URI inside
  `App.jsx`, so no separate logo file is needed for it to render.
