/**
 * Appears as a sticky bar once one or more items are selected (via
 * checkboxes in GroupedList or ChecklistMode). This is what makes
 * "select 5 rows and move them all at once" (your spec point 3) work —
 * one dropdown, one click, all selected items move together.
 *
 * Removal safety: the Remove button is disabled — not just warned
 * against, actually unclickable — the moment ANY selected item isn't
 * owned by 'Beli'. This is the "make this action impossible in the
 * first place" option from your spec point 4, rather than a dialog
 * you'd have to dismiss. The backend re-checks this regardless (see
 * removeItem() in Code.gs) in case this UI is ever bypassed.
 */
export default function BulkActionBar({ selectedItems, locations, onMove, onRemove, onClear }) {
  if (selectedItems.length === 0) return null;

  const allRemovable = selectedItems.every((item) => item.item_owner === 'Beli');
  const noneRemovable = selectedItems.every((item) => item.item_owner !== 'Beli');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white px-4 py-3 flex items-center gap-3 shadow-lg z-20">
      <span className="text-sm shrink-0">{selectedItems.length} selected</span>

      <select
        onChange={(e) => e.target.value && onMove(e.target.value)}
        defaultValue=""
        className="flex-1 min-w-0 bg-slate-800 text-white text-sm rounded-lg px-2 py-2 border border-slate-700"
      >
        <option value="" disabled>Move to…</option>
        {locations.map((loc) => (
          <option key={loc.value} value={loc.value}>{loc.value}</option>
        ))}
      </select>

      <button
        onClick={onRemove}
        disabled={!allRemovable}
        title={
          allRemovable
            ? 'Remove selected items'
            : noneRemovable
              ? "These items are borrowed, not bought — they can't be thrown away."
              : "Some selected items are borrowed — deselect them to remove the rest."
        }
        className={`shrink-0 text-sm px-3 py-2 rounded-lg ${
          allRemovable
            ? 'bg-red-600 text-white'
            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
        }`}
      >
        Remove
      </button>

      <button onClick={onClear} className="shrink-0 text-sm text-slate-400 underline">
        Clear
      </button>
    </div>
  );
}
