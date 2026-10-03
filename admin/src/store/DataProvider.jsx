import { useCallback, useEffect, useMemo, useState } from "react";

import { DataContext } from "./dataContext";
import { seedRecords } from "./seed";

const STORAGE_KEY = "campus-connect-admin:data:v1";

/** The collections every admin screen reads from. */
const COLLECTIONS = ["assignments", "papers", "projects", "reviews"];

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Reads the persisted snapshot, refusing anything that is not the full shape. */
function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    const snapshot = {};

    for (const key of COLLECTIONS) {
      if (!Array.isArray(parsed?.[key])) return null;

      snapshot[key] = parsed[key];
    }

    return snapshot;
  } catch {
    // Unreadable JSON or a blocked localStorage: fall back to the sample data.
    return null;
  }
}

/**
 * Holds the whole catalogue in memory and mirrors it into localStorage, so the
 * create / edit / delete flows survive a page reload while the Express API has
 * no update or delete endpoints of its own.
 */
export function DataProvider({ children }) {
  const [records, setRecords] = useState(() => readStored() ?? seedRecords());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // A full or disabled localStorage must not break the tables.
    }
  }, [records]);

  const create = useCallback((collection, values) => {
    const record = {
      ...values,
      id: newId(),
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    setRecords((current) => ({
      ...current,
      [collection]: [record, ...current[collection]],
    }));

    return record;
  }, []);

  const update = useCallback((collection, id, values) => {
    setRecords((current) => ({
      ...current,
      [collection]: current[collection].map((record) =>
        record.id === id
          ? { ...record, ...values, updatedAt: new Date().toISOString() }
          : record
      ),
    }));
  }, []);

  const remove = useCallback((collection, id) => {
    setRecords((current) => ({
      ...current,
      [collection]: current[collection].filter((record) => record.id !== id),
    }));
  }, []);

  const reset = useCallback(() => setRecords(seedRecords()), []);

  const value = useMemo(
    () => ({ records, create, update, remove, reset }),
    [records, create, update, remove, reset]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
