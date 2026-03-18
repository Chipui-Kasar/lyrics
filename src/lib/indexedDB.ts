import { openDB, IDBPDatabase } from "idb";

export type LyricRecord = {
  _id: string;
  title: string;
  artistId?: { name?: string } | string;
  lyrics?: string;
  updatedAt?: string;
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

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB("lyrics-db", 2, {
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
      },
    });
  }
  return dbPromise;
}

export async function saveLyricsList(list: LyricRecord[]) {
  const db = await getDB();
  const tx = db.transaction("lyrics", "readwrite");

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
  ]);
}
