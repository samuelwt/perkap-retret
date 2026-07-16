/**
 * TRIP INVENTORY — Google Apps Script backend
 * ---------------------------------------------
 * This file lives INSIDE a Google Sheet (Extensions > Apps Script).
 * It exposes a JSON API that the React frontend calls via fetch().
 *
 * Deployed as a Web App, this script runs as YOU (the sheet owner),
 * so the frontend never needs direct access to the Sheet itself —
 * every read/write is funneled through the functions below, which
 * is also where we enforce your business rules server-side.
 */

// ── CONFIG ──────────────────────────────────────────────────────
// TODO: Replace with your real Google account email before deploying.
// This is the ONLY email allowed to perform admin actions (move, remove, check-in).
const ADMIN_EMAIL = 'samwinson908@gmail.com';

const SHEET_ITEMS = 'Items';
const SHEET_CONFIG = 'Config';

// Column order in the Items sheet. Keeping this as one source of truth
// means if you ever reorder columns in the Sheet, you only fix it here.
const ITEM_COLUMNS = [
  'item_id', 'item_name', 'item_category',
  'item_owner', 'item_removed', 'time_stamp', 'location'
];


// ── ENTRY POINTS ────────────────────────────────────────────────
// Apps Script calls doGet() for GET requests and doPost() for POST.
// Everything else in this file is just a helper these two call into.

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getItems') return jsonResponse({ items: getItems() });
  if (action === 'getConfig') return jsonResponse(getConfig());

  return jsonResponse({ error: 'Unknown action: ' + action });
}

function doPost(e) {
  // NOTE: the frontend sends POST bodies as "text/plain" on purpose (see api.js).
  // This avoids the browser sending a CORS "preflight" OPTIONS request first,
  // which Apps Script web apps don't handle. It's a well-known workaround.
  const body = JSON.parse(e.postData.contents);
  const action = body.action;

  // Anyone (view-only users too) can check items in — that's read-only-ish
  // in spirit, it just bumps a timestamp, so it doesn't need admin auth.
  if (action === 'checkIn') {
    return jsonResponse(checkInItems(body.item_ids));
  }

  // Everything below changes the state of the inventory (location, removal),
  // so we require proof the caller is actually you before doing anything.
  if (!isAdmin(body.idToken)) {
    return jsonResponse({ error: 'Unauthorized: admin sign-in required.' });
  }

  if (action === 'bulkMove') {
    return jsonResponse(bulkMoveItems(body.item_ids, body.new_location));
  }
  if (action === 'removeItem') {
    return jsonResponse(removeItem(body.item_id));
  }
  if (action === 'addItem') {
    return jsonResponse(addItem(body.item));
  }

  return jsonResponse({ error: 'Unknown action: ' + action });
}


// ── AUTH ────────────────────────────────────────────────────────

/**
 * The frontend gets an idToken from Google Sign-In (see Login.jsx later).
 * We verify that token is real by asking Google itself to decode it,
 * then check the email inside it matches YOU. This means even if someone
 * reads your frontend's source code, they can't fake being admin —
 * they'd need to actually sign in as your Google account.
 */
function isAdmin(idToken) {
  if (!idToken) return false;
  try {
    const res = UrlFetchApp.fetch(
      'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken),
      { muteHttpExceptions: true }
    );
    const payload = JSON.parse(res.getContentText());
    return payload.email === ADMIN_EMAIL && payload.email_verified === 'true';
  } catch (err) {
    return false;
  }
}


// ── ITEMS ───────────────────────────────────────────────────────

function getItemsSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ITEMS);
}

/**
 * Reads the whole Items sheet and turns each row into a JS object,
 * e.g. {item_id: 1, item_name: "Sunblock", ..., _row: 5}
 * We keep track of `_row` (the actual sheet row number) so that later,
 * when we need to update ONE item, we know exactly which row to touch
 * instead of re-scanning the whole sheet every time.
 */
