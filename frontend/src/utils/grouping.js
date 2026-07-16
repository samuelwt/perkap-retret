import { STALE_HOURS_WARNING, STALE_HOURS_CRITICAL } from '../config.js';

/**
 * Groups an array of items by a given field, e.g.
 *   groupBy(items, 'item_category')
 * returns: { "BBQ": [item, item], "General": [item], ... }
 *
 * We use this same function for all four cluster types your spec asked
 * for (category / owner / location / removed) — it's generic on purpose,
 * so the UI just needs a dropdown that changes WHICH field to pass in,
 * rather than four separate grouping functions.
 */
export function groupBy(items, field) {
  const groups = {};
  items.forEach((item) => {
    // item_removed is a boolean, so give it readable labels instead of "true"/"false"
    const key = field === 'item_removed'
      ? (item[field] ? 'Removed' : 'Active')
      : (item[field] || 'Uncategorized');

    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}

/**
 * How many hours since an item's time_stamp. Used both for the stale
 * panel and for color-coding rows.
 */
export function hoursSince(timeStamp) {
  if (!timeStamp) return Infinity;
  const diffMs = Date.now() - new Date(timeStamp).getTime();
  return diffMs / (1000 * 60 * 60);
}

/**
 * Returns 'critical' | 'warning' | 'ok' based on how long it's been
 * since an item was last checked in. Thresholds live in config.js so
 * you can tune them without hunting through component code.
 */
export function stalenessLevel(timeStamp) {
  const hrs = hoursSince(timeStamp);
  if (hrs >= STALE_HOURS_CRITICAL) return 'critical';
  if (hrs >= STALE_HOURS_WARNING) return 'warning';
  return 'ok';
}

/**
 * Turns a timestamp into "3h ago" / "2d ago" style text — much faster
 * to scan on a phone screen than a full date string.
 */
export function timeAgo(timeStamp) {
  if (!timeStamp) return 'never checked';
  const hrs = hoursSince(timeStamp);
  if (hrs < 1) return `${Math.round(hrs * 60)}m ago`;
  if (hrs < 24) return `${Math.round(hrs)}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

/**
 * Sorts items oldest-checked-first. Removed items are excluded — an
 * item that's been thrown away doesn't need to be "checked" anymore,
 * so it would just be noise at the top of this list.
 */
export function sortByStalest(items) {
  return items
    .filter((item) => !item.item_removed)
    .slice()
    .sort((a, b) => hoursSince(b.time_stamp) - hoursSince(a.time_stamp));
}
