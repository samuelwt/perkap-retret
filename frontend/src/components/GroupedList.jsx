import { useState } from 'react';
import { groupBy } from '../utils/grouping.js';
import ItemRow from './ItemRow.jsx';

const GROUP_OPTIONS = [
  { field: 'item_category', label: 'Category' },
  { field: 'item_owner', label: 'Owner' },
  { field: 'location', label: 'Location' },
  { field: 'item_removed', label: 'Removed' },
];

/**
 * Your spec point 6: "display items in clusters based on same category
 * / owner / location / removed-status." Rather than four separate
 * screens, this is one component with a pill-tab switcher on top —
 * tap "Location" and every item re-groups by location, tap "Owner"
 * and it re-groups by owner, etc. Each group is a collapsible card.
 *
 * `selectable`/`selectedIds`/`onToggleSelect` are optional — when
 * omitted (view-only page), rows render with no checkboxes at all.
 */
export default function GroupedList({ items, selectable = false, selectedIds, onToggleSelect }) {
  const [groupField, setGroupField] = useState('item_category');
  const [collapsed, setCollapsed] = useState({});

  const groups = groupBy(items, groupField);
  const groupNames = Object.keys(groups).sort();

  function toggleCollapsed(name) {
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {GROUP_OPTIONS.map((opt) => (
          <button
            key={opt.field}
            onClick={() => setGroupField(opt.field)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium ${
              groupField === opt.field
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {groupNames.map((name) => {
          const groupItems = groups[name];
          const isCollapsed = collapsed[name];
          return (
            <div key={name}>
              <button
                onClick={() => toggleCollapsed(name)}
                className="w-full flex justify-between items-center text-left mb-2"
              >
                <h3 className="text-sm font-semibold text-slate-600">
                  {name} <span className="text-slate-400 font-normal">({groupItems.length})</span>
                </h3>
                <span className="text-slate-400 text-xs">{isCollapsed ? 'show' : 'hide'}</span>
              </button>
              {!isCollapsed && (
                <ul className="space-y-2">
                  {groupItems.map((item) => (
                    <ItemRow
                      key={item.item_id}
                      item={item}
                      selectable={selectable}
                      selected={selectedIds?.has(item.item_id)}
                      onToggleSelect={onToggleSelect}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        {groupNames.length === 0 && (
          <p className="text-slate-500 text-center py-8">No items yet.</p>
        )}
      </div>
    </div>
  );
}
