import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserById } from "../controllers/userController.js";

const router = express.Router();

router.get("/getuser/:id", getUserById); // get single user without details


export default router;
