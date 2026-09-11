import mongoose, { Connection, Schema } from "mongoose";
import dns from "dns";

// Two persistent connections — one per credential tier — instead of a
// single shared connection that used to get torn down and rebuilt every
// time a request needed the other tier. That teardown-on-switch design
// crashed any other request whose query was still in flight against the
// connection being disconnected (MongoPoolClosedError / TopologyClosedError
// / "client was closed"). Keeping both connections open side by side means
// an admin write and a concurrent user read never race with each other.
let userConnPromise: Promise<Connection> | null = null;
let adminConnPromise: Promise<Connection> | null = null;
const liveConnections: Connection[] = [];

// Every schema ever defined via registerModel(), keyed by model name. A
// newly opened connection gets every known schema registered on it
// immediately (see registerAllKnownSchemas), and any schema defined *after*
// a connection is already live gets backfilled onto it too. Without this,
// `.populate("artistId")` (or any ref) fails with "Schema hasn't been
// registered for model ..." whenever nothing else in that particular
// request happened to define the referenced model on the same connection
// first — each mongoose Connection keeps its own independent registry.
const schemaRegistry = new Map<string, Schema>();

function registerOnConnection(conn: Connection, name: string, schema: Schema) {
  if (!conn.models[name]) conn.model(name, schema);
}

function registerAllKnownSchemas(conn: Connection) {
  for (const [name, schema] of schemaRegistry) {
    registerOnConnection(conn, name, schema);
  }
}

function setupDevDnsWorkaround() {
  if (process.env.NODE_ENV !== "production") {
    // mongodb+srv:// needs a DNS TXT lookup to discover the replica set, and
    // some local/ISP router resolvers time out on that record type
    // specifically (SRV and A lookups against the same host work fine).
    // Public resolvers don't have this issue. Set here (not at module
    // top-level) so it always runs in whichever worker/thread actually
    // performs the connection. Production is untouched — this never runs
    // there.
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }
}

function openConnection(admin: boolean): Promise<Connection> {
  const uri = admin ? process.env.MONGODB_ADMIN_URI! : process.env.MONGODB_URI!;
  return mongoose
    .createConnection(uri)
    .asPromise()
    .then((conn) => {
      registerAllKnownSchemas(conn);
      liveConnections.push(conn);
      console.log(`✅ Connected to MongoDB (${admin ? "admin" : "user"})`);
      return conn;
    })
    .catch((error) => {
      console.error(
        `❌ MongoDB ${admin ? "Admin" : "User"} Connection Error:`,
        error
      );
      if (admin) adminConnPromise = null;
      else userConnPromise = null;
      throw error;
    });
}

/**
 * Connects (once — subsequent calls reuse the same live connection) to the
 * requested credential tier and returns it directly. Callers get their
 * models from this connection explicitly (see e.g. getArtistLyricsModels in
 * @/models/model) rather than through any ambient/implicit context — an
 * earlier version of this function used AsyncLocalStorage to make the
 * connection "ambient" so call sites wouldn't need to change, but
 * `enterWith` turned out to be unreliable under real concurrent fan-out
 * (verified empirically: interleaved requests lost each other's context).
 * Passing the connection explicitly has no such risk.
 */
export const connectMongoDB = async (admin = false): Promise<Connection> => {
  setupDevDnsWorkaround();

  if (admin) {
    if (!adminConnPromise) adminConnPromise = openConnection(true);
    return adminConnPromise;
  }

  if (!userConnPromise) userConnPromise = openConnection(false);
  return userConnPromise;
};

/**
 * Defines (once per connection, cached) a model against the given
 * connection. Every schema ever registered this way is eagerly mirrored
 * onto every connection — live ones immediately, new ones as they open —
 * so populate() refs resolve regardless of which route/connection touches
 * a given model first.
 */
export function registerModel(
  conn: Connection,
  name: string,
  schema: Schema
): any {
  schemaRegistry.set(name, schema);
  for (const c of liveConnections) registerOnConnection(c, name, schema);
  return conn.models[name] || conn.model(name, schema);
}
