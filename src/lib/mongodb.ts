import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;
let isAdminConnection = false;

export const connectMongoDB = async (admin = false) => {
  const uri = admin ? process.env.MONGODB_ADMIN_URI! : process.env.MONGODB_URI!;

  if (mongoose.connection.readyState === 1 && connectionPromise) {
    // Already connected
    if (isAdminConnection) {
      // ✅ Connected as admin → never downgrade to user
      return connectionPromise;
    }

    if (!isAdminConnection && admin) {
      // 🔁 Connected as user but request is for admin → upgrade
      await mongoose.disconnect();
    } else {
      // ✅ Connected as user and request is also for user → reuse
      return connectionPromise;
    }
  }

  // Not connected or just disconnected → make new connection
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

  return connectionPromise;
};
