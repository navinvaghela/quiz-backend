import Attempt from "../models/Attempt.js";
import Batch from "../models/Batch.js";

export const submitAttempt = async (req, res) => {
  try {
    const userId = req.user;
    const { batchId, answers, startedAt, score } = req.body;

    if (!batchId || !answers || !answers.length) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const attempt = await Attempt.create({
      user: userId,
      batch: batchId,
      answers,
      score,
      totalQuestions: answers.length,
      startedAt,
      submittedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      attemptId: attempt._id,
    });
  } catch (error) {
    console.error("Submit Attempt Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAttemptResult = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await Attempt.findById(attemptId)
      .populate("batch", "batchName")
      .populate("answers.questionId", "question options correctOption");

    if (!attempt) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json({
      success: true,
      result: attempt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyAttempts = async (req, res) => {
  try {
    const userId = req.user;

    console.log("userIduserIduserId", userId)
    const attempts = await Attempt.find({ user: userId })
      .populate("batch", "batchName category")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      attempts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAttemptsAdmin = async (req, res) => {
  try {
    const attempts = await Attempt.find()
      .populate("user", "name grno role")
      .populate("batch", "batchName batchCode")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    console.error("Admin attempts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attempts",
    });
  }
};


