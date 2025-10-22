import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from '../middleware/multer.js';
import { createProfile, getProfiles, getProfileById,deleteProfile,updateProfile} from "../controllers/profileController.js";
import {uploadResume, parseResume} from '../controllers/resumeController.js'


const router = express.Router();

router.post("/createprofile", protect, createProfile); // create new profile

router.delete('/deleteProfile/:profileId',protect , deleteProfile)

router.get("/getprofiles/:userId", getProfiles);    // get all profiles of logged-in user
router.get("/getprofile/:profileId", protect , getProfileById); // get single profile
router.put("/updateprofile/:profileId", protect, updateProfile);
router.post("/upload-resume", protect, upload.single('resume'), uploadResume);

router.post("/parse-resume", protect, upload.single('resume'), parseResume);

export default router;
