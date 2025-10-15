import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createProfile, getProfiles, getProfileById,createDemoProfile,getDemoProfiles} from "../controllers/profileController.js";

const router = express.Router();

router.post("/createprofile", protect, createProfile); // create new profile
router.post("/createdemoprofile", protect, createDemoProfile);
router.get("/getDemoProfiles/:userId", getDemoProfiles);    // get all profiles of logged-in user


router.get("/getprofiles/:userId", getProfiles);    // get all profiles of logged-in user
router.get("/getprofile/:profileId", getProfileById); // get single profile

export default router;
