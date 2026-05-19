import { openDB, IDBPDatabase } from "idb";

export type LyricRecord = {
  id?: string;
  _id: string;
  title: string;
  artist?: string;
  artistId?: { name?: string } | string;
  slug?: string;
  content?: string;
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

const DB_VERSION = 5;
const CACHE_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

function slugify(value = "") {
  try {
    value = decodeURIComponent(value);
  } catch (error) {
    // Keep the original value if it is not URI-encoded.
  }

  return value
    .normalize("NFC")
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function lyricArtistName(record: LyricRecord) {
  if (record.artist) return record.artist;
  if (typeof record.artistId === "string") return record.artistId;
  return record.artistId?.name || "Unknown Artist";
}

function buildUniqueValue(baseValue: string, usedValues: Set<string>) {
  const fallbackValue = baseValue || "lyric";
  let uniqueValue = fallbackValue;
  let suffix = 2;

  while (usedValues.has(uniqueValue)) {
    uniqueValue = `${fallbackValue}-${suffix}`;
    suffix += 1;
  }

  usedValues.add(uniqueValue);
  return uniqueValue;
}

function normalizeLyricRecord(
  record: LyricRecord,
  usedIds: Set<string>,
  usedSlugs: Set<string>
): LyricRecord {
  const databaseId = record._id || record.id || "";
  const artist = lyricArtistName(record);
  const title = record.title || "Untitled";
  const artistSlug = slugify(artist || "unknown-artist");
  const titleSlug = slugify(title || "untitled");
  const idBase = databaseId || `${artistSlug}-${titleSlug}`;
  const slugBase =
    record.slug ||
    (databaseId
      ? `/lyrics/${databaseId}/${titleSlug}_${artistSlug}`
      : `/lyrics/${artistSlug}/${titleSlug}`);

  return {
    ...record,
    id: buildUniqueValue(idBase, usedIds),
    artist,
    title,
    slug: buildUniqueValue(slugBase, usedSlugs),
    content: record.content ?? record.lyrics ?? "",
  };
}

function normalizeLyricList(list: LyricRecord[]) {
  const usedIds = new Set<string>();
  const usedSlugs = new Set<string>();

  return list.map((record) => normalizeLyricRecord(record, usedIds, usedSlugs));
}

function createLyricsStore(db: IDBPDatabase<any>) {
  const lyrics = db.createObjectStore("lyrics", { keyPath: "id" });
  lyrics.createIndex("artist", "artist", { unique: false });
  lyrics.createIndex("slug", "slug", { unique: true });
  lyrics.createIndex("_id", "_id", { unique: false });
}

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB("lyrics-db", DB_VERSION, {
      upgrade(db, oldVersion, _newVersion, transaction) {
        // Version 5 recreates lyrics so the IndexedDB key is the stable
        // MongoDB _id. Older versions derived keys from artist/title, which
        // could collapse or duplicate records and leave the store incomplete.
        if (oldVersion < 5 && db.objectStoreNames.contains("lyrics")) {
          db.deleteObjectStore("lyrics");
        }

        if (!db.objectStoreNames.contains("lyrics")) {
          createLyricsStore(db);
        } else {
          const lyrics = transaction.objectStore("lyrics");
          if (!lyrics.indexNames.contains("artist")) {
            lyrics.createIndex("artist", "artist", { unique: false });
          }
          if (!lyrics.indexNames.contains("slug")) {
            lyrics.createIndex("slug", "slug", { unique: true });
          }
          if (!lyrics.indexNames.contains("_id")) {
            lyrics.createIndex("_id", "_id", { unique: false });
          }
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
  const normalizedLyrics = normalizeLyricList(list);
  const tx = db.transaction("lyrics", "readwrite");

  await tx.store.clear();

  for (const record of normalizedLyrics) {
    await tx.store.add(record);
    console.log("Inserted lyric:", record.id);
  }

  await tx.done;

  const [artistsCount, lyricsCount] = await Promise.all([
    db.count("artists"),
    db.count("lyrics"),
  ]);
  console.log("Artists:", artistsCount);
  console.log("Lyrics:", lyricsCount);
}

export async function getLyricsList(): Promise<LyricRecord[]> {
  const db = await getDB();
  const tx = db.transaction("lyrics", "readonly");
  const all = await tx.store.getAll();
  await tx.done;
  return all as LyricRecord[];
}

export async function getLyricsCount(): Promise<number> {
  const db = await getDB();
  return db.count("lyrics");
}

export async function saveLyric(record: LyricRecord) {
  const db = await getDB();
  const existingRecord =
    ((record.id || record._id
      ? await getLyricById(record.id || record._id)
      : undefined) as LyricRecord | undefined) ?? undefined;
  const mergedRecord = existingRecord
    ? {
        ...existingRecord,
        ...record,
        lyrics: record.lyrics || existingRecord.lyrics,
        content: record.content || existingRecord.content,
      }
    : record;
  const normalizedRecord = normalizeLyricRecord(
    mergedRecord,
    new Set(),
    new Set()
  );

  try {
    await db.add("lyrics", normalizedRecord);
    console.log("Inserted lyric:", normalizedRecord.id);
  } catch (error) {
    if (error instanceof DOMException && error.name === "ConstraintError") {
      await db.put("lyrics", normalizedRecord);
      return;
    }
    throw error;
  }
}

export async function getLyricById(
  id: string
): Promise<LyricRecord | undefined> {
  const db = await getDB();
  const directMatch = (await db.get("lyrics", id)) as LyricRecord | undefined;
  if (directMatch) return directMatch;

  return (await db.getFromIndex(
    "lyrics",
    "_id",
    id
  )) as LyricRecord | undefined;
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

export async function getArtistsCount(): Promise<number> {
  const db = await getDB();
  return db.count("artists");
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
