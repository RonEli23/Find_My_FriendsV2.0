import mongoose from "mongoose";

const uri = process.env.DB_MONGO_URI;
console.log(uri)

const connectMongoDB = async () => {
  const retries = 5;

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Attempting MongoDB connection (${i + 1}/${retries})...`);
      await mongoose.connect(uri);
      console.log("✅ Connected to MongoDB!");
      return;
    } catch (err) {
      console.error(`❌ MongoDB connection failed: ${err.message}`);
      if (i < retries - 1) {
        console.log(`🔁 Retrying in 5 seconds...`);
        await new Promise(res => setTimeout(res, 5000));
      } else {
        console.error("❌ Failed to connect to MongoDB after multiple attempts.");
        process.exit(1); // Exit process if MongoDB doesn't connect
      }
    }
  }
};

export default connectMongoDB;
