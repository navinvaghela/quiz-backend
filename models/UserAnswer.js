import mongoose from "mongoose";

const userAnswerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  selectedIndex: Number,
  isCorrect: Boolean
});

export default mongoose.model("UserAnswer", userAnswerSchema);
