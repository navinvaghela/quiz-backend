// import express from "express";
// import auth from "../middleware/auth.js";
// import { finishExam, startExam, submitAnswer } from "../controller/attemptController.js";

// const router = express.Router();

// router.post("/start", auth, startExam);
// router.post("/answer", auth, submitAnswer);
// router.post("/finish", auth, finishExam);

// export default router;


import express from "express";
import { getAllAttemptsAdmin, getAttemptResult, getMyAttempts, submitAttempt } from "../controller/attemptController.js";
import auth, { admin, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/submit", auth, submitAttempt);

router.get("/:attemptId", auth, getAttemptResult);

router.get("/my/history", auth, getMyAttempts);

router.get("/", protect, admin, getAllAttemptsAdmin);



export default router;
