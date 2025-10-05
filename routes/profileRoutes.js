import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createProfile, getProfiles, getProfileById } from "../controllers/profileController.js";

const router = express.Router();

router.post("/createprofile", protect, createProfile); // create new profile
router.get("/getprofiles/:userId", getProfiles);    // get all profiles of logged-in user
router.get("/getprofile/:profileId", getProfileById); // get single profile

export default router;
