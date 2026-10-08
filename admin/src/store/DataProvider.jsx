import { useCallback, useEffect, useMemo, useState } from "react";

import { DataContext } from "./dataContext";
import {
  createRequest,
  deleteRequest,
  listRequest,
  updateRequest,
} from "../lib/api";

/** The collections every admin screen reads from. */
const COLLECTIONS = ["assignments", "papers", "projects", "reviews"];

const EMPTY_RECORDS = {
  assignments: [],
  papers: [],
  projects: [],
  reviews: [],
};

/**
 * Mongo documents carry `_id`; every column, filter and drawer in the console
 * reads `id`, so each row is renamed once on the way in.
 */
function normalise(doc) {
  const { _id, ...rest } = doc;

  return { ...rest, id: _id };
}

/**
 * Holds the whole catalogue in memory, sourced from the Express API
 * (`/admin/<collection>/all`) instead of the old seed data. Reads happen once
 * on mount (and whenever `reload` is called); create / update / delete go
 * straight to the server and fold the returned document back into the list, so
 * what the tables show is always what MongoDB holds.
 *
 * `loading` and `error` let each screen render a spinner or a retry state
 * rather than pretending an unreachable API is an empty catalogue.
 */
export function DataProvider({ children }) {
  const [records, setRecords] = useState(EMPTY_RECORDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches every collection and resolves to the records map. Deliberately
   * contains no setState — callers attach their own callbacks, which keeps the
   * initial effect clear of synchronous state updates
   * (react-hooks/set-state-in-effect).
   */
  const loadAll = useCallback(
    () =>
      Promise.all(COLLECTIONS.map((collection) => listRequest(collection))).then(
        ([assignments, papers, projects, reviews]) => ({
          assignments: assignments.map(normalise),
          papers: papers.map(normalise),
          projects: projects.map(normalise),
          reviews: reviews.map(normalise),
        })
      ),
    []
  );

  // Initial load: `loading` already starts true; results land in the promise
  // callbacks, and the guard ignores anything resolving after unmount.
  useEffect(() => {
    let active = true;

    loadAll()
      .then((next) => {
        if (!active) return;
        setError(null);
        setRecords(next);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadAll]);

  // Manual refresh (reload button, error retry): show the spinner again, then
  // refetch. Only ever called from event handlers, never from an effect.
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setRecords(await loadAll());
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [loadAll]);

  const create = useCallback(async (collection, values) => {
    const payload = await createRequest(collection, values);
    const created = normalise(payload.data);

    setRecords((current) => ({
      ...current,
      [collection]: [created, ...current[collection]],
    }));

    return created;
  }, []);

  const update = useCallback(async (collection, id, values) => {
    const payload = await updateRequest(collection, id, values);
    const updated = normalise(payload.data);

    setRecords((current) => ({
      ...current,
      [collection]: current[collection].map((record) =>
        record.id === id ? updated : record
      ),
    }));

    return updated;
  }, []);

  const remove = useCallback(async (collection, id) => {
    await deleteRequest(collection, id);

    setRecords((current) => ({
      ...current,
      [collection]: current[collection].filter((record) => record.id !== id),
    }));
  }, []);

  // Kept under the name the Overview and Topbar already call: it now refetches
  // the live data instead of restoring sample rows.
  const reset = reload;

  const value = useMemo(
    () => ({ records, loading, error, reload, create, update, remove, reset }),
    [records, loading, error, reload, create, update, remove, reset]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
