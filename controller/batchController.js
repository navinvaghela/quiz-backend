import Question from "../models/Question.js";
import Batch from "../models/Batch.js";
import Attempt from "../models/Attempt.js";

export const uploadBatchFromFile = async (req, res) => {
  try {
    const { batchName, batchDate, classType, category, questions, batchCode } = req.body;

    if (!batchName || !batchDate || !classType) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ success: false, message: "Invalid questions" });
    }

    const batch = await Batch.create({
      batchName,
      batchDate,
      category: category.toUpperCase(),
      classType,
      batchCode
    });

    const questionIds = [];

    for (const q of questions) {
      const newQ = await Question.create({
        question: q.question,
        options: q.options,
        correctOption: q.correctOption,
        category: q.category.toUpperCase(),
        batchId: batch._id
      });

      questionIds.push(newQ._id);
    }

    batch.questionIds = questionIds;
    await batch.save();

    res.json({
      success: true,
      message: "Batch uploaded successfully!",
      batchId: batch._id
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const parseExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const xlsx = await import("xlsx");
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    return res.json({ questions: jsonData });
  } catch (err) {
    console.error("Excel parse error:", err);
    res.status(500).json({ error: "Failed to parse Excel" });
  }
};

export const listBatches = async (req, res) => {
  const { category } = req.query;
  const userId = req.user.id;

  const filter = {};
  if (category) filter.category = category;

  const batches = await Batch.find(filter).lean();

  const attempts = await Attempt.find({
    userId,
    batchId: { $in: batches.map(b => b._id) },
  });

  const attemptMap = {};
  attempts.forEach(a => {
    attemptMap[a.batchId.toString()] = a;
  });

  const finalBatches = batches.map(b => ({
    ...b,
    attempt: attemptMap[b._id.toString()] || null,
  }));

  res.json({ success: true, batches: finalBatches });
};


export const getBatchQuestions = async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findById(batchId).lean();
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

    // populate questions
    const questions = await Question.find({ _id: { $in: batch.questionIds } }).lean();

    // maintain order as in batch.questionIds
    const idToQ = new Map(questions.map(q => [q._id.toString(), q]));
    const ordered = batch.questionIds.map(id => idToQ.get(id.toString())).filter(Boolean);

    res.json({ success: true, batch: { ...batch, questions: ordered } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
