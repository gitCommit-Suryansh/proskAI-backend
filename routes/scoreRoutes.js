import express from "express";
import { jdMatch } from "../controllers/scoreController.js";
const router = express.Router();

router.post("/jd-match", jdMatch);

export default router;