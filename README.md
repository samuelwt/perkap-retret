# Trip Inventory Checklist

Free stack: **GitHub Pages** (frontend hosting) + **Google Apps Script** (API)
+ **Google Sheets** (database). No servers, no paid tier.

```
GitHub Pages (React app)  →  Apps Script Web App (validates rules)  →  Google Sheet
```

## Repo layout

```
google-apps-script/   Code.gs — paste this into the Sheet's Apps Script editor
                       SETUP.md — step-by-step Sheet + deployment instructions
frontend/              The React app that gets deployed to GitHub Pages
```

## Order of operations

1. **Do `google-apps-script/SETUP.md` first.** You need the deployed Web
   App URL before the frontend can do anything real.
2. Paste that URL into `frontend/src/config.js` (`APPS_SCRIPT_URL`).
3. Run the frontend locally to test:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open the printed `localhost` URL — try `/` and `/admin`.
4. When ready to publish:
   - Push this repo to GitHub (repo name should match `vite.config.js`'s
     `BASE_PATH`, e.g. a repo named `trip-inventory` → `/trip-inventory/`).
   - In GitHub: **Settings → Pages → Source → GitHub Actions**. That's it —
     the included workflow (`.github/workflows/deploy.yml`) builds and
     publishes automatically on every push to `main`.

## What's built so far (Phases 0–2)

- ✅ Sheet schema + Config tab for your enum lists (with `Beli` added to owners)
- ✅ Apps Script API: `getItems`, `getConfig`, `checkIn`, `bulkMove`, `removeItem`, `addItem`
- ✅ Server-side enforcement of the "only `Beli`-owned items can be removed" rule
- ✅ React app scaffold with `/` (view-only) and `/admin` (gated) routing
- ✅ Auto-deploy pipeline to GitHub Pages

## Still to come

- **Phase 3** — View-only page: real clustering (by category/owner/location/removed)
  and the "not checked in a while" panel sorted oldest-first.
- **Phase 4** — Real Google Sign-In (replacing the dev-only stub in `Login.jsx`),
  drag-and-drop location board, bulk multi-select move, trash-can removal with
  disabled state for non-removable items, checklist submit flow.
- **Phase 5** — Your floor-plan screenshot as the board background, with
  location zones positioned to match it.
- **Phase 6** — Mobile polish + edge-case testing.
