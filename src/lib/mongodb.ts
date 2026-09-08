import mongoose from "mongoose";
import dns from "dns";

let connectionPromise: Promise<typeof mongoose> | null = null;
let isAdminConnection = false;

export const connectMongoDB = async (admin = false) => {
  const uri = admin ? process.env.MONGODB_ADMIN_URI! : process.env.MONGODB_URI!;

  if (process.env.NODE_ENV !== "production") {
    // mongodb+srv:// needs a DNS TXT lookup to discover the replica set, and
    // some local/ISP router resolvers time out on that record type specifically
    // (SRV and A lookups against the same host work fine). Public resolvers
    // don't have this issue. Set here (not at module top-level) so it always
    // runs in whichever worker/thread actually performs the connection.
    // Production is untouched — this never runs there.
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }

  // If we need a different connection type, force disconnect first
  if (mongoose.connection.readyState === 1) {
    if (isAdminConnection !== admin) {
      console.log(
        `🔄 Switching from ${isAdminConnection ? "admin" : "user"} to ${
          admin ? "admin" : "user"
        } connection`
      );
      await mongoose.disconnect();
      connectionPromise = null;
    } else {
      // Same connection type, reuse existing
      return connectionPromise;
    }
  }

  // Create new connection if not connected or after disconnect
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri)
      .then((conn) => {
        isAdminConnection = admin;
        console.log(`✅ Connected to MongoDB (${admin ? "admin" : "user"})`);
        return conn;
      })
      .catch((error) => {
        console.error(
          `❌ MongoDB ${admin ? "Admin" : "User"} Connection Error:`,
          error
        );
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};
