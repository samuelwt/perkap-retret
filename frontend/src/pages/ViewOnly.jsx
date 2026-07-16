import { useEffect, useState } from 'react';
import { getItems } from '../api.js';

/**
 * This is a deliberately simple version for now — it proves the
 * connection to the Sheet works end to end (fetch items, render them).
 *
 * Phase 3 replaces the flat list below with:
 *   - a "not checked in a while" panel pinned to the top, sorted oldest-first
 *   - collapsible clusters by category / owner / location / removed-status
 *
 * Keeping this page 100% read-only (no buttons that change data) is
 * intentional — it's the link you hand to everyone else on the trip.
 */
export default function ViewOnly() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch(() => setError('Could not load the inventory. Check your connection.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Trip Inventory</h1>
        <p className="text-sm text-slate-500">Live status — view only</p>
      </header>

      {loading && <p className="text-slate-500">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.item_id}
              className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.item_name}</p>
                <p className="text-sm text-slate-500">
                  {item.location} · {item.item_owner}
                </p>
              </div>
              {item.item_removed && (
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                  removed
                </span>
              )}
            </li>
          ))}
          {items.length === 0 && (
            <p className="text-slate-500 text-center py-8">No items yet.</p>
          )}
        </ul>
      )}
    </div>
  );
}
