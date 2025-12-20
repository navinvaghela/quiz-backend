import bcrypt from "bcryptjs";
import User from "./models/User.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
    try {
        // 1️⃣ Connect DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

        // 2️⃣ Check if admin exists
        const existing = await User.findOne({ role: "admin" });
        if (existing) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashed = await bcrypt.hash("admin", 10);
        console.log("hashed",hashed)

        await User.create({
            name: "admin",
            grno: "989898",
            password: hashed,
            role: "admin",
            classType: "SYSTEM"
        });

        console.log("Admin created");
        process.exit(0);
        
    } catch (err) {
        console.error("❌ Error creating admin:", err.message);
        process.exit(1);
    }
  
};

createAdmin();
