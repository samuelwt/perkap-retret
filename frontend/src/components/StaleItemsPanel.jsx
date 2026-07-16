import { sortByStalest, stalenessLevel, timeAgo } from '../utils/grouping.js';

// Tailwind classes per staleness level — kept in one lookup so the
// three visual states (fine / getting old / very stale) are defined
// exactly once instead of scattered through JSX with ternaries.
const LEVEL_STYLES = {
  ok: 'bg-white border-slate-200',
  warning: 'bg-amber-50 border-amber-300',
  critical: 'bg-red-50 border-red-300',
};

const LEVEL_BADGE = {
  ok: 'text-slate-500',
  warning: 'text-amber-700',
  critical: 'text-red-700 font-semibold',
};

/**
 * Your spec: "display of items that have not been checked in a long
 * time, listed in chronological order, at the top of the list."
 *
 * This component owns that entirely — it takes the full item list,
 * sorts it itself (oldest time_stamp first), and renders only the
 * items that are actually stale-worthy of attention.
 */
export default function StaleItemsPanel({ items }) {
  const sorted = sortByStalest(items);
  const staleOnly = sorted.filter((item) => stalenessLevel(item.time_stamp) !== 'ok');

  if (staleOnly.length === 0) {
    return (
      <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
        Everything's been checked recently. Nothing stale right now.
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
        Needs checking ({staleOnly.length})
      </h2>
      <ul className="space-y-2">
        {staleOnly.map((item) => {
          const level = stalenessLevel(item.time_stamp);
          return (
            <li
              key={item.item_id}
              className={`rounded-xl border p-3 flex justify-between items-center ${LEVEL_STYLES[level]}`}
            >
              <div>
                <p className="font-medium">{item.item_name}</p>
                <p className="text-xs text-slate-500">{item.location}</p>
              </div>
              <span className={`text-xs ${LEVEL_BADGE[level]}`}>{timeAgo(item.time_stamp)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
