import express from "express";
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionsByCategory, updateQuestion, uploadBulkQuestion } from "../controller/questionController.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/", auth, getAllQuestions);
router.get("/category", auth, getQuestionsByCategory);

// bulk question upload 
router.post("/bulk-upload", auth, uploadBulkQuestion);

// add/update/delete question
router.post("/", auth ,createQuestion);
router.put("/:id", auth, updateQuestion);
router.delete("/:id", auth, deleteQuestion);

export default router;
