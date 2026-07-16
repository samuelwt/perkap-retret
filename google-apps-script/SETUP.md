# Phase 0 Setup — Google Sheet + Apps Script

## 1. Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → create a new blank sheet.
2. Rename it something like `Trip Inventory DB`.
3. Rename the first tab (bottom-left) from `Sheet1` to `Items`.
4. In row 1 of `Items`, add these exact headers (one per column, A through G):

   ```
   item_id | item_name | item_category | item_owner | item_removed | time_stamp | location
   ```

5. Create a second tab called `Config`. Add these headers in row 1:

   ```
   type | value | x | y
   ```

   Then fill in rows below — one row per enum value:

   | type     | value                                   | x   | y   |
   |----------|-----------------------------------------|-----|-----|
   | category | Follow The Voice - Odri, Sam             |     |     |
   | category | Just Draw - Pow                          |     |     |
   | category | Cup War - Jose, DC                       |     |     |
   | category | Tissue - Nath, Odri                      |     |     |
   | category | Infinity Race - Neysa, Reyner             |     |     |
   | category | Battleship - Ray, Jose                   |     |     |
   | category | Water Relay - Rivano, Reyner              |     |     |
   | category | Ibadah                                   |     |     |
   | category | BBQ                                      |     |     |
   | category | P3K                                      |     |     |
   | category | Merchandise                               |     |     |
   | category | General                                   |     |     |
   | owner    | Gereja                                   |     |     |
   | owner    | ko Jeff                                  |     |     |
   | owner    | ko Jul                                   |     |     |
   | owner    | Sam                                       |     |     |
   | owner    | Sekolah Minggu                            |     |     |
   | owner    | WAVE                                      |     |     |
   | owner    | Rivano                                    |     |     |
   | owner    | Raymond                                   |     |     |
   | owner    | Idella                                    |     |     |
   | owner    | Rebecca                                   |     |     |
   | owner    | Neysa                                     |     |     |
   | owner    | Audrey                                    |     |     |
   | owner    | Beli                                      |     |     |
   | location | Kamar para cogan                          | 50  | 50  |
   | location | BBQ Place                                 | 150 | 50  |
   | location | Aula Ibadah                               | 250 | 50  |
   | location | Follow The Voice - Odri, Sam               | 50  | 150 |
   | location | Just Draw - Pow                            | 150 | 150 |
   | location | Cup War - Jose, DC                         | 250 | 150 |
   | location | Tissue - Nath, Odri                        | 50  | 250 |
   | location | Infinity Race - Neysa, Reyner               | 150 | 250 |
   | location | Battleship - Ray, Jose                     | 250 | 250 |
   | location | Water Relay - Rivano, Reyner                | 350 | 250 |

   > The `x`/`y` values are placeholder pixel coordinates for the location
   > board (Phase 5). Once you send the floor-plan screenshot, we'll
   > replace these with real positions matched to the image.
   >
   > Note: I added `Beli` to the owner list — see my note above the code
   > for why. Feel free to rename it in this sheet at any time (e.g. to
   > "Bought"); nothing in the code hardcodes the label itself except the
   > removal-eligibility check, which specifically looks for the string
   > `Beli`. If you rename it, tell me and I'll update `Code.gs` to match.

6. Add a few sample rows to `Items` to test with, e.g.:

   ```
   1 | Sunblock       | General | Beli | FALSE | 2026-07-10T09:00:00.000Z | Kamar para cogan
   2 | Extension cord | BBQ     | ko Jeff | FALSE | 2026-07-10T09:00:00.000Z | BBQ Place
   ```

## 2. Attach Apps Script

1. In the Sheet, go to **Extensions → Apps Script**. This opens a code editor tied to this specific Sheet.
2. Delete the default empty `Code.gs` content and paste in the contents of `Code.gs` from this folder.
3. At the top of the file, replace:
   ```js
   const ADMIN_EMAIL = 'PLACEHOLDER_YOUR_EMAIL@gmail.com';
   ```
   with your actual Google account email — the one you'll sign in with as inventory master.

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Settings:
   - **Execute as:** `Me` (your account) — this is what lets the script read/write the Sheet on behalf of anyone who calls it.
   - **Who has access:** `Anyone` — this makes the URL publicly callable (required, since GitHub Pages is a different domain). Don't worry — this doesn't expose your Sheet directly; it only exposes the specific functions we wrote in `Code.gs`, and admin actions are still gated by the `isAdmin()` email check.
4. Click **Deploy**. The first time, Google will ask you to authorize the script — approve it (it'll show a scary "Google hasn't verified this app" screen since it's your own personal script; click **Advanced → Go to [project name] (unsafe)**, this is expected and safe since you wrote it).
5. Copy the **Web app URL** it gives you (looks like `https://script.google.com/macros/s/XXXXX/exec`). This is the URL the frontend will call.

## 4. Re-deploying after code changes

Whenever you edit `Code.gs`, you must click **Deploy → Manage deployments → Edit (pencil icon) → New version → Deploy** for changes to take effect. Just saving the file is not enough — Apps Script web apps run whatever was live at the last deployment, not your latest saved edit.

---

Once you have the Web App URL, drop it into `frontend/src/config.js` (see Phase 2) and everything connects.
