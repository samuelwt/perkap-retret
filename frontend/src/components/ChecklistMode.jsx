import { useEffect, useState } from 'react';
import { checkInItems } from '../api.js';

/**
 * Your spec point 5: "check items at any point, fill out a checklist +
 * submit, it updates time_stamp of last checking."
 *
 * UX choice: every active (non-removed) item starts CHECKED, meaning
 * "confirmed present by default." You uncheck the ones that are
 * actually missing, then hit Submit. Only the still-checked items get
 * their time_stamp bumped — items you unchecked are deliberately left
 * alone, so they'll show up as stale/unconfirmed on the panel until
 * you resolve wherever they actually are. This is safer than the
 * reverse (starting all unchecked), since it can't silently mark
 * something "checked" that you never actually looked at.
 */
export default function ChecklistMode({ items, onSubmitted }) {
  const activeItems = items.filter((item) => !item.item_removed);
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  // Reset to "everything checked" whenever the underlying item list
  // changes (e.g. after a fresh submit, or items were moved elsewhere).
  useEffect(() => {
    setCheckedIds(new Set(activeItems.map((item) => item.item_id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  function toggle(id) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    await checkInItems(Array.from(checkedIds));
    setSubmitting(false);
    onSubmitted();
  }

  const missingCount = activeItems.length - checkedIds.size;

  return (
    <div className="pb-24">
      <p className="text-sm text-slate-500 mb-3">
        Everything starts checked. Uncheck anything that's actually missing, then submit.
      </p>

      <ul className="space-y-2">
        {activeItems.map((item) => (
          <li key={item.item_id} className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-3">
            <input
              type="checkbox"
              checked={checkedIds.has(item.item_id)}
              onChange={() => toggle(item.item_id)}
              className="w-5 h-5 shrink-0 accent-emerald-600"
            />
            <div className="min-w-0 flex-1">
              <p className={`font-medium truncate ${!checkedIds.has(item.item_id) ? 'text-red-600' : ''}`}>
                {item.item_name}
              </p>
              <p className="text-xs text-slate-500 truncate">{item.location}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3 shadow-lg">
        {missingCount > 0 && (
          <span className="text-sm text-red-600 shrink-0">{missingCount} missing</span>
        )}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 bg-slate-900 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : `Submit check (${checkedIds.size} confirmed)`}
        </button>
      </div>
    </div>
  );
}
