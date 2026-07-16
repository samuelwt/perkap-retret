import { APPS_SCRIPT_URL } from './config.js';

/**
 * Every function below is a thin wrapper around fetch(). Centralizing
 * them here means components never construct URLs or parse JSON
 * themselves — they just call e.g. api.getItems() and get data back.
 * If the backend URL or shape ever changes, this is the only file
 * that needs to change.
 */

export async function getItems() {
  const res = await fetch(`${APPS_SCRIPT_URL}?action=getItems`);
  const data = await res.json();
  return data.items;
}

export async function getConfig() {
  const res = await fetch(`${APPS_SCRIPT_URL}?action=getConfig`);
  return res.json();
}

export async function checkInItems(itemIds) {
  return postAction({ action: 'checkIn', item_ids: itemIds });
}

export async function bulkMoveItems(itemIds, newLocation, idToken) {
  return postAction({ action: 'bulkMove', item_ids: itemIds, new_location: newLocation, idToken });
}

export async function removeItem(itemId, idToken) {
  return postAction({ action: 'removeItem', item_id: itemId, idToken });
}

/**
 * IMPORTANT: Content-Type is deliberately 'text/plain', not
 * 'application/json'. If we used application/json, the browser would
 * first send a CORS "preflight" OPTIONS request, which Apps Script web
 * apps don't respond to correctly — the whole call would silently fail.
 * Sending as text/plain sidesteps the preflight; Code.gs still parses
 * the body as JSON on the other end (e.postData.contents).
 */
async function postAction(payload) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
