import Profile from "../models/Profile.js";
import User from "../models/User.js";

// Create Profile
export const createProfile = async (req, res) => {
  try {
    const { profileName, details, resumeUrl } = req.body;

    if (!profileName) {
      return res.status(400).json({ message: "Profile name is required" });
    }

    const profile = new Profile({
      userId: req.user._id,
      profileName,
      details,
      resumeUrl,
    });

    const savedProfile = await profile.save();

    // Add profileId reference to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: { profileIds: savedProfile._id },
    });

    res.status(200).json({
      message: "Profile created successfully",
      profile: savedProfile,
    });
  } catch (err) {
    console.error("Error creating profile:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all profiles of logged-in user
export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.user._id });
    res.status(200).json(profiles);
  } catch (err) {
    console.error("Error fetching profiles:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single profile by ID (only if it belongs to logged-in user)
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching profile by ID:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
