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

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
