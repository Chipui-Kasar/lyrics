import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectMongoDB = async (admin = false) => {
  const uri = admin ? process.env.MONGODB_ADMIN_URI! : process.env.MONGODB_URI!;

  if (mongoose.connection.readyState >= 1 && !admin) {
    return; // Already connected
  }

  if (admin) {
    if (connectionPromise) {
      await connectionPromise; // Wait for any ongoing connection attempt to complete
    }

    await mongoose.disconnect();
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri)
      .then((conn) => {
        console.log(`✅ Connected to MongoDB (${admin ? "admin" : "user"})`);
        return conn;
      })
      .catch((error) => {
        console.error(
          `❌ MongoDB Connection Error (${admin ? "admin" : "user"}):`,
          error
        );
        connectionPromise = null; // Reset on failure
        throw error;
      });
  }

  return connectionPromise;
};
