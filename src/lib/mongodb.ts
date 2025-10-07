import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;
let isAdminConnection = false;

export const connectMongoDB = async (admin = false) => {
  const uri = admin ? process.env.MONGODB_ADMIN_URI! : process.env.MONGODB_URI!;

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
