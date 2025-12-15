import express from "express";
import multer from "multer";
import { 
  uploadBatchFromFile, 
  listBatches, 
  getBatchQuestions,
  parseExcel 
} from "../controller/batchController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/parse-excel", auth, upload.single("file"), parseExcel);

router.post("/upload-json", auth, uploadBatchFromFile);

router.get("/", auth, listBatches);

router.get("/:batchId", auth,getBatchQuestions);

export default router;
