import Question from "../models/Question.js";
import QuestionHistory from "../models/QuestionHistory.js";

export const getAllQuestions = async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
};

export const getQuestionsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ success: false, message: "Category required" });
    }

    const questions = await Question.find({ category });

    res.json({
      success: true,
      questions
    });
    
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadBulkQuestion = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ success: false, message: "Invalid format" });
    }

    for (const q of questions) {
      await Question.findOneAndUpdate(
        { question: q.question },     // Find by question text
        { $set: q },                  // Overwrite entire question
        { upsert: true, new: true }   // upsert → insert if not found
      );
    }

    res.json({
      success: true,
      message: "Questions uploaded (inserted or updated) successfully!"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createQuestion = async (req, res) => {
  const question = await Question.create({
    ...req.body,
    createdBy: req.user.id,
  });

  await QuestionHistory.create({
    questionId: question._id,
    action: "CREATE",
    newData: question,
    performedBy: req.user._id,
  });

  res.json({ success: true, question });
};

export const updateQuestion = async (req, res) => {
  const oldQuestion = await Question.findById(req.params.id);

  const updated = await Question.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true }
  );

  await QuestionHistory.create({
    questionId: updated._id,
    action: "UPDATE",
    oldData: oldQuestion,
    newData: updated,
    performedBy: req.user._id,
  });

  res.json({ success: true, question: updated });
};

export const deleteQuestion = async (req, res) => {
  const question = await Question.findById(req.params.id);

  await Question.findByIdAndUpdate(req.params.id, { status: "inactive" });

  await QuestionHistory.create({
    questionId: question._id,
    action: "DELETE",
    oldData: question,
    performedBy: req.user._id,
  });

  res.json({ success: true });
};


