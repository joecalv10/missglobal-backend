import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/users.js"; // Ensure this path is correct

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

    // 🔹 Auto-create an admin user if one doesn’t exist
    const adminExists = await User.findOne({ role: "ADMIN" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10); // Hash the password
      await User.create({
        email: "admin@missglobal.com",
        password: hashedPassword,
        country: "Global",
        role: "ADMIN",
      });
      console.log("✅ Default ADMIN user created (email: admin@missglobal.com, password: admin123)");
    } else {
      console.log("✅ Admin already exists");
    }

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
