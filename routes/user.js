import express from "express";

import { createUser, deleteUser, getUserById, getUsers, updatePassword, updateUser } from "../controller/userController.js";
import { admin, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", protect, admin, createUser);
router.put("/:id", updateUser);
router.put("/:id/password", updatePassword);
router.delete("/:id", protect, admin, deleteUser);

export default router;