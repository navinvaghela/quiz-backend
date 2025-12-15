import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Category", categorySchema);