function getItems() {
  const sheet = getItemsSheet();
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1); // skip header row

  return rows
    .filter(row => row[0] !== '') // skip blank trailing rows
    .map((row, i) => {
      const item = {};
      ITEM_COLUMNS.forEach((col, idx) => { item[col] = row[idx]; });
      item.time_stamp = item.time_stamp ? new Date(item.time_stamp).toISOString() : null;
      item._row = i + 2; // +2 because row 1 is headers, arrays are 0-indexed
      return item;
    });
}

/**
 * Marks a set of items as "checked" right now. This is what your
 * "checklist + submit" button will call — select items still in place,
 * hit submit, and their time_stamp resets to the current moment.
 */
function checkInItems(itemIds) {
  const sheet = getItemsSheet();
  const items = getItems();
  const now = new Date();
  const timeStampCol = ITEM_COLUMNS.indexOf('time_stamp') + 1;

  let updated = 0;
  itemIds.forEach(id => {
    const item = items.find(i => i.item_id === id);
    if (item) {
      sheet.getRange(item._row, timeStampCol).setValue(now);
      updated++;
    }
  });

  return { success: true, updated: updated };
}

/**
 * Moves a batch of items to a new location in one go (your "bulk move"
 * requirement). Validates the location is a real one from Config first —
 * this stops a bug or bad request from writing garbage into the sheet.
 */
function bulkMoveItems(itemIds, newLocation) {
  const config = getConfig();
  if (config.locations.map(l => l.value).indexOf(newLocation) === -1) {
    return { success: false, error: 'Invalid location: ' + newLocation };
  }

  const sheet = getItemsSheet();
  const items = getItems();
  const locationCol = ITEM_COLUMNS.indexOf('location') + 1;

  let moved = 0;
  itemIds.forEach(id => {
    const item = items.find(i => i.item_id === id);
    if (item) {
      sheet.getRange(item._row, locationCol).setValue(newLocation);
      moved++;
    }
  });

  return { success: true, moved: moved, new_location: newLocation };
}

/**
 * Removal is where rule #3 gets enforced: an item can ONLY be removed
 * if item_owner is 'Beli'. This check happens here, server-side —
 * NOT just in the UI — because the frontend can always be tampered with
 * (browser devtools, direct API calls), but this script cannot.
 */
function removeItem(itemId) {
  const items = getItems();
  const item = items.find(i => i.item_id === itemId);

  if (!item) {
    return { success: false, error: 'Item not found.' };
  }
  if (item.item_owner !== 'Beli') {
    return {
      success: false,
      error: 'Cannot remove "' + item.item_name + '" — it is borrowed from ' +
        item.item_owner + ', not bought. Only bought items can be thrown away.'
    };
  }

  const sheet = getItemsSheet();
  const removedCol = ITEM_COLUMNS.indexOf('item_removed') + 1;
  sheet.getRange(item._row, removedCol).setValue(true);

  return { success: true, item_id: itemId };
}

/**
 * Adds a brand-new item row. Not required by your current spec, but
 * cheap to include now — you'll likely want it once packing starts.
 */
function addItem(item) {
  const sheet = getItemsSheet();
  const items = getItems();
  const nextId = items.length ? Math.max.apply(null, items.map(i => i.item_id)) + 1 : 1;

  const row = ITEM_COLUMNS.map(col => {
    if (col === 'item_id') return nextId;
    if (col === 'item_removed') return false;
    if (col === 'time_stamp') return new Date();
    return item[col] || '';
  });

  sheet.appendRow(row);
  return { success: true, item_id: nextId };
}


// ── CONFIG (enum lists + location coordinates) ─────────────────

/**
 * Reads the Config sheet, which has columns: type | value | x | y
 * and groups it into { categories: [...], owners: [...], locations: [...] }
 * Keeping enums in the Sheet (not hardcoded here) means you can add/edit
 * categories or locations without touching code or redeploying anything.
 */
function getConfig() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG);
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1);

  const config = { categories: [], owners: [], locations: [] };

  rows.forEach(row => {
    const [type, value, x, y] = row;
    if (!value) return;
    if (type === 'category') config.categories.push(value);
    if (type === 'owner') config.owners.push(value);
    if (type === 'location') config.locations.push({ value: value, x: x || null, y: y || null });
  });

  return config;
}


// ── UTIL ────────────────────────────────────────────────────────

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
