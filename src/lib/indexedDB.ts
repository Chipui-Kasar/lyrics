import { openDB, IDBPDatabase } from "idb";

export type LyricRecord = {
  _id: string;
  title: string;
  artistId?: { name?: string } | string;
  lyrics?: string;
  updatedAt?: string;
  lyricsHash?: string;
  lyricsLength?: number;
};

export type ArtistRecord = {
  _id: string;
  name: string;
  image?: string;
  genre?: string[];
  village?: string;
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
  };
  songCount?: number;
  updatedAt?: string;
};

export type MetadataRecord = {
  totalCount: number;
  lastUpdated?: string;
  savedAt: number; // epoch ms
};

export type PageCacheRecord<T = unknown> = {
  key: string;
  data: T;
  savedAt: number;
  expiresAt: number;
  version: number;
  meta?: {
    totalCount?: number;
    lastUpdated?: string;
    hash?: string;
    length?: number;
  };
};

const DB_VERSION = 3;
const CACHE_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB("lyrics-db", DB_VERSION, {
      upgrade(db, oldVersion) {
        // Create lyrics store
        if (!db.objectStoreNames.contains("lyrics")) {
          db.createObjectStore("lyrics", { keyPath: "_id" });
        }
        // Create metadata store
        if (!db.objectStoreNames.contains("metadata")) {
          db.createObjectStore("metadata");
        }
        // Create artists store (new in version 2)
        if (oldVersion < 2 && !db.objectStoreNames.contains("artists")) {
          db.createObjectStore("artists", { keyPath: "_id" });
        }
        if (oldVersion < 3 && !db.objectStoreNames.contains("pages")) {
          db.createObjectStore("pages", { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveLyricsList(list: LyricRecord[]) {
  const db = await getDB();
  const tx = db.transaction("lyrics", "readwrite");
  await tx.store.clear();

  // Batch operations for better performance
  const promises = list.map((item) => tx.store.put(item));
  await Promise.all(promises);
  await tx.done;
}

export async function getLyricsList(): Promise<LyricRecord[]> {
  const db = await getDB();
  const tx = db.transaction("lyrics", "readonly");
  const all = await tx.store.getAll();
  await tx.done;
  return all as LyricRecord[];
}

export async function saveLyric(record: LyricRecord) {
  const db = await getDB();
  await db.put("lyrics", record);
}

export async function getLyricById(
  id: string
): Promise<LyricRecord | undefined> {
  const db = await getDB();
  return (await db.get("lyrics", id)) as LyricRecord | undefined;
}

export async function saveMetadata(meta: MetadataRecord) {
  const db = await getDB();
  await db.put("metadata", meta, "lyrics-metadata");
}

export async function getMetadata(): Promise<MetadataRecord | null> {
  const db = await getDB();
  const meta = (await db.get("metadata", "lyrics-metadata")) as
    | MetadataRecord
    | undefined;
  return meta ?? null;
}

// ==================== ARTISTS OPERATIONS ====================

export async function saveArtistsList(list: ArtistRecord[]) {
  const db = await getDB();
  const tx = db.transaction("artists", "readwrite");
  await tx.store.clear();

  // Batch operations for better performance
  const promises = list.map((item) => tx.store.put(item));
  await Promise.all(promises);
  await tx.done;
}

export async function getArtistsList(): Promise<ArtistRecord[]> {
  const db = await getDB();
  const tx = db.transaction("artists", "readonly");
  const all = await tx.store.getAll();
  await tx.done;
  return all as ArtistRecord[];
}

export async function saveArtist(record: ArtistRecord) {
  const db = await getDB();
  await db.put("artists", record);
}

export async function getArtistById(
  id: string
): Promise<ArtistRecord | undefined> {
  const db = await getDB();
  return (await db.get("artists", id)) as ArtistRecord | undefined;
}

export async function saveArtistsMetadata(meta: MetadataRecord) {
  const db = await getDB();
  await db.put("metadata", meta, "artists-metadata");
}

export async function getArtistsMetadata(): Promise<MetadataRecord | null> {
  const db = await getDB();
  const meta = (await db.get("metadata", "artists-metadata")) as
    | MetadataRecord
    | undefined;
  return meta ?? null;
}

export async function clearArtistsCache() {
  const db = await getDB();
  const tx = db.transaction("artists", "readwrite");
  await tx.store.clear();
  await tx.done;
}

export async function clearLyricsCache() {
  const db = await getDB();
  const tx = db.transaction("lyrics", "readwrite");
  await tx.store.clear();
  await tx.done;
}

export async function clearAllCache() {
  const db = await getDB();
  await Promise.all([
    db.clear("lyrics"),
    db.clear("artists"),
    db.clear("metadata"),
    db.clear("pages"),
  ]);
}

export async function savePageCache<T>(
  key: string,
  data: T,
  options: {
    ttlMs: number;
    meta?: PageCacheRecord<T>["meta"];
  }
) {
  const db = await getDB();
  const record: PageCacheRecord<T> = {
    key,
    data,
    savedAt: Date.now(),
    expiresAt: Date.now() + options.ttlMs,
    version: CACHE_VERSION,
    meta: options.meta,
  };
  await db.put("pages", record);
  return record;
}

export async function getPageCache<T>(
  key: string
): Promise<PageCacheRecord<T> | null> {
  const db = await getDB();
  const record = (await db.get("pages", key)) as
    | PageCacheRecord<T>
    | undefined;

  if (!record || record.version !== CACHE_VERSION) {
    return null;
  }

  return record;
}

export async function deletePageCache(key: string) {
  const db = await getDB();
  await db.delete("pages", key);
}
