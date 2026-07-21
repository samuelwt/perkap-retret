import { useInventory } from '../hooks/useInventory.js';
import GroupedList from '../components/GroupedList.jsx';

/**
 * Clustered view by category/owner/location/removed, with a switcher.
 *
 * It polls every 15s (see useInventory(15000) below) so if you move an
 * item from the admin side, anyone with this page open sees it update
 * on its own — no manual refresh needed. This page never calls any
 * write endpoint, so there's nothing here that could accidentally
 * change data even if someone pokes around in devtools.
 */
export default function ViewOnly() {
  const { items, loading, error } = useInventory(15000);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Perkap Retret ALIVE 2026</h1>
        <p className="text-sm text-slate-500">Buat checklist barang barang selama acara.</p>
      </header>

      {loading && <p className="text-slate-500">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && <GroupedList items={items} />}
    </div>
  );
}
