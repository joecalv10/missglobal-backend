import mongoose from "mongoose";

const connectDB = async () => {
  console.log("🔍 Checking MongoDB URI:", process.env.MONGO_URI);

  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing! Check Railway environment variables.");
    process.exit(1); // Exit process with failure
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
