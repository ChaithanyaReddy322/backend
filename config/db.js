import mongoose from "mongoose";

const dbConnect = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable is not defined");
  }

  try {
    await mongoose.connect(uri);
    console.log("📦 Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // rethrow so callers can handle it (and potentially exit)
    throw err;
  }
};

export default dbConnect;
