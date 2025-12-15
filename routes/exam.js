
import express from "express";

const router = express.Router();
import Exam from "../models/Exam.js"
import auth from "../middleware/auth.js"

router.post("/", auth, async (req, res) => {
  const e = await Exam.create(req.body);
  res.json(e);
});
router.get("/", async (req, res) => {
  const list = await Exam.find().sort({ createdAt: -1 });
  res.json(list);
});



export default router;
