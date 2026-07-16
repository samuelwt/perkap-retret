import { useEffect, useState } from 'react';
import { getItems, getConfig } from '../api.js';
import Login from './Login.jsx';

/**
 * Admin is gated by session state: `adminToken` is null until you sign
 * in with Google (wired properly in Phase 4). Until then, this page
 * only ever renders <Login />, never the real controls — so there's no
 * "flash of admin UI" before the check happens.
 *
 * Once signed in, every write call (move / remove / check-in) sends
 * this token along, and Code.gs re-verifies it server-side. The
 * frontend check here is just for UX — it's not the actual security
 * boundary, the backend is.
 */
export default function Admin() {
  const [adminToken, setAdminToken] = useState(
    () => sessionStorage.getItem('adminToken') || null
  );
  const [items, setItems] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminToken) return;
    Promise.all([getItems(), getConfig()]).then(([itemsData, configData]) => {
      setItems(itemsData);
      setConfig(configData);
      setLoading(false);
    });
  }, [adminToken]);

  function handleSignIn(token) {
    sessionStorage.setItem('adminToken', token);
    setAdminToken(token);
  }

  function handleSignOut() {
    sessionStorage.removeItem('adminToken');
    setAdminToken(null);
  }

  if (!adminToken) {
    return <Login onSignIn={handleSignIn} />;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory Master</h1>
          <p className="text-sm text-slate-500">Move, check in, and remove items</p>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-slate-500 underline"
        >
          Sign out
        </button>
      </header>

      {loading && <p className="text-slate-500">Loading…</p>}

      {!loading && (
        <>
          <p className="text-sm text-slate-500 mb-3">
            {items.length} items loaded · {config?.locations?.length || 0} locations configured
          </p>
          {/*
            Phase 4 replaces this placeholder with:
              - the drag-and-drop location board
              - multi-select + bulk "move to" dropdown
              - the trash can (disabled for non-'Beli' items)
              - the checklist submit flow
            For now this just confirms admin data loads correctly.
          */}
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.item_id} className="bg-white rounded-xl shadow-sm p-4">
                <p className="font-medium">{item.item_name}</p>
                <p className="text-sm text-slate-500">
                  {item.location} · {item.item_owner} · {item.item_category}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
