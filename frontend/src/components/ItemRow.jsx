import { timeAgo, stalenessLevel } from '../utils/grouping.js';

const DOT_COLOR = {
  ok: 'bg-emerald-400',
  warning: 'bg-amber-400',
  critical: 'bg-red-400',
};

/**
 * One row = one item. `selectable` toggles whether a checkbox renders
 * on the left (used in Admin for bulk operations) — the view-only page
 * passes selectable={false} and gets a plain read-only row.
 */
export default function ItemRow({ item, selectable, selected, onToggleSelect }) {
  const level = stalenessLevel(item.time_stamp);

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

      <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_COLOR[level]}`} title="Check-in freshness" />

      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{item.item_name}</p>
        <p className="text-xs text-slate-500 truncate">
          {item.location} · {item.item_owner}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-xs text-slate-400">{timeAgo(item.time_stamp)}</p>
        {item.item_removed && (
          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">removed</span>
        )}
      </div>
    </li>
  );
}
