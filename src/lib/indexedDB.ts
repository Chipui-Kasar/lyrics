import { openDB, IDBPDatabase } from "idb";

export type LyricRecord = {
  _id: string;
  title: string;
  artistId?: { name?: string } | string;
  lyrics?: string;
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
    dbPromise = openDB("lyrics-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("lyrics")) {
          db.createObjectStore("lyrics", { keyPath: "_id" });
        }
        if (!db.objectStoreNames.contains("metadata")) {
          db.createObjectStore("metadata");
        }
      },
    });
  }
  return dbPromise;
}

export async function saveLyricsList(list: LyricRecord[]) {
  const db = await getDB();
  const tx = db.transaction("lyrics", "readwrite");
  for (const item of list) {
    await tx.store.put(item);
  }
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
