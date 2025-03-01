import mongoose from "mongoose";

export const connectMongoDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; // Already connected
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};
