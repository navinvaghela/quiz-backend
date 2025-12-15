import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Exam", examSchema);
