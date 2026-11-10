import { openDB, IDBPDatabase } from 'idb';

export const DB_NAME = 'pexly_storage';
const DB_VERSION = 1;

export interface PexlyDB {
  wallets: {
    key: string;
    value: any;
  };
  swap_history: {
    key: string;
    value: any;
  };
  settings: {
    key: string;
    value: any;
  };
}

let dbPromise: Promise<IDBPDatabase<PexlyDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<PexlyDB>(DB_NAME, DB_VERSION, {
      // Another tab is trying to delete/upgrade the DB (e.g. logout wipe):
      // release our connection so it is not blocked, and reopen on next use.
      blocking(_current, _blocked, event) {
        dbPromise = null;
        try {
          (event?.target as IDBDatabase | undefined)?.close();
        } catch {
          // already closed
        }
      },
      // The browser dropped the connection (storage cleared, etc.).
      terminated() {
        dbPromise = null;
      },
      upgrade(db) {
        if (!db.objectStoreNames.contains('wallets')) {
          db.createObjectStore('wallets');
        }
        if (!db.objectStoreNames.contains('swap_history')) {
          db.createObjectStore('swap_history');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    }).catch((err) => {
      // Do not cache a failed open: otherwise every later read/write in this
      // tab rejects with the same error until a full page reload.
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

export async function getValue(store: keyof PexlyDB, key: string) {
  const db = await getDB();
  return db.get(store, key);
}

export async function setValue(store: keyof PexlyDB, key: string, value: any) {
  const db = await getDB();
  await db.put(store, value, key);
  // Read back: a put that resolved but did not persist must not be accepted.
  const stored = await db.get(store, key);
  if (stored === undefined) {
    throw new Error("IDB_WRITE_VERIFY_FAILED");
  }
}

export async function deleteValue(store: keyof PexlyDB, key: string) {
  const db = await getDB();
  return db.delete(store, key);
}

export async function getAllKeys(store: keyof PexlyDB): Promise<string[]> {
  const db = await getDB();
  return (await db.getAllKeys(store)).map(String);
}

/**
 * Empties every object store and verifies they are empty. Used by the logout
 * wipe when deleteDatabase() is blocked by another connection.
 */
export async function clearAllStores(): Promise<boolean> {
  const stores: Array<keyof PexlyDB> = ["wallets", "swap_history", "settings"];
  const db = await getDB();
  for (const store of stores) {
    await db.clear(store);
    if ((await db.count(store)) !== 0) return false;
  }
  return true;
}

export async function getAllValues(store: keyof PexlyDB) {
  const db = await getDB();
  return db.getAll(store);
}

/**
 * Resets the cached IDB connection so a fresh one is opened on next access.
 * Call this after deleting the database (e.g. on logout).
 */
export function resetDBConnection(): void {
  dbPromise = null;
}

/**
 * Close the active IndexedDB connection before deleting the database.
 * deleteDatabase() remains blocked while this module keeps a connection open.
 */
export async function closeDBConnection(): Promise<void> {
  const pending = dbPromise;
  dbPromise = null;
  if (!pending) return;
  try {
    const db = await pending;
    db.close();
  } catch {
    // The connection never opened; there is nothing left to close.
  }
}
