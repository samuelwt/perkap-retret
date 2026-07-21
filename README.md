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

## What's built so far (Phases 0–4)

- ✅ Sheet schema + Config tab for your enum lists (with `Beli` added to owners)
- ✅ Apps Script API: `getItems`, `getConfig`, `checkIn`, `bulkMove`, `removeItem`, `addItem`
- ✅ Server-side enforcement of the "only `Beli`-owned items can be removed" rule
- ✅ React app scaffold with `/` (view-only) and `/admin` (gated) routing
- ✅ Auto-deploy pipeline to GitHub Pages
- ✅ View-only page: stale-items panel (oldest-first) + clustered view (category/owner/location/removed)
- ✅ Real Google Sign-In gating the admin page (see `GOOGLE_SIGNIN_SETUP.md`)
- ✅ Clusters tab: multi-select checkboxes + bulk "move to" dropdown + bulk remove
- ✅ Checklist tab: confirm-present flow that bulk-updates `time_stamp` on submit
- ✅ Removal safety: UI disables/blocks removing non-`Beli` items, backend rejects it regardless

## Still to come

- **Phase 5** — Your floor-plan screenshot as the board's background image, with
  location zone coordinates recalibrated to match it (currently placeholder x/y values).
- **Phase 6** — Mobile polish pass + edge-case testing (empty states, offline, rapid taps).
