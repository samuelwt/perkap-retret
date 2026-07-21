import { useState } from 'react';

/**
 * One row = one item. `selectable` toggles whether a real select
 * checkbox renders on the left (used in Admin for bulk operations).
 * When not selectable (view-only page), a `number` marks position in
 * the group instead, and a checkbox renders on the right — clickable,
 * but purely local UI state for now (no backend call), a placeholder
 * for a future per-person confirm action.
 */
export default function ItemRow({ item, number, selectable, selected, onToggleSelect }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <li
      className={`bg-white rounded-xl shadow-sm p-3 flex items-center gap-3 ${
        item.item_removed ? 'opacity-50' : ''
      }`}
    >
      {selectable && (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(item.item_id)}
          className="w-5 h-5 shrink-0 accent-slate-900"
          // Bigger tap target than the browser default — matters a lot
          // on a phone where a tiny checkbox is easy to miss.
        />
      )}

      <span className="w-5 shrink-0 text-sm text-slate-400 text-center">{number}</span>

      <p className="min-w-0 flex-1 font-medium truncate">{item.item_name}</p>

      {!selectable && (
        <input
          type="checkbox"
          checked={confirmed}
          onChange={() => setConfirmed((prev) => !prev)}
          className="w-5 h-5 shrink-0 accent-slate-900"
        />
      )}
    </li>
  );
}
