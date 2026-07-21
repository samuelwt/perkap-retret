import { useState } from 'react';
import { useInventory } from '../hooks/useInventory.js';
import { bulkMoveItems, removeItem as apiRemoveItem } from '../api.js';
import Login from './Login.jsx';
import GroupedList from '../components/GroupedList.jsx';
import BulkActionBar from '../components/BulkActionBar.jsx';
import ChecklistMode from '../components/ChecklistMode.jsx';
import StaleItemsPanel from '../components/StaleItemsPanel.jsx';

const TABS = [
  { id: 'clusters', label: 'Clusters' },
  { id: 'checklist', label: 'Checklist' },
];

/**
 * The admin page is gated by adminToken (from real Google Sign-In, see
 * Login.jsx). Everything below this point assumes you're really signed
 * in — but as noted elsewhere, that's for UX only; Code.gs independently
 * re-verifies the token on every write, so this gate isn't the actual
 * security boundary.
 *
 * Two tabs share one selection concept:
 *   - Clusters: grouped list with checkboxes + BulkActionBar for
 *     multi-select move/remove (spec point 3's "bulk operations")
 *   - Checklist: the "confirm everything's here, submit" flow (point 5)
 */
export default function Admin() {
  const [adminToken, setAdminToken] = useState(
    () => sessionStorage.getItem('adminToken') || null
  );
  const [activeTab, setActiveTab] = useState('clusters');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [notice, setNotice] = useState(null);

  const { items, config, loading, error, refresh } = useInventory();

  function showNotice(message) {
    setNotice(message);
    setTimeout(() => setNotice(null), 4000);
  }

  function handleSignIn(token) {
    sessionStorage.setItem('adminToken', token);
    setAdminToken(token);
  }

  function handleSignOut() {
    sessionStorage.removeItem('adminToken');
    setAdminToken(null);
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleBulkMove(newLocation) {
    await bulkMoveItems(Array.from(selectedIds), newLocation, adminToken);
    setSelectedIds(new Set());
    refresh();
  }

  async function handleBulkRemove() {
    const results = await Promise.all(
      Array.from(selectedIds).map((id) => apiRemoveItem(id, adminToken))
    );
    const failed = results.filter((r) => !r.success);
    if (failed.length > 0) showNotice(failed[0].error);
    setSelectedIds(new Set());
    refresh();
  }

  if (!adminToken) {
    return <Login onSignIn={handleSignIn} />;
  }

  const selectedItems = items.filter((item) => selectedIds.has(item.item_id));

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-28">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory Master</h1>
          <p className="text-sm text-slate-500">Move, check in, and remove items</p>
        </div>
        <button onClick={handleSignOut} className="text-sm text-slate-500 underline">
          Sign out
        </button>
      </header>

      {notice && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {notice}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-slate-500">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {activeTab === 'clusters' && (
            <>
              <StaleItemsPanel items={items} />
              <GroupedList
                items={items}
                selectable
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
              <BulkActionBar
                selectedItems={selectedItems}
                locations={config?.locations || []}
                onMove={handleBulkMove}
                onRemove={handleBulkRemove}
                onClear={() => setSelectedIds(new Set())}
              />
            </>
          )}

          {activeTab === 'checklist' && (
            <ChecklistMode items={items} onSubmitted={refresh} />
          )}
        </>
      )}
    </div>
  );
}
