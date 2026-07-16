import { useCallback, useEffect, useState } from 'react';
import { getItems, getConfig } from '../api.js';

/**
 * Both ViewOnly and Admin need the same two things: the item list and
 * the Config sheet (categories/owners/locations). Rather than each
 * page writing its own fetch + loading + error state, they both call
 * this one hook.
 *
 * `pollMs` is optional — pass e.g. 15000 to auto-refresh every 15s
 * (used on the view-only page so people see live updates without
 * reloading). Admin doesn't poll by default, since an auto-refresh
 * mid-drag or mid-selection would be a bad, disorienting experience —
 * it refetches manually after each write instead (see refresh()).
 */
export function useInventory(pollMs = null) {
  const [items, setItems] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [itemsData, configData] = await Promise.all([getItems(), getConfig()]);
      setItems(itemsData);
      setConfig(configData);
      setError(null);
    } catch (err) {
      setError('Could not load the inventory. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (!pollMs) return;
    const interval = setInterval(refresh, pollMs);
    return () => clearInterval(interval);
  }, [refresh, pollMs]);

  return { items, config, loading, error, refresh };
}
