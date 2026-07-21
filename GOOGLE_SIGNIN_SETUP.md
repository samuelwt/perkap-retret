# Phase 4 setup — Google Sign-In

This gives you a `GOOGLE_CLIENT_ID` to paste into `frontend/src/config.js`.
It's separate from the Apps Script deployment you already did — this one
is specifically for verifying *who's signing in*, not for the Sheet API.

## 1. Create an OAuth Client ID

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Create a new project (or reuse one) — name doesn't matter, e.g. "Trip Inventory".
3. Go to **APIs & Services → OAuth consent screen**.
   - User type: **External**.
   - Fill in the required fields (app name, your email). You can leave it in "Testing" mode — you don't need to publish it, since only you will ever sign in.
   - Under **Test users**, add your own Google account email.
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
   - Application type: **Web application**.
   - Name: anything, e.g. "Trip Inventory Web".
   - **Authorized JavaScript origins** — add both of these (adjust the GitHub Pages one to match your actual repo):
     ```
     http://localhost:5173
     https://yourusername.github.io
     ```
     Note: this is the *origin* only (scheme + domain), no path — so even though your site lives at `.../trip-inventory/`, you only enter `https://yourusername.github.io` here.
5. Click **Create**. Copy the **Client ID** shown (ends in `.apps.googleusercontent.com`).

## 2. Plug it in

Paste it into `frontend/src/config.js`:

```js
export const GOOGLE_CLIENT_ID = '123456789-abcdefg.apps.googleusercontent.com';
```

## 3. Confirm ADMIN_EMAIL matches

Double check `google-apps-script/Code.gs`'s `ADMIN_EMAIL` is set to the *exact same* Google account you added as a test user above. If they don't match, sign-in will succeed (Google lets you log in fine) but every move/remove action will fail with "Unauthorized" — because `isAdmin()` in Code.gs checks the signed-in email against `ADMIN_EMAIL` specifically, not just "did someone sign in."

## 4. Test it

```bash
cd frontend
npm install
npm run dev
```

Go to `/admin` — you should see Google's real sign-in button instead of the old "(Dev only) Simulate sign-in" one. Sign in, and you should land on the Clusters tab with your live item data.

If sign-in fails with a Google error page instead of showing the button at all, it's almost always the **Authorized JavaScript origins** step — Google is strict about exact matches (no trailing slash, correct scheme).
