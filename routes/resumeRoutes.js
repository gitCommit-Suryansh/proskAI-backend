import express from "express";
import multer from "multer";
import { parseResume } from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", protect, upload.single("resume"), parseResume);

export default router;
