import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  grno: { type: String, unique: true, required: true },

  password: { type: String, required: true },

  contact: { type: String },

  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },

  classType: {
    type: String,
    enum: ["CET", "MNNS","SYSTEM"],
    required: true,
  },
});

export default mongoose.model("User", userSchema);
