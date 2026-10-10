import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataContext } from "./dataContext";
import {
  createRequest,
  deleteRequest,
  listRequest,
  updateRequest,
} from "../lib/api";
import { clearSession } from "../lib/session";

/** The collections every admin screen reads from. */
const COLLECTIONS = ["assignments", "papers", "projects", "reviews", "users"];

const EMPTY_RECORDS = {
  assignments: [],
  papers: [],
  projects: [],
  reviews: [],
  users: [],
};

/**
 * Mongo documents carry `_id`; every column, filter and drawer in the console
 * reads `id`, so each row is renamed once on the way in.
 */
function normalise(doc) {
  const { _id, ...rest } = doc;

  return { ...rest, id: _id };
}


export function DataProvider({ children }) {
  const [records, setRecords] = useState(EMPTY_RECORDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * The API answers 401 (no/expired session) or 403 (signed in but not an
   * admin) when the httpOnly cookie no longer matches an admin account — for
   * example a student session from the shared localhost cookie jar, or an
   * expired token. The local session cannot fix itself, so it is dropped and
   * the user is sent back to sign-in rather than left behind a wall of errors.
   */
  const endSession = useCallback(() => {
    clearSession();
    navigate("/login", { replace: true });
  }, [navigate]);

  /**
   * Fetches every collection and resolves to the records map. Shared by the
   * mount effect and `reload`, and deliberately contains no setState — callers
   * attach their own callbacks, which keeps the effect body clear of
   * synchronous state updates (react-hooks/set-state-in-effect).
   */
  const loadAll = useCallback(
    () =>
      Promise.all(COLLECTIONS.map((collection) => listRequest(collection))).then(
        ([assignments, papers, projects, reviews, users]) => ({
          assignments: assignments.map(normalise),
          papers: papers.map(normalise),
          projects: projects.map(normalise),
          reviews: reviews.map(normalise),
          users: users.map(normalise),
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
        if (!active) return;

        // 401/403 mean the cookie no longer represents an admin: sign out.
        if (loadError?.status === 401 || loadError?.status === 403) {
          endSession();
          return;
        }

        setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadAll, endSession]);

  // Manual refresh (reload button, Topbar reset): show the spinner again, then
  // refetch. Only ever called from event handlers, never from an effect.
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setRecords(await loadAll());
    } catch (loadError) {
      if (loadError?.status === 401 || loadError?.status === 403) {
        endSession();
        return;
      }

      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [loadAll, endSession]);

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

  /**
   * Merges a server-returned partial into one local row. Targeted actions
   * with their own endpoints (verify email, block/unblock on Users) use this
   * so the table reflects the change without refetching every collection.
   */
  const patch = useCallback((collection, id, data) => {
    const changes = normalise(data);

    setRecords((current) => ({
      ...current,
      [collection]: current[collection].map((record) =>
        record.id === id ? { ...record, ...changes } : record
      ),
    }));
  }, []);

  // Kept under the name the Overview and Topbar already call: it now refetches
  // the live data instead of restoring sample rows.
  const reset = reload;

  const value = useMemo(
    () => ({ records, loading, error, reload, create, update, remove, patch, reset }),
    [records, loading, error, reload, create, update, remove, patch, reset]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
