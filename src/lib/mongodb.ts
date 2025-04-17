import mongoose from "mongoose";

let userConnectionPromise: Promise<typeof mongoose> | null = null;
let adminConnectionPromise: Promise<typeof mongoose> | null = null;

export const connectMongoDB = async (admin = false) => {
  const uri = admin ? process.env.MONGODB_ADMIN_URI! : process.env.MONGODB_URI!;

  // Check readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1) {
    // Already connected
    if (admin && adminConnectionPromise) {
      return adminConnectionPromise;
    }
    if (!admin && userConnectionPromise) {
      return userConnectionPromise;
    }
  }

  // If admin requested, disconnect existing connection and connect anew
  if (admin) {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      adminConnectionPromise = null;
      userConnectionPromise = null; // Also reset user promise to avoid conflicts
    }
    if (!adminConnectionPromise) {
      adminConnectionPromise = mongoose
        .connect(uri)
        .then((conn) => {
          console.log("✅ Connected to MongoDB (admin)");
          return conn;
        })
        .catch((error) => {
          console.error("❌ MongoDB Admin Connection Error:", error);
          adminConnectionPromise = null;
          throw error;
        });
    }
    return adminConnectionPromise;
  } else {
    // User connection
    if (!userConnectionPromise) {
      userConnectionPromise = mongoose
        .connect(uri)
        .then((conn) => {
          console.log("✅ Connected to MongoDB (user)");
          return conn;
        })
        .catch((error) => {
          console.error("❌ MongoDB User Connection Error:", error);
          userConnectionPromise = null;
          throw error;
        });
    }
    return userConnectionPromise;
  }
};
