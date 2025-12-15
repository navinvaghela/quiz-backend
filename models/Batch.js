import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema({
  batchName: { type: String, required: true },       
  batchCode: { type: String, required: true, unique: true },
  classType: { type: String, enum: ["CTE", "NMMS"], required: true },
  category: { type: String, required: true }, 
  batchDate: { type: Date, default: Date.now },
  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  totalQuestions: { type: Number },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
}, { timestamps: true });

export default mongoose.model("Batch", BatchSchema);
