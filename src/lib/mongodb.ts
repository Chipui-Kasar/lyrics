import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;
let isAdminConnection = false;

export const connectMongoDB = async (admin = false) => {
  const uri = admin ? process.env.MONGODB_ADMIN_URI! : process.env.MONGODB_URI!;

  // ✅ Already connected
  if (mongoose.connection.readyState === 1 && connectionPromise) {
    if (isAdminConnection) {
      // ✅ Already connected as admin — always reuse
      return connectionPromise;
    }

    if (admin && !isAdminConnection) {
      // 🔁 Upgrade from user → admin
      await mongoose.disconnect();
    } else {
      // ✅ Reuse user connection
      return connectionPromise;
    }
  }

  // 🔌 Not connected or just disconnected — connect now
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
